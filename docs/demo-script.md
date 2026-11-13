# Demo script and run order

Target duration: 18 minutes. Rehearse with the actual four presenters and adjust the pacing. The script is ready; the team presentation has not yet taken place.

| Segment | Presenter | Duration | What to show |
|---|---|---|---|
| Purpose and scope | Sri Dhanush Reddy Kondapalli | 2 minutes | Counselor problem, Illinois snapshot and five questions |
| User flow | Sri Dhanush Reddy Kondapalli | 1 minute | Shared filters, local preset, saved link and CSV |
| Charts and comparisons | Twinkle Mohan | 3 minutes | Field growth, exact tables, institution comparison and map |
| Data and reproducibility | Yoshna Bandi | 3 minutes | Notebook, first-major/detail rules, annual joins, crosswalk and hashes |
| Validation and handover | Shraddha Patel | 3 minutes | Live/source checks, responsive evidence, user guide and release gates |
| Repository and board | Sri Dhanush Reddy Kondapalli with team | 1 minute | Actual PR, named task ledger and real Asana board if available |
| Questions and feedback | All roles | 4 minutes | Record comments with an owner and next action |
| Closing reflections | All roles | 1 minute | One genuine learning point each |

## Opening

“We built this dashboard to help counselors and advisors explore STEM degree awards without working through large federal files. It covers Illinois institutions and three degree levels. The numbers describe awards, so we are careful not to call them individual students or career outcomes.”

## Three live questions

1. Overview, reset filters: How have awards changed? Show 22,744 in 2016 and 25,243 in 2023, then open the exact-value table. Mention the 2020 classification caveat.
2. STEM fields, all filters: Which field grew fastest? Sort by growth and show computer and information sciences at 38.5%.
3. Latest computer science bachelor's preset, City Chicago, Control Public: Which local institutions appear? Show 566 awards, compare Chicago State and University of Illinois Chicago, then download their 463-award two-row CSV.

Use `demo-answers.md` for the other two questions and exact filters. Keep the screenshot walkthrough available if the connection fails.

## Data explanation

Show the source manifest, then the notebook's cleaning counts. Explain UNITID joins, six-digit detail rows, first majors and the three degree levels. Show the official crosswalk audit and exact export reproduction. Explain why a missing record differs from zero and why the release-window approval is still open.

## Honest status statement

“The implementation and recorded checks are ready for review. We still need the required teammate approval and sponsor decisions before calling the release formally accepted. We will record actual feedback and personal reflections after the review.”

## Feedback capture

Use `feedback-template.csv`. Ask about scope acceptance, whether the questions fit institutional advising, the final data window, who owns Vercel and what the manager expects for individual submissions. Do not mark those decisions approved until the manager gives them.
