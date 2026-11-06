# Start here — completed local implementation, publishing still pending

The package contains the dashboard, eight-year IPEDS snapshot, executable data notebook, four separate role reports, a 35-task progress ledger, QA evidence, Figma link and team submission instructions.

**Actual status:** code built and tested locally. The feature branch `feature/weeks-1-3-dashboard` has been created through the signed-in browser; teammate review and merge remain pending. The dashboard is now live at https://stem-pathways-dashboard.vercel.app/ GitHub's connected app rejected branch creation with “Resource not accessible by integration.” Terminal Git has no authentication. Vercel team authorization is complete; GitHub connection and automatic deployments remain pending. Do not give anyone your password.

## Open the app now
1. Extract the ZIP and open its `project` folder in VS Code or a terminal.
2. Install Node 24 if needed.
3. Run `npm ci`, then `npm run dev`.
4. Open the local address Vite prints.
5. Run `npm test` and `npm run build` to repeat application checks.

No raw download is needed to explore the dashboard. See README.md for Python/notebook commands. Use the notebook on the feature branch until the approved PR is merged.

## Publish once — easy GitHub Desktop route
1. Sign into **your own** GitHub account in GitHub Desktop.
2. Clone `APS-Data-Technologies/STEM-Pathways-Dashboard` to a NEW folder. Confirm the repository is correct and main is up to date.
3. Create a new branch named `feature/weeks-1-3-dashboard` from main.
4. Copy the **contents** of this ZIP's `project` folder into that clone, including `.github` and `.gitignore`. The ZIP contains no `.git` directory, raw ZIP files, node_modules or dist. Do not copy the outer handover folder into the repo.
5. Review the changes. Commit with an honest message such as `Implement AI-assisted Weeks 1–3 dashboard and review package`.
6. Publish the branch. Create a pull request targeting main. Copy `docs/initial-pr-body.md` into the description.
7. Have another teammate review the application/data/report changes. Resolve comments. Merge only after the required approval and checks, following APS instructions.

**Alternative command line**, after cloning the repo and copying the project contents into it:
```bash
git switch -c feature/weeks-1-3-dashboard
npm ci
npm test
npm run build
git add .
git commit -m "Implement AI-assisted Weeks 1-3 dashboard and review package"
git push -u origin feature/weeks-1-3-dashboard
```
Use your normal Git credential manager or GitHub Desktop authentication. Open the printed compare link and create the PR. If GitHub denies write access, ask APS to confirm collaborator and app permissions; do not use another member's login.

## Who submits what?
Publish the initial project only once. Each member reads `docs/reports/role-*.md`, personally validates their assigned artifacts, and records only the work they actually performed. They can make their own small report/bugfix branch and PR, or leave a substantive review from their own account. Four duplicate project uploads are unnecessary. A teammate's review cannot be replaced by an AI claiming to be that teammate.

## What is still open?
- GitHub app write permission / actual branch and PR publishing.
- APS administrator enables protected main and one-review enforcement.
- Vercel GitHub connection, APS hosting ownership and verified automatic deployments. Public deployment is complete.
- Region, STEM family list, revised-year window and CIP-transition methodology approvals; B-18 is partial.
- Team names, Slack/Asana membership, posting/import/assignment, actual meetings, feedback and approvals.
- A teammate's real Colab run and Week 4 full device/accessibility acceptance tests.

The four role reports and progress ledger distinguish these from implemented code. Week 3 (Nov 9–13) artifacts are prepared early; no attendance or future meeting completion is claimed.
