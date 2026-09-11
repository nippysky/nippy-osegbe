# Development and maintenance

Use Node 22.12 or newer (Node 24 LTS is also supported).

```sh
npm ci
npm run dev
```

The default theme is dark; visitors can switch to light. The existing NIPPYSKY logo and favicon assets are preserved. The website is usable without the optional spatial interaction. Reduced motion, keyboard navigation, narrow layouts and semantic headings are built into the components.

Routes: `/`, `/work`, `/about`, `/lab`. `/projects` redirects permanently to `/work`. The supplied current CV is available at `/cv/chukwudubem-osegbe-cv.pdf`.

## Content and Sanity

Studio lives independently in `backend/`:

```sh
npm ci --prefix backend
npm run dev --prefix backend
npm run build --prefix backend
```

The existing project is `vuye8s8l`, dataset `production`. Keep these values aligned with `backend/sanity.config.ts` and `backend/sanity.cli.ts`; changing the website env alone does not retarget Studio. Public content queries use a fixed API date, published perspective, CDN and five-minute revalidation. `content/portfolio.json` is the initial fallback before the new content model is seeded. After importing and verifying the new records, set `SANITY_CONTENT_READY=true` on the website. This explicit cutover respects empty or unpublished collections; a CMS outage shows an unavailable state and never restores bundled projects.

Local configuration is stored in the ignored `.env.local` file. The normal setup has five values: `NEXT_PUBLIC_SANITY_PROJECT_ID=vuye8s8l`, `NEXT_PUBLIC_SANITY_DATASET=production`, `SANITY_CONTENT_READY`, `SITE_INDEXABLE`, and `SANITY_WRITE_TOKEN`. The write token is used by administration scripts locally and by GitHub Actions; the public website can read this public dataset without it. Keep tokens out of Git. The Sanity API behaviour date is fixed in code.

See [how the site works](how-the-site-works.md) for the content flow and editing responsibilities. To populate the redesigned CMS, set a dedicated `SANITY_WRITE_TOKEN`, then:

```sh
npm run content:seed
npm run content:seed -- --apply
npm run labs:sync
npm run labs:sync -- --apply
```

Commands without `--apply` are dry runs. The portfolio seed first backs up existing documents to ignored `backups/`, then uses create-if-missing mutations. It does not replace edited content or delete legacy records. The document backup references existing assets; use the standard Sanity dataset export for a complete portable asset backup before destructive operations. The legacy project/about/testimonial schemas and their Studio navigation have been removed. Existing remote records are preserved by the importer and excluded from all website queries.

Sanity sections: Profile & AI/ML focus; Site settings & CV; Selected work; Experience; Education; AI & Automation lab presentation; GitHub sources & sync. In Selected work, company case-study links are the destination. Do not duplicate company article bodies here.

Images shipped in `public/work/` come from the company's published work and official product pages. Attribution and source URLs are recorded in `content/asset-sources.json`. The Citizen Monitors image depicts its website, not the mobile application.

### Optional draft preview

This advanced feature is disabled in the minimal setup. Its credentials are deliberately omitted from both env files. Only add them if draft preview is wanted.

Set a server-only `SANITY_READ_TOKEN` with draft read access and a random `SANITY_PREVIEW_SECRET` of at least 24 characters. Open:

```
https://your-preview-domain/api/draft?secret=YOUR_SECRET&path=/about
```

Supported paths: `/`, `/work`, `/about`, `/lab`. Never publish that secret URL or put it in a public Studio build. Preview requests bypass the CDN and data cache. The preview banner includes an Exit preview action.

Immediate refresh is also optional and omitted from the normal setup. To enable it later, configure a Sanity webhook to POST to `/api/revalidate` with `Authorization: Bearer YOUR_REVALIDATE_SECRET`. The server requires a random `REVALIDATE_SECRET` of at least 24 characters. Without the webhook, public content still revalidates every five minutes.

## Automatic AI, ML & Automation Lab

Public projects in [nippysky-ai-labs](https://github.com/nippysky-ai-labs) are imported automatically. No topic is required. Organization configuration is in `content/lab-sources.json`; it pins both the name and GitHub account ID. The Trustworthy AI repository was transferred there without changing its numeric repository ID.

The importer supplies titles, summaries, covers, language, topics, dates and code links. Titles prefer a README heading; summaries prefer the GitHub description, then the first useful README paragraph. Covers prefer `.portfolio/cover`, `.github/cover`, or `cover` with PNG/JPG/WebP extension, then a relative README image. Files must be regular raster files from the same public repository, at most 3 MB. Missing or unsuitable images get a generated branded cover. External README images, SVGs, badges and symlinks are not imported.

Sanity receives published source and presentation documents automatically. Optional Studio overrides always take priority. Unpublishing or deleting an existing presentation keeps it off the site. Sync does not recreate it. Archived coursework remains eligible; private repos, forks, templates, `.github`, `portfolio-sync` and the optional `portfolio-ignore` topic are excluded.

For several coursework folders in one repository, add `.portfolio/labs.json`:

```json
{
  "version": 1,
  "labs": [
    {
      "id": "image-classification",
      "path": "computer-vision/week-04",
      "title": "Image classification",
      "summary": "What I investigated and built in this lab.",
      "topics": ["machine-learning", "computer-vision"],
      "kind": "Coursework"
    }
  ]
}
```

Keep each `id` stable when moving folders. An empty labs array intentionally publishes no entries for that repository. No manifest means one entry for the whole repository. The importer reads bounded metadata, JSON, README text and approved raster images; it never runs notebooks, imports repository code or renders arbitrary HTML/MDX. Dates are labelled **Repository updated** because they reflect the repository, not a specific coursework folder.

### Scheduled mirroring

The active workflow is in the private [nippysky-ai-labs/portfolio-sync](https://github.com/nippysky-ai-labs/portfolio-sync) repository. It runs at minute 23 each hour and supports **Actions → Sync portfolio labs → Run workflow**. The initial cloud run passed on 11 September 2026.

- One repository secret: `SANITY_WRITE_TOKEN`, already installed encrypted.
- GitHub supplies its built-in temporary token; no personal token or `LAB_SYNC_ENABLED` variable is needed.
- The project (`vuye8s8l`) and dataset (`production`) are fixed in that workflow.
- Normal website cache revalidation handles publication; no revalidation URL or secret is needed.
- GitHub Free and an Actions **$0 budget with Stop usage enabled** prevent paid overage. Each standard Linux job has a two-minute limit. Exhausted free allowance stops jobs.

The source templates are under `automation/`. After changing the importer, run `npm run labs:bundle` to prepare `build/lab-sync/`; copy those files into a checkout of the private sync repository, commit and push, then run the workflow once. The exporter copies an explicit file list and never includes `.env.local`. Keep the dependency lock in `automation/package-lock.json` aligned with its small package manifest. The portfolio repository’s own workflow only runs importer checks, so there is one publishing schedule.

GitHub schedules are best effort. The private automation repository avoids the 60-day inactivity rule that applies to public repository schedules.

A failed or partial discovery never reconciles absent items. A successful complete scan withdraws records that have lost eligibility and preserves editorial copies as drafts. Public source documents and unreferenced importer-owned cover assets are deleted on withdrawal; a hidden flag alone is not a privacy boundary in a public dataset. The frontend also excludes mirrors not verified within 24 hours and displays an unavailable message when synchronization is stale or a source request fails. Sanity's sync status shows the last successful run. Privacy changes can take one sync interval plus cache refresh to reach the website.

## Validation

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run typecheck --prefix backend
npm run build --prefix backend
```

The focused sync tests cover eligibility, stable identities, invalid manifests/path traversal, intentional empty manifests, failed pagination, and missing manifests. Public endpoint smoke checks cover pages, redirects, CV and guarded preview/revalidation endpoints.

Next.js is 16.3.4, React 19.3.0, Sanity 6.13.1 and Tailwind 4.3.3. TypeScript 6.0.3 and ESLint 9.39.5 are the newest versions compatible with the current Next lint tooling. The frontend uses `@sanity/client` directly; it does not need the full Studio package or next-sanity in its browser dependency tree.

## Search and sharing

Every main route has a unique title, description, canonical URL, Open Graph data and a large social preview image using the original logo. Server-rendered JSON-LD connects the personal website to the GitHub and LinkedIn profiles with `Person.sameAs`, and models NIPPYSKY separately as the founded organisation. The About page has `ProfilePage` markup. No reviews, ratings, invented statistics or keyword stuffing are included.

Set `SITE_INDEXABLE=true` **before building the production deployment**. The generated robots file is part of the build; rebuild and redeploy after changing this flag, then verify the served robots file and page metadata. Preview deployments default to `noindex` and a restrictive robots file, while canonical URLs consistently point to `https://osegbe.com`. Authenticated draft pages always emit `noindex` even in production. Verify a Domain property for `osegbe.com` through DNS in [Google Search Console](https://search.google.com/search-console/). This needs no website environment variable and remains independent of deployments. After publishing, submit `https://osegbe.com/sitemap.xml` and inspect the four canonical URLs in Search Console. Link back to osegbe.com from your GitHub and LinkedIn website fields to reinforce the same identity.

These signals help search engines understand identity and content, but ranking, rich results and grouping with external profiles remain search-engine decisions. References: [Google profile structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page) and [Next.js metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images).

## Deploying the Studio and website

Run Studio commands from the repository root:

```sh
npm run typecheck --prefix backend
npm run build --prefix backend
npm run deploy --prefix backend
```

Inside `backend/`, the equivalent deployment command is `npm run deploy` (or `npx sanity deploy`). The existing Studio at https://nippy-osegbe.sanity.studio/ has been deployed with the new schema. Its hostname and application ID are saved in the CLI configuration. Deploy again whenever you change schemas, Studio configuration or Studio dependencies. Use your Sanity CLI login for deployment; the content write token intentionally has no Studio deployment permissions. This publishes the editor and its schema; it does not import the new portfolio documents or deploy the Next.js website. [Sanity deployment reference](https://www.sanity.io/docs/cli-reference/deploy).

The initial migration is complete. For a fresh installation, configure the values described above in `.env.local`, including `SANITY_WRITE_TOKEN`, then run these from the repository root:

```sh
npm run content:seed
npm run content:seed -- --apply
npm run labs:sync
npm run labs:sync -- --apply
```

Review the imported documents in Studio, set `SANITY_CONTENT_READY=true` in the website environment, and deploy the website. Set `SITE_INDEXABLE=true` only for production. Seed is an initial import; repeating it only creates missing records and will not update edits from the bundled JSON. Edit ordinary portfolio content in Studio and click Publish. No Studio redeployment is needed for content edits: the website refreshes within about five minutes, or on the configured revalidation webhook.

For later GitHub changes, the active hourly workflow handles publication. Use `npm run labs:sync -- --apply` only when you want a manual local refresh. No Studio redeployment is needed for a lab sync. Both GitHub and the website must use the same Sanity project and dataset.


Use the existing Next.js-compatible host with `npm run build`, then `npm start` where required. Configure the website’s project, dataset and flags as described above, including `SITE_INDEXABLE=true` before its production build and `SANITY_CONTENT_READY=true` for the imported content. The public website does not need `SANITY_WRITE_TOKEN`; keep that credential in your local administrative environment and GitHub Actions secrets. Keep the Studio deployment separate. The default canonical origin is `https://osegbe.com`; preview hosts should not replace production canonical links.

Sanity imports, live Studio deployment, production deployment, secrets configuration and workflow activation are separate from the checked-in source. No credentials are included. Keep the previous deployment for rollback.

The frontend dependency audit is clean. The latest Sanity CLI still reports two underlying moderate advisories across 11 dependent packages, with no high/critical findings after compatible patches. The remaining upstream advisories are `adm-zip` archive extraction and `typeid-js`’s `uuid` dependency. Compatible `js-yaml` and `smol-toml` patches are scoped in the Studio package overrides. Avoid a forced downgrade of Sanity to clear the report.

## Content notes

Company project years follow current NIPPYSKY pages. Employment periods follow the supplied CV separately. Fidelity Bank is shown as “From May 2023” because the CV's November 2026 end date is in the future at the time of the rebuild. The downloadable CV itself is the supplied original and has not been rewritten.

## Setup completed on 11 September 2026

- Created the free `nippysky-ai-labs` organization and transferred Trustworthy AI.
- Imported 16 portfolio documents with a local document backup.
- Published the first Lab source and presentation with an automatic cover.
- Enabled the private hourly workflow and verified a [successful cloud import](https://github.com/nippysky-ai-labs/portfolio-sync/actions/runs/34645443533).
- Deployed the updated Studio and schema to https://nippy-osegbe.sanity.studio/.
- Set local `SANITY_CONTENT_READY=true`; production hosting must set it independently.
- Verified the organization’s $0 Actions spending budget and stop-usage control.

The website’s production deployment still needs the rebuilt code and production flags. Studio deployment is separate from content publishing.
