import sourceConfig from '../content/lab-sources.json' with { type: 'json' };

// Numeric identities survive renames and transfers; names are used only for links.
export const BOOTSTRAP_REPO_IDS = [1347272719];
const KINDS = new Set(['Coursework', 'Experiment', 'Project', 'Prototype']);
export const MAX_IMAGE_BYTES = 3_000_000;

export function isEligible(repo, source = sourceConfig) {
  return (
    repo?.owner?.login?.toLowerCase() === source.owner.toLowerCase() &&
    repo.owner.id === source.ownerId &&
    repo.private === false &&
    !repo.disabled &&
    !repo.fork &&
    !repo.is_template &&
    !(source.exclude || []).includes(repo.name) &&
    !(repo.topics || []).includes('portfolio-ignore')
  );
}
function shortText(value, max, label) {
  if (typeof value !== 'string' || !value.trim() || value.length > max)
    throw new Error(`Invalid ${label}`);
  return value.trim();
}
export function safePath(path) {
  return (
    typeof path === 'string' &&
    path.length <= 300 &&
    /^[a-zA-Z0-9_. /-]+$/.test(path) &&
    !path.startsWith('/') &&
    path.split('/').every((part) => part && part !== '..' && part !== '.')
  );
}
export function validateManifest(value) {
  if (
    !value ||
    value.version !== 1 ||
    !Array.isArray(value.labs) ||
    value.labs.length > 100
  )
    throw new Error('Invalid lab manifest');
  const ids = new Set();
  return value.labs.map((item) => {
    const id = shortText(item.id, 80, 'id');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || ids.has(id))
      throw new Error('Invalid or duplicate lab id');
    ids.add(id);
    const path = shortText(item.path, 300, 'path');
    if (path !== '.' && !safePath(path))
      throw new Error('Invalid relative lab path');
    const topics = item.topics || [];
    if (
      !Array.isArray(topics) ||
      topics.length > 10 ||
      topics.some((t) => typeof t !== 'string' || t.length > 60)
    )
      throw new Error('Invalid topics');
    if (item.kind && !KINDS.has(item.kind)) throw new Error('Invalid lab kind');
    return {
      id,
      path,
      title: shortText(item.title, 160, 'title'),
      summary: shortText(item.summary, 1000, 'summary'),
      topics,
      kind: item.kind || 'Coursework',
    };
  });
}
function plainText(text) {
  return text
    .replace(/<!--[^]*?-->/g, '')
    .replace(/<script\b[^]*?<\/script>/gi, '')
    .replace(/<style\b[^]*?<\/style>/gi, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
export function readmeMetadata(markdown = '') {
  const body = markdown
    .slice(0, 100_000)
    .replace(/^---\r?\n[^]*?\r?\n---\r?\n/, '')
    .replace(/<!--[^]*?-->/g, '')
    .replace(/```[^]*?```|~~~[^]*?~~~/g, '');
  const heading = body.match(/^#\s+(.+)$/m)?.[1];
  const summary =
    body
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter(
        (p) => !/^(?:#|>|[-*+]\s|\d+\.|\||\[![^]*|!\[|<|https?:\/\/)/.test(p),
      )
      .map(plainText)
      .find((p) => p.length >= 35) || '';
  const images = [
    ...body.matchAll(/!\[([^\]]*)\]\(<?([^\s)>]+)>?(?:\s+[^)]*)?\)/g),
  ]
    .map(([, alt, path]) => ({
      alt: plainText(alt).slice(0, 250),
      path: path.replace(/^\.\//, ''),
    }))
    .filter(
      (item) =>
        safePath(item.path) &&
        /\.(png|jpe?g|webp)$/i.test(item.path) &&
        !/badge|shield|icon|logo/i.test(item.path + item.alt),
    );
  return {
    title: heading ? plainText(heading).slice(0, 160) : '',
    summary: summary.slice(0, 1000),
    images,
  };
}
export function selectCover(tree, readme, repoName) {
  const candidates = [
    ...['.portfolio/cover', '.github/cover', 'cover'].flatMap((stem) =>
      ['png', 'jpg', 'jpeg', 'webp'].map((ext) => ({
        path: `${stem}.${ext}`,
        alt: '',
      })),
    ),
    ...(readme.images || []),
  ];
  for (const candidate of candidates) {
    const file = tree.find(
      (item) =>
        item.path === candidate.path &&
        item.type === 'blob' &&
        ['100644', '100755'].includes(item.mode) &&
        item.size > 0 &&
        item.size <= MAX_IMAGE_BYTES &&
        /^[a-f0-9]{40,64}$/.test(item.sha),
    );
    if (file)
      return { repoName, path: file.path, sha: file.sha, alt: candidate.alt };
  }
  return null;
}
export function labsFromRepository(
  repo,
  manifest = null,
  metadata = {},
  source = sourceConfig,
) {
  if (!isEligible(repo, source)) return [];
  if (
    !Number.isSafeInteger(repo.id) ||
    !/^[\w.-]+$/.test(repo.name) ||
    typeof repo.default_branch !== 'string'
  )
    throw new Error('Invalid repository metadata');
  const entries =
    manifest === null
      ? [
          {
            id: 'repository',
            path: '.',
            title: metadata.title || repo.name.replace(/[-_]/g, ' '),
            summary: (
              repo.description?.trim() ||
              metadata.summary ||
              'An ongoing learning project. Explore the code and project notes on GitHub.'
            ).slice(0, 1000),
            topics: (repo.topics || [])
              .filter((t) => !['portfolio-lab', 'portfolio-ignore'].includes(t))
              .slice(0, 10),
            kind: BOOTSTRAP_REPO_IDS.includes(repo.id)
              ? 'Prototype'
              : 'Coursework',
          },
        ]
      : validateManifest(manifest);
  const repoName = `${repo.owner.login}/${repo.name}`;
  return entries.map((entry) => ({
    sourceId: `gh-${repo.id}-${entry.id}`,
    repoId: repo.id,
    itemId: entry.id,
    repoName,
    title: entry.title,
    summary: entry.summary,
    topics: entry.topics,
    kind: entry.kind,
    language: repo.language || '',
    updatedAt: repo.pushed_at || null,
    url: `https://github.com/${repoName}${entry.path === '.' ? '' : `/tree/${encodeURIComponent(repo.default_branch)}/${entry.path.split('/').map(encodeURIComponent).join('/')}`}`,
    cover: metadata.cover || null,
  }));
}
export function githubApi({ fetchImpl = fetch, token = '' } = {}) {
  return async function json(
    path,
    { allowMissing = false, maxBytes = 2_000_000, allowEmpty = false } = {},
  ) {
    const response = await fetchImpl(`https://api.github.com${path}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2026-03-10',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      redirect: 'error',
      signal: AbortSignal.timeout(12000),
    });
    if (
      (allowMissing && response.status === 404) ||
      (allowEmpty && response.status === 409)
    )
      return null;
    if (!response.ok)
      throw new Error(`GitHub request failed (${response.status})`);
    if (Number(response.headers.get('content-length') || 0) > maxBytes)
      throw new Error('GitHub response too large');
    const reader = response.body.getReader();
    const chunks = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > maxBytes) throw new Error('GitHub response too large');
        chunks.push(Buffer.from(value));
      }
    } finally {
      await reader.cancel();
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  };
}
export function decodeFile(file, limit) {
  if (
    file.encoding !== 'base64' ||
    typeof file.content !== 'string' ||
    file.size > limit
  )
    throw new Error('Invalid GitHub file response');
  const bytes = Buffer.from(file.content, 'base64');
  if (bytes.byteLength > limit) throw new Error('GitHub file too large');
  return bytes;
}
export async function collectGithubLabs({
  fetchImpl = fetch,
  token = '',
  source = sourceConfig,
} = {}) {
  if (
    !/^[\w-]+$/.test(source.owner) ||
    !Number.isSafeInteger(source.ownerId) ||
    source.ownerId <= 0
  )
    throw new Error('Invalid lab organization configuration');
  const json = githubApi({ fetchImpl, token });
  const org = await json(`/orgs/${source.owner}`);
  if (
    org.id !== source.ownerId ||
    org.login.toLowerCase() !== source.owner.toLowerCase()
  )
    throw new Error('Lab organization identity changed');
  const repos = [];
  let complete = false;
  for (let page = 1; page <= 20; page++) {
    const batch = await json(
      `/orgs/${source.owner}/repos?type=public&sort=full_name&per_page=100&page=${page}`,
    );
    if (!Array.isArray(batch)) throw new Error('Invalid repository listing');
    repos.push(...batch);
    if (batch.length < 100) {
      complete = true;
      break;
    }
  }
  if (!complete) throw new Error('Repository listing incomplete');
  if (new Set(repos.map((repo) => repo.id)).size !== repos.length)
    throw new Error('Repository listing changed during pagination; retry');
  async function optionalJson(path, options) {
    try {
      return await json(path, options);
    } catch (error) {
      if (/response too large/.test(error.message)) return null;
      throw error;
    }
  }
  const labs = [];
  for (const repo of repos.filter((repo) => isEligible(repo, source))) {
    const base = `/repos/${repo.owner.login}/${encodeURIComponent(repo.name)}`;
    const ref = encodeURIComponent(repo.default_branch);
    const file = await json(
      `${base}/contents/.portfolio/labs.json?ref=${ref}`,
      { allowMissing: true },
    );
    const manifest =
      file === null
        ? null
        : JSON.parse(decodeFile(file, 100_000).toString('utf8'));
    if (manifest !== null) validateManifest(manifest);
    const readme = await optionalJson(`${base}/readme?ref=${ref}`, {
      allowMissing: true,
    });
    const metadata = readmeMetadata(
      readme && readme.size <= 100_000
        ? decodeFile(readme, 100_000).toString('utf8')
        : '',
    );
    const tree = await optionalJson(`${base}/git/trees/${ref}?recursive=1`, {
      allowEmpty: true,
    });
    if (tree && !Array.isArray(tree.tree))
      throw new Error('Invalid repository tree');
    metadata.cover = selectCover(
      tree?.tree || [],
      metadata,
      `${repo.owner.login}/${repo.name}`,
    );
    labs.push(...labsFromRepository(repo, manifest, metadata, source));
  }
  return labs;
}
