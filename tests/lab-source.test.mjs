import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isEligible,
  validateManifest,
  labsFromRepository,
  collectGithubLabs,
  readmeMetadata,
  selectCover,
  githubApi,
} from '../scripts/lab-source.mjs';
const repo = {
  id: 42,
  name: 'ml-lab',
  full_name: 'nippysky-ai-labs/ml-lab',
  owner: { login: 'nippysky-ai-labs', id: 328018110 },
  private: false,
  fork: false,
  topics: [],
  default_branch: 'main',
  description: 'A test lab',
  language: 'Python',
  pushed_at: '2026-09-11T00:00:00Z',
};
test('public organization projects need no opt-in topic', () => {
  assert.equal(isEligible(repo), true);
  for (const overrides of [
    { private: true },
    { owner: { login: 'someone-else' } },
    { owner: { login: 'nippysky-ai-labs', id: 123 } },
    { topics: ['portfolio-ignore'] },
    { name: 'portfolio-sync' },
    { name: '.github' },
    { fork: true },
    { is_template: true },
    { disabled: true },
  ])
    assert.equal(isEligible({ ...repo, ...overrides }), false);
});
test('repository renames retain the document identity', () => {
  assert.equal(
    labsFromRepository(repo)[0].sourceId,
    labsFromRepository({ ...repo, name: 'renamed' })[0].sourceId,
  );
  assert.match(
    labsFromRepository({ ...repo, name: 'renamed' })[0].url,
    /renamed$/,
  );
});
test('bootstrap kind survives renames while all public org labs are included', () => {
  const bootstrap = {
    ...repo,
    id: 1347272719,
    name: 'renamed-prototype',
    topics: [],
  };
  assert.equal(isEligible(bootstrap), true);
  assert.equal(labsFromRepository(bootstrap)[0].kind, 'Prototype');
  assert.equal(
    isEligible({ ...repo, name: 'Trustworthy-AI-Prototype-LAB', topics: [] }),
    true,
  );
  assert.equal(isEligible({ ...bootstrap, private: true }), false);
});
test('manifest IDs survive path moves and generate encoded GitHub links', () => {
  const item = {
    id: 'week-1',
    path: 'week one',
    title: 'First lab',
    summary: 'A learning exercise.',
  };
  const first = labsFromRepository(repo, { version: 1, labs: [item] })[0];
  const moved = labsFromRepository(repo, {
    version: 1,
    labs: [{ ...item, path: 'week-01' }],
  })[0];
  assert.equal(first.sourceId, moved.sourceId);
  assert.match(first.url, /week%20one$/);
});
test('rejects traversal, external paths, duplicate IDs and unsupported manifests', () => {
  const item = {
    id: 'week-1',
    path: 'week-1',
    title: 'First lab',
    summary: 'A learning exercise.',
  };
  for (const path of [
    '../private',
    '/absolute',
    'https://evil.example',
    'a/../../b',
    'a//b',
    'a/./b',
  ])
    assert.throws(() =>
      validateManifest({ version: 1, labs: [{ ...item, path }] }),
    );
  assert.throws(() => validateManifest({ version: 1, labs: [item, item] }));
  assert.throws(() => validateManifest({ version: 2, labs: [item] }));
});
test('an explicitly empty manifest means no published labs', () =>
  assert.deepEqual(labsFromRepository(repo, { version: 1, labs: [] }), []));
test('partial pagination failure aborts rather than reconciling missing projects', async () => {
  let calls = 0;
  await assert.rejects(
    collectGithubLabs({
      fetchImpl: async (url) => {
        if (!url.includes('/repos?'))
          return Response.json({ id: 328018110, login: 'nippysky-ai-labs' });
        calls++;
        return calls === 1
          ? Response.json(Array.from({ length: 100 }, () => repo))
          : new Response('', { status: 503 });
      },
    }),
    /503/,
  );
  assert.equal(calls, 2);
});
test('missing manifest produces one repo entry; invalid manifest fails entire run', async () => {
  const good = await collectGithubLabs({
    fetchImpl: async (url) =>
      url.includes('/repos?')
        ? Response.json([repo])
        : url.endsWith('/orgs/nippysky-ai-labs')
          ? Response.json({ id: 328018110, login: 'nippysky-ai-labs' })
          : url.includes('/git/trees/')
            ? Response.json({ tree: [] })
            : new Response('', { status: 404 }),
  });
  assert.equal(good.length, 1);
  await assert.rejects(
    collectGithubLabs({
      fetchImpl: async (url) =>
        url.includes('/repos?')
          ? Response.json([repo])
          : url.endsWith('/orgs/nippysky-ai-labs')
            ? Response.json({ id: 328018110, login: 'nippysky-ai-labs' })
            : Response.json({
                encoding: 'base64',
                size: 20,
                content: Buffer.from('{"version":2}').toString('base64'),
              }),
    }),
    /manifest/,
  );
});

test('owner transfer keeps stable source identity and uses the current owner URL', () => {
  const personal = { ...repo, owner: { login: 'nippysky', id: 98014260 } };
  const before = labsFromRepository(
    personal,
    null,
    {},
    { owner: 'nippysky', ownerId: 98014260 },
  )[0];
  const after = labsFromRepository(repo)[0];
  assert.equal(before.sourceId, after.sourceId);
  assert.equal(after.url, 'https://github.com/nippysky-ai-labs/ml-lab');
});
test('README title and intro are extracted without HTML, code or badge content', () => {
  const data = readmeMetadata(
    '# **Trustworthy AI**\n\n[![Build](https://badges.example/status.svg)](https://example.com)\n\nA Python/Django prototype exploring structured assessment and evidence.\n\n```sh\nexecute-this\n```\n\n![Assessment screen](docs/screen.png)',
  );
  assert.equal(data.title, 'Trustworthy AI');
  assert.match(data.summary, /^A Python\/Django prototype/);
  assert.equal(data.images[0].path, 'docs/screen.png');
  assert.equal(
    labsFromRepository({ ...repo, description: '' }, null, data)[0].summary,
    data.summary,
  );
  assert.equal(
    labsFromRepository(repo, null, data)[0].summary,
    repo.description,
  );
});
test('covers come only from bounded regular raster files in the repository', () => {
  const file = {
    path: 'cover.png',
    type: 'blob',
    mode: '100644',
    size: 200,
    sha: 'a'.repeat(40),
  };
  assert.equal(selectCover([file], {}, repo.full_name).path, 'cover.png');
  for (const override of [
    { mode: '120000' },
    { size: 4_000_000 },
    { sha: '../../private' },
    { type: 'tree' },
  ])
    assert.equal(
      selectCover([{ ...file, ...override }], {}, repo.full_name),
      null,
    );
  assert.deepEqual(
    readmeMetadata(
      '![x](https://evil.example/image.png) ![x](../outside.png) ![x](//localhost/a.png)',
    ).images,
    [],
  );
});
test('organization identity changes abort before source withdrawal', async () => {
  await assert.rejects(
    collectGithubLabs({
      fetchImpl: async () =>
        Response.json({ id: 999, login: 'nippysky-ai-labs' }),
    }),
    /identity/,
  );
});
test('oversized streamed responses abort without trusting content-length', async () => {
  const json = githubApi({
    fetchImpl: async () => new Response('x'.repeat(100)),
  });
  await assert.rejects(json('/test', { maxBytes: 10 }), /too large/);
});
