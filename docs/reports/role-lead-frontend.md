# Sri Dhanush Reddy Kondapalli

Role: Product Owner and Project Lead plus Frontend

Stage: Validation and Handover. AI-assisted implementation prepared on the lead’s behalf; ownership is not a claim of individual authorship.

## Role and current position

I am responsible for the product direction and the frontend. This means keeping the dashboard focused on the questions counselors and advisors need to answer, making sure the team has clear ownership and checking that the finished screens work together. The implementation is now in Validation and Handover. The public Vercel build is available for review.

## What the implementation provides

The application has six views: Overview, STEM fields, Institutions, Compare, Map and About the data. The shared filters cover field, degree level, award years, city and institution control. I can use the latest computer science bachelor’s preset to begin a local advising conversation, then narrow it to a city and compare institutions.

The frontend also provides matching CSV downloads, saved selection links, a print action and a built-in guide. The institution page now reports only its own matching records. Unknown URL values are normalized, reversed year ranges are corrected and an empty result explains how to recover.

## How it works

src/App.jsx owns the shared selection and navigation. src/data.js validates the loaded files, applies the same filtering rules and builds safe CSV text. The URL stores the view, filters and comparison IDs so a saved link can reopen the selection. src/styles.css adapts the layout for smaller screens and printing. The application loads static files and does not need student records, accounts or a server database.

## Evidence to discuss

The release build succeeds. Fifteen automated tests cover calculations, invalid selections, CSV handling and filter behavior. The core data helpers reconcile 1,008 field, degree and year combinations. Browser checks cover 78 core-view filter cases and 12 values compared with the raw sources. The detailed evidence is in docs/qa/results.md.

## Review and next actions

I need to review the user flow myself, agree the question set and scope with the program manager, and collect each role’s review. The release implementation is published to feature/stem-dashboard through my signed-in GitHub account and is ready for the team’s review. Another teammate must approve the pull request before merge. The v1.0 tag belongs on that reviewed main commit, not on the current brief-only main branch.

I will use docs/progress.md to distinguish implementation from acceptance. I also need to coordinate the real team rehearsal, presentation and feedback. Each person should explain the part they reviewed and write their own reflection.

## Files to present

src/App.jsx; src/data.js; src/styles.css; docs/product-plan.md; docs/demo-answers.md; docs/progress.md; docs/github-team-guide.md.
