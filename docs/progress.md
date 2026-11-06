# Implementation progress and acceptance ledger

Stage-based acceptance ledger. AI-assisted deliverables are distinguished from actual team approvals and validation.

**Implemented** means an artifact exists and has the verification stated below. It does not replace teammate review, sponsor approval or merge. Prepared = draft/material ready for an external action; Partial = unmet technical/acceptance element; Blocked = missing permission/account connection.

| ID | Stage | Owner | Task | State | Evidence / remaining action |
|---|---|---|---|---|---|
| B-01 | Planning | Lead | Kickoff and all members join tools | Pending | Actual four-member Slack/Asana/GitHub membership unverified |
| B-02 | Planning | Lead | Asana board and task import | Prepared | task-board.csv prepared; import and named assignments pending |
| B-03 | Planning | Lead | Team norms in Slack | Prepared | product-plan.md; post, pin and four reactions pending |
| B-04 | Planning | Lead | Define dashboard questions | Awaiting review | Five questions mapped to views; actual check-in approval pending |
| B-05 | Planning | Lead | User stories and acceptance criteria | Implemented | product-plan.md; must-have and stretch separated |
| B-06 | Planning | Data | Data plan | Implemented | data-plan-and-contract.md; open scope choices flagged |
| B-07 | Planning | Data | Download IPEDS files | Implemented | 16 unmodified source ZIPs cached; URLs and checksums recorded |
| B-08 | Planning | Data | Shared Colab notebook and row counts | Awaiting review | Executed notebook committed; Colab-open link provided; shared ownership review pending |
| B-09 | Planning | UX/Viz | Five responsive Figma wireframes | Awaiting review | 10 editable frames; Slack sharing and review pending |
| B-10 | Planning | UX/Viz | Chart choices and sketches | Implemented | design.md and Figma wireframes; charts implemented |
| B-11 | Planning | QA | Repository protection and PR template | Blocked | Repo and template ready; APS administrator must protect main |
| B-12 | Planning | Lead | React/Vite/Recharts starter through PR | Awaiting review | App implemented; teammate review and merge to main pending |
| B-13 | Planning | QA | Test/number-check template | Prepared | docs/qa/test-template.csv ready; Asana link pending |
| B-14 | Core Build | Data | Agree data contract | Awaiting review | Contract implemented; Frontend and Viz sign-off pending |
| B-15 | Core Build | QA | Vercel Git integration and deployment | Partial | Public deployment READY; GitHub connection / auto-deploy unverified |
| B-16 | Core Build | Data | Join and filter region | Implemented | Annual UNITID joins, Illinois counts and sample in notebook |
| B-17 | Core Build | Data | STEM programs and readable names | Awaiting review | Six proposed families implemented; approved CIP list still needs APS |
| B-18 | Core Build | Data | Award/major rules and CIP transitions | Partial | Counting rules verified; observed changes documented; harmonization review pending |
| B-19 | Core Build | Data | Export JSON and CSV under 2 MB | Implemented | Six files; contract and checksum checks pass |
| B-20 | Core Build | Lead | Responsive dashboard layout | Implemented | React layout, mobile/desktop QA evidence in qa/results.md |
| B-21 | Core Build | Lead | Load data, row count, loading/errors | Implemented | Parallel fetch, validation, retry and matching count |
| B-22 | Core Build | UX/Viz | Annual trend chart live on Vercel | Implemented | Chart implemented and locally checked; public Vercel acceptance passed |
| B-23 | Core Build | UX/Viz | Summary helpers and definitions | Implemented | Totals/change/CAGR; hand-case tests pass |
| B-24 | Core Build | QA | Three colleges times two years checks | Implemented | Six independent standard-library raw-source comparisons pass |
| B-25 | Core Build | Lead | Core Build check-in and replan | Prepared | Review agenda and task states prepared; actual meeting/board update pending |
| B-26 | Feature Development | Lead | Shared filters | Implemented | Field, inclusive years, award level and reset |
| B-27 | Feature Development | UX/Viz | Field breakdown | Implemented | Filter-aware horizontal bar and exact table |
| B-28 | Feature Development | Lead | Institution picker and page | Implemented | Name/city search and UNITID selection |
| B-29 | Feature Development | UX/Viz | Institution charts | Implemented | Selected institution annual/field charts |
| B-30 | Feature Development | UX/Viz | Shared chart filters and empty states | Implemented | No-records message, preserved zeros, all region combinations tested |
| B-31 | Feature Development | Data | About text and review | Awaiting review | Text authored; real QA and PO review pending |
| B-32 | Feature Development | Lead | About page live | Implemented | Page implemented and linked; public Vercel acceptance passed |
| B-33 | Feature Development | Data | Document cleaning and reproducibility | Implemented | Notebook narrative, stage audit and output hash comparison |
| B-34 | Feature Development | Lead | Five-minute mid-project update | Prepared | mid-project-update.md ready; insert approved live URL before meeting |
| B-35 | Feature Development | Lead | APS check-in and feedback tasks | Pending | Future meeting date to confirm; no feedback or attendance invented |

## Publishing status
The GitHub app rejected branch creation (403: Resource not accessible by integration). The terminal has no GitHub authentication. Browser publication now uses the lead’s authorized account on `feature/stem-dashboard`; the app’s API permission error remains separate. See START-HERE.md for upload and review steps. Local commit and artifact preparation are not remote submission.

## Immediate recovery plan
1. Lead: confirm four names, membership, questions and scope; import task-board.csv into Asana and assign one actual person per row. Blank assignees intentionally avoid inventing teammates. Assign new dates explicitly for slipped tasks rather than backdating.
2. QA + APS admin: protect main and connect Vercel/GitHub; test public access and deployment triggers.
3. Data: validate CIP crosswalk/release-window decision; obtain contract approval from Lead and UX/Viz.
4. Every member: review their role report and replace only the personal-validation placeholders with real evidence. One teammate reviews the integration PR before merge.
5. Lead: hold Core Build review and book the APS mid-project check-in; log real feedback with owner and due date.
