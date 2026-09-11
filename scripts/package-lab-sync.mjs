import { mkdir, copyFile } from 'node:fs/promises';
const output = new URL('../build/lab-sync/', import.meta.url);
const files = [
  ['scripts/lab-source.mjs', 'scripts/lab-source.mjs'],
  ['scripts/lab-cover.mjs', 'scripts/lab-cover.mjs'],
  ['scripts/sync-labs.mjs', 'scripts/sync-labs.mjs'],
  ['tests/lab-source.test.mjs', 'tests/lab-source.test.mjs'],
  ['content/lab-sources.json', 'content/lab-sources.json'],
  ['automation/package.json', 'package.json'],
  ['automation/package-lock.json', 'package-lock.json'],
  ['automation/lab-sync.yml', '.github/workflows/lab-sync.yml'],
  ['automation/README.md', 'README.md'],
  ['automation/gitignore', '.gitignore'],
];
for (const [source, dest] of files) {
  const target = new URL(dest, output);
  await mkdir(new URL('./', target), { recursive: true });
  await copyFile(new URL(`../${source}`, import.meta.url), target);
}
console.log('Prepared the standalone importer in build/lab-sync/.');
