# How the four members contribute to GitHub

## One repository, individual accounts
Use the APS repository. Do not create four repositories or upload the whole project four times. The initial implementation is one AI-assisted local integration branch prepared on the user's behalf. The connected app rejected writes, but the lead’s signed-in browser successfully created the feature branch for publication. Review and merge remain pending. It is not four students' independent commit histories. Each person should understand and validate the part they own and record their real contribution.

The README requires one teammate approval per PR. It does not require each person to upload duplicate files. Non-code work (a reviewed design, QA result or report) is also a legitimate contribution. If an assessor expects individual evidence, each person should submit a small genuine report/validation PR or a substantive review from their own account; confirm any additional assessment rule with APS.

## What each member updates
| Role | Files or evidence to own | Useful first contribution |
|---|---|---|
| Lead + Frontend | `src/App.jsx`, `src/styles.css`, `docs/product-plan.md`, `docs/reports/role-lead-frontend.md` | Review scope, run app, record actual decisions and frontend checks |
| UX/UI + Visualization | Figma, `src/components/Charts.jsx`, `src/data.js`, `docs/design.md`, own report | Review mobile charts and labels, verify one calculation, record design feedback |
| Data Engineer | `scripts/`, `notebooks/clean_ipeds.ipynb`, `public/data/`, `data/source-manifest.json`, data contract, own report | Run notebook, investigate CIP crosswalk and final-release window, record result |
| QA & Documentation | `tests/`, `docs/qa/`, README, workflow/templates, own report | Independently repeat six source checks, review PR, coordinate Vercel and branch protection |

## Before the initial integration PR is merged
Review the integration branch `feature/stem-dashboard`. For review-only activity, open the PR → Files changed → Review changes → leave findings / approve only after checking. A PR author cannot approve their own PR. Do not manufacture an approval with another person's account.

To run that branch:
```bash
git clone https://github.com/APS-Data-Technologies/STEM-Pathways-Dashboard.git
cd STEM-Pathways-Dashboard
git switch --track origin/feature/stem-dashboard
npm ci
npm test
npm run dev
```

If fixes are needed before merging, create a personal branch from the integration branch and open its PR **into `feature/stem-dashboard`**. This avoids pretending the unmerged implementation exists on main. The integration PR will then include the reviewed fix.

## Normal workflow after integration is merged
```bash
git switch main
git pull --ff-only origin main
git switch -c docs/ux-visualization-review
# Edit only your actual work and report.
git add docs/reports/role-ux-visualization.md
git commit -m "docs: record design review and actual validation"
git push -u origin docs/ux-visualization-review
```
Open Compare & pull request, choose `main` as base, describe task IDs, changes, test evidence and AI assistance, request a different teammate, address comments, then merge only after approval and passing checks. Use a descriptive unique branch for each change. Never share passwords, tokens or accounts.

For a documentation-only change, GitHub's file editor is sufficient: open your report → Edit → make the real update → choose a **new branch** and propose a pull request. Do not commit directly to main. If you have no write access, ask the APS repository administrator to add you; don't use another student's login.

## Report update format
Add your actual name/GitHub handle, date, work you personally performed, artifact or PR link, checks and observed results, blockers and next actions. Keep the initial AI-assisted preparation section. Never convert planned tasks into past-tense personal claims without doing them.

## Administrator action — B-11
The repository inspection found `main` unprotected, although the original README said it was protected. The connected account can push but cannot administer settings.

An APS administrator should protect `main` with: require a pull request, at least one approving review, dismiss stale approvals, require the `validate` check after it appears, and prevent bypass/direct pushes according to APS policy. Verify settings and a non-destructive rejected direct-push test on an administrator-approved disposable change. Do not push test content into main here. Record evidence in QA report.

## Vercel connection — B-15
The API rejected linking the APS repository because the Vercel account lacks a GitHub Login Connection. The project was subsequently created without Git linking. See `deployment.md` for actual deployment status.

The authorized project owner must connect GitHub in Vercel, authorize only the required repository through the normal account flow, and obtain APS organization installation approval if requested. Then connect this repository, set Vite / build `npm run build` / output `dist` / Node 24, production branch `main`, and enable PR previews. Follow APS ownership requirements; transfer the project if needed. Verify a real approved merge redeploys and a new PR gets a preview. Do not mark B-15 done just because a manual preview loads.

## What never gets uploaded
No `node_modules/`, `dist/`, unmodified raw ZIP archives, `.env`, personal credentials or invented time sheets. Data Engineer uploads notebook + scripts + compact exports + source manifest. Designer links Figma and commits export images only if useful. QA commits reproducible evidence, not fabricated approvals.
