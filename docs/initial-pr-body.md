## Problem and resulting behavior
The repository previously contained a project brief only. This change adds the proposed Illinois STEM dashboard and the Implementation review package: four responsive views, shared filters, institution search, charts with exact tables, and transparent source/methodology notes.

The data pipeline uses revised 2016–2023 IPEDS Completions and same-year directories, first-major six-digit detail and the selected award levels. It exports 3,808 aggregate records and 187,386 awards. The notebook, source hashes and independent verification scripts are included.

## Validation
- `npm test`: nine passing tests, including 1,008 region filter combinations.
- `npm run build`: succeeds; non-blocking JS chunk-size warning recorded.
- `python scripts/verify_data.py`: six raw-source comparisons pass.
- `python scripts/run_notebook.py`: six code cells execute in-process; all six output files reproduce byte-for-byte.
- Local browser checks: shared filters, institution search/totals, no records, exact table, error/retry, 375/1280 px frame layouts.

## Review limits and open approvals
AI-assisted work prepared on the lead's behalf; four reports allocate role responsibilities, not four independent authorship histories. Original milestones have not been backdated. This PR does not certify completed Slack/Asana actions, teammate approvals or APS meetings.

CIP crosswalk/method and scope approvals remain pending. Public Vercel deployment is verified at https://stem-pathways-dashboard.vercel.app/; Git auto-deploy is not verified. Main protection requires APS administration. A real Colab UI run, physical-device/accessibility acceptance and the scheduled checkpoint remain open. See docs/progress.md and docs/qa/results.md.

Please review the role-specific artifacts and data contract. Do not merge until a different teammate approves and required checks pass.
