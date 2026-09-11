# Portfolio Lab sync

Imports public AI and Automation projects from `nippysky-ai-labs` into the Sanity content used by [osegbe.com](https://osegbe.com).

The workflow runs hourly at minute 23 and can be run from Actions. It uses GitHub's built-in token and one repository secret: `SANITY_WRITE_TOKEN`. No personal GitHub token is needed. Standard Linux runners use the Free plan's included allowance; keep paid usage blocked. Jobs have a two-minute limit.

Create a public project in the lab organization and push normally. The importer uses the README title, repository description (or README introduction), language, topics and updated date. Covers come from `.portfolio/cover.png`, `.github/cover.png`, `cover.png` (also JPG/WebP), then a relative README image. Otherwise it creates a branded cover. It never executes project code.

Sanity entries and covers are published automatically. Studio offers optional overrides, homepage featuring and hiding. Existing editorial overrides and unpublished entries are preserved. Private repos, forks, template repos, infrastructure repos and the optional `portfolio-ignore` topic are excluded. Archived coursework remains available.

To withdraw an existing entry immediately, hide or unpublish its presentation in Sanity. Repository privacy changes are reflected by the next successful import, plus the website cache. GitHub schedules can be delayed; entries unverified for 24 hours are withheld by the website.

Source scripts are maintained in the portfolio repository. Run `npm run labs:bundle` there to prepare an updated copy under `build/lab-sync/`, then commit those files here. `.portfolio/labs.json` is optional for showing several folders as separate labs; a normal repository requires no manifest.
