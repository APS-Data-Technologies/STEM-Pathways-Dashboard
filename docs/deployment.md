# Deployment and maintenance

Production: https://stem-pathways-dashboard.vercel.app/

Project: stem-pathways-dashboard. Production deployment `dpl_9VKsE1nDJDRU8VAGJrstHckoCKKQ` is READY. The alias points to the release candidate with city/control filters, comparisons, map, findings and CSV export. Node 24, `npm ci`, `npm run build`, output `dist`. The deployed source was submitted directly to the existing Vercel project, not fetched from a newly pushed Git commit. No secret environment variables are needed.

## Git integration acceptance

The project does not yet have a verified Git connection. An authorized owner should open Project Settings, Git and connect APS-Data-Technologies/STEM-Pathways-Dashboard, retaining the existing project and domain. Set the production branch to main after the reviewed integration PR merges. Open a small follow-up PR to verify a preview deployment, then merge it to verify an automatic production deployment. Record the exact commit and deployment IDs. Do not create a duplicate project or change domain ownership to simulate this step.

## Publishing a reviewed update

Run `npm ci`, `npm test`, `npm run build`, the data checks and the browser regression. Push a feature branch, request another teammate's review and merge only after approval. With Git integration connected, Vercel should build the reviewed main commit automatically. Confirm READY and test the public alias in a signed-out browser. Without Git integration, an authorized project owner may deploy the tested source directly and record its source manifest.

## Rollback

In Vercel, open this project's deployments, select the previous verified production build and choose the rollback/promote action. The preceding deployment was `dpl_DkDpAGyXkmtRCYE4QcsrMrZdMQ72`. Verify the alias and key totals after rollback. Then fix the regression in a reviewed PR. A rollback restores application files, not an external database; this app has no database.

## Ownership and cost

The repository is under APS-Data-Technologies. Vercel currently belongs to the lead's team, not a confirmed APS-owned team. APS must confirm the agreed ownership/access arrangement. No paid services, map keys or database were added. Do not transfer ownership or enable paid features without the owner's decision.
