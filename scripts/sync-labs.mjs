import { createHash } from 'node:crypto';
import { createClient } from '@sanity/client';
import { collectGithubLabs, githubApi } from './lab-source.mjs';
import { coverKey, prepareCover } from './lab-cover.mjs';
const apply = process.argv.includes('--apply');
const labs = await collectGithubLabs({ token: process.env.GITHUB_TOKEN || '' });
console.log(`Discovered ${labs.length} eligible labs.`);
if (!apply) {
  console.log('Dry run. Use --apply with SANITY_WRITE_TOKEN to sync.');
  process.exit(0);
}
if (!process.env.SANITY_WRITE_TOKEN)
  throw new Error('SANITY_WRITE_TOKEN is required.');
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vuye8s8l',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-09-11',
  useCdn: false,
  perspective: 'raw',
  token: process.env.SANITY_WRITE_TOKEN,
});
const existing = await client.fetch(
  '*[_type == "githubLabSource"]{_id,hash,image,imageKey,imageAlt,imageOrigin}',
);
const editorials = await client.fetch('*[_type == "labEditorial"]{_id,source}');
const now = new Date().toISOString();
let transaction = client.transaction();
const ids = new Set();
const json = githubApi({ token: process.env.GITHUB_TOKEN || '' });
const retiredAssets = new Set();
for (const discovered of labs) {
  const { cover, ...metadata } = discovered;
  const prior = existing.find((doc) => doc._id === discovered.sourceId);
  const imageKey = coverKey(discovered);
  let presentation = {
    image: prior?.image,
    imageKey,
    imageAlt: prior?.imageAlt,
    imageOrigin: prior?.imageOrigin,
  };
  if (prior?.imageKey !== imageKey || !prior?.image?.asset?._ref) {
    const prepared = await prepareCover(discovered, json);
    const asset = await client.assets.upload('image', prepared.bytes, {
      filename: `portfolio-lab-${discovered.sourceId}-${imageKey.slice(0, 12)}.png`,
    });
    presentation = {
      image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
      imageKey,
      imageAlt: prepared.alt,
      imageOrigin: prepared.origin,
    };
    if (prior?.image?.asset?._ref && prior.image.asset._ref !== asset._id)
      retiredAssets.add(prior.image.asset._ref);
  }
  const lab = {
    ...metadata,
    ...presentation,
    githubCoverPath: cover?.path || '',
  };
  const id = lab.sourceId;
  ids.add(id);
  const hash = createHash('sha256').update(JSON.stringify(lab)).digest('hex');
  transaction = transaction.createIfNotExists({
    _id: id,
    _type: 'githubLabSource',
    ...lab,
    hash,
    lastVerifiedAt: now,
  });
  transaction = transaction.patch(id, (patch) =>
    patch.set(
      prior?.hash === hash
        ? { lastVerifiedAt: now }
        : { ...lab, hash, lastVerifiedAt: now },
    ),
  );
  // Editor-owned fields are initialized once and never overwritten by the sync.
  const hasEditorial = editorials.some(
    (doc) =>
      doc.source?._ref === id ||
      doc._id === `editorial-${id}` ||
      doc._id === `drafts.editorial-${id}`,
  );
  if (!prior && !hasEditorial)
    transaction = transaction.createIfNotExists({
      _id: `editorial-${id}`,
      _type: 'labEditorial',
      source: { _type: 'reference', _ref: id },
      hidden: false,
      featured: false,
      order: 10,
    });
}
// Only reconcile after collectGithubLabs completed every page and validated every manifest.
for (const old of existing.filter((doc) => !ids.has(doc._id))) {
  if (old.image?.asset?._ref) retiredAssets.add(old.image.asset._ref);
  const editorial = await client.fetch(
    '*[_type == "labEditorial" && references($id)]',
    { id: old._id },
  );
  for (const doc of editorial) {
    if (doc._id.startsWith('drafts.')) {
      transaction = transaction.patch(doc._id, (patch) =>
        patch.set({ 'source._weak': true }),
      );
    } else {
      const draft = Object.fromEntries(
        Object.entries(doc).filter(
          ([key]) => !['_rev', '_createdAt', '_updatedAt'].includes(key),
        ),
      );
      transaction = transaction
        .createIfNotExists({
          ...draft,
          _id: `drafts.${doc._id}`,
          source: { ...doc.source, _weak: true },
          hidden: true,
        })
        .delete(doc._id);
    }
  }
  transaction = transaction.delete(old._id);
}
transaction = transaction.createOrReplace({
  _id: 'labSyncStatus',
  _type: 'labSyncStatus',
  lastSuccess: now,
  count: labs.length,
});
await transaction.commit();
for (const assetId of retiredAssets) {
  // Remove only importer-owned images that no remaining document uses.
  const asset = await client.fetch('*[_id == $id][0]{originalFilename}', {
    id: assetId,
  });
  const references = await client.fetch('count(*[references($id)])', {
    id: assetId,
  });
  if (asset?.originalFilename?.startsWith('portfolio-lab-') && references === 0)
    await client.delete(assetId);
}
console.log(`Synced ${labs.length} labs. Editorial overrides preserved.`);
if (process.env.PORTFOLIO_REVALIDATE_URL) {
  const url = new URL(process.env.PORTFOLIO_REVALIDATE_URL);
  if (url.protocol !== 'https:' && url.hostname !== 'localhost')
    throw new Error('Revalidation endpoint must use HTTPS.');
  const result = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.REVALIDATE_SECRET || ''}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!result.ok)
    throw new Error(
      `Sync succeeded, but cache refresh failed (${result.status}).`,
    );
}
