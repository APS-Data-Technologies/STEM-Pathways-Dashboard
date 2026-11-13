# Product plan and team agreement — B-03 to B-05

Proposal for review, not minutes of a meeting.

## Four-member ownership
| Person | Role | Responsibility |
|---|---|---|
| Sri Dhanush Reddy Kondapalli | Product Owner / Project Lead + Frontend | Scope, backlog, coordination, React pages, shared filters and integration |
| Twinkle Mohan | UX/UI + Data Visualization | Figma, chart selection, Recharts, accessible presentation, summary helpers |
| Yoshna Bandi | Data Engineer | IPEDS sources, notebook, data contract, cleaning and exports |
| Shraddha Patel | QA & Documentation | Independent checks, test records, GitHub workflow, deployment and documentation |

The scope document lists five roles; this four-person allocation combines Product Owner with Frontend and assigns B-09 wireframes to UX/UI + Data Visualization. Each task still has one accountable owner. Confirm this allocation with APS. These reports organize AI-assisted deliverables by responsibility; they do not assert that four people authored the work.

## Five questions and acceptance criteria
| Question | User story | View / acceptance criteria |
|---|---|---|
| How have Illinois STEM awards changed over time? | As a counselor, I want an annual trend so I can describe the direction of awards. | Overview line chart; one point per reported year, missing years are gaps, exact table values match source. |
| Which STEM fields grew fastest? | As an advisor, I want start/end totals and comparable growth for each field. | STEM fields chart + comparison table; percent change and CAGR use selected endpoints and show unavailable for a zero/missing baseline. |
| How do associate, bachelor's and master's awards differ? | As an education leader, I want to compare degree levels without mixing definitions. | Overview degree-level bar chart; shared degree filter affects every chart and summary. |
| Which institutions award the most in a selected field? | As a counselor, I want to find relevant colleges. | Overview top eight ranking with totals; field/year/degree filters apply; links open the selected college. |
| What is one institution's STEM profile? | As an advisor, I want institution-specific trends and field totals. | Searchable institution picker; both charts and summary use the selected UNITID. |

Questions are drafted and mapped to views; B-04 remains awaiting actual check-in approval.

## Must-have stories
1. Clean data: a fresh notebook run reproduces all six committed JSON/CSV files byte-for-byte from the recorded source snapshot; every output <2 MB.
2. Trend: labeled award-year and degrees axes, tooltip, exact-value table, correct missing-data behavior.
3. Fields: six readable CIP family names, totals match selected rows, same filtering as trend.
4. Institutions: search by name/city, select institution, preserve shared filters, distinguish no records from zero.
5. Filters: field, inclusive year range, degree level; reset restores defaults; reversed range changes are normalized.
6. Hosting/About: phone and laptop layout; About accessible from every view; provenance/limits included; public Vercel link and Git auto-deployment verified before acceptance.

Stretch decision: the lead requested the useful additions. Filtered CSV, a geographic institution view and filter-aware findings are implemented alongside institution comparisons and local filters. The source and UI checks are recorded in qa/results.md. Posting the decision to Slack remains a team action.

## Proposed team norms — copy to Slack after agreement
- Async daily update: Completed / Next / Blocked / task ID and link.
- Stage check-in: agree the review with all four roles.
- Each task has one owner; request help early and record blockers in Asana.
- Every change uses a branch and pull request. At least one other teammate approves before merge. Respond promptly to review requests.
- Keep public-data credentials out of Git. No credentials are needed for this static app.
- Record genuine work and AI assistance. Do not backdate reports or invent meetings, approvals, or work hours.

Slack posting/pinning, reactions, Asana assignment and stage reviews remain human actions, not completed by creating this file.
