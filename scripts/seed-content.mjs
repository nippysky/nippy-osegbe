import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createClient } from "@sanity/client";
const apply = process.argv.includes("--apply");
const data = JSON.parse(
  await readFile(new URL("../content/portfolio.json", import.meta.url), "utf8"),
);
const docs = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    ...data.settings,
    cv: undefined,
    cvUrl: data.settings.cv,
  },
  { _id: "profile", _type: "profile", ...data.profile },
  ...data.work.map(({ id, image, ...rest }) => ({
    _id: `work-${id}`,
    _type: "selectedWork",
    slug: { _type: "slug", current: id },
    imageUrl: image,
    hidden: false,
    ...rest,
  })),
  ...data.experience.map(({ id, ...rest }) => ({
    _id: `experience-${id}`,
    _type: "experience",
    ...rest,
  })),
  ...data.education.map(({ id, ...rest }) => ({
    _id: `education-${id}`,
    _type: "education",
    ...rest,
  })),
];
if (!apply) {
  console.log(
    `Dry run: create ${docs.length} new portfolio documents if missing. Existing documents and legacy projects will be preserved. Use --apply to write.`,
  );
  process.exit(0);
}
const token = process.env.SANITY_WRITE_TOKEN;
if (!token)
  throw new Error(
    "Set SANITY_WRITE_TOKEN in .env.local before applying the content import.",
  );
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vuye8s8l",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-09-11",
  useCdn: false,
  perspective: "raw",
  token,
});
const existing = await client.fetch("*[]");
const backupDir = new URL("../backups/", import.meta.url);
await mkdir(backupDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
await writeFile(
  new URL(`sanity-documents-${stamp}.ndjson`, backupDir),
  existing.map((doc) => JSON.stringify(doc)).join("\n"),
);
let transaction = client.transaction();
for (const doc of docs) transaction = transaction.createIfNotExists(doc);
await transaction.commit();
console.log(
  `Imported ${docs.length} documents without replacing existing content. A document backup is saved in backups/.`,
);

console.log(
  "After verifying the imported content, set SANITY_CONTENT_READY=true on the website deployment.",
);
