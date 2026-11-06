# Start here — STEM Pathways Dashboard

**Current stage: Feature Development / Validation.** The dashboard implementation is published on `feature/stem-dashboard` and hosted at https://stem-pathways-dashboard.vercel.app/. Teammate review and merge remain pending. GitHub writes were made through the lead’s authorized browser account; the connected app’s API permission limitation is separate.

## Run the project
```bash
git clone https://github.com/APS-Data-Technologies/STEM-Pathways-Dashboard.git
cd STEM-Pathways-Dashboard
git switch feature/stem-dashboard
npm ci
npm test
npm run dev
```

For the downloadable ZIP, use its `project/` folder. Node 24 is recommended. `npm run build` creates the production output. The compact data exports are included; no raw download is needed to explore the dashboard. See README.md for notebook and Python rebuild commands.

## Team workflow
The initial project is uploaded once. Each person validates the work assigned to their role, records actual findings and makes genuine changes through their own GitHub account. Four duplicate uploads are unnecessary.

- **Project Lead + Frontend:** scope, coordination, frontend and one combined role report.
- **UX/UI + Data Visualization:** Figma, charts, labels, measures and role report.
- **Data Engineer:** notebook, source/method review, exports and role report.
- **QA & Documentation:** independent checks, issues, documentation, PR review and role report.

Before the integration PR merges, create fixes from `feature/stem-dashboard` and target that branch. After merge, start new descriptive branches from `main`. Every PR needs another teammate’s approving review. Do not share accounts or claim another person’s work. See docs/github-team-guide.md.

## What remains open
- Another teammate’s review, passing remote checks and approved merge.
- APS administrator enables protected main and review enforcement.
- Vercel GitHub connection, APS hosting ownership and verified automatic deployments.
- Scope, revised-year window, data contract and CIP methodology approvals.
- Real team membership, Slack/Asana actions, meetings and feedback.
- A teammate’s Colab run and full physical-device/accessibility acceptance.

The role reports and docs/progress.md distinguish implemented work from pending validation. Reports are available as Markdown and PDF in docs/reports/.
