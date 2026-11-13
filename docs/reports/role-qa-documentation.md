# Shraddha Patel

Role: QA and Documentation

Stage: Validation and Handover. AI-assisted implementation prepared on the lead’s behalf; ownership is not a claim of individual authorship.

## Role and current position

Shraddha owns validation, release evidence and clear documentation. The role is to check that the dashboard answers its questions correctly and that someone outside the build process can use and maintain it. The recorded checks and handover materials are ready for her independent review.

## What has been checked

Fifteen automated tests pass, including growth edge cases, missing data, invalid URLs, CSV escaping and city/control reconciliation. The data helpers cover 1,008 core region filter combinations. The independent raw-source checker matches every exported cell, while the live browser checks match 12 displayed values across Judson, Northwestern and the University of Chicago.

Seventy-eight live checks cover every field, degree level and award year across the three core data views, plus representative cities and all institution controls. Comparison totals, saved selections and a filtered CSV were checked as user scenarios. The layout was inspected at desktop size and in a 375-pixel frame. These checks are not a complete physical-device or cross-browser certification.

## What the documentation includes

The repository now has the complete B-01 to B-61 acceptance ledger with one named owner per task, setup and rebuild instructions, data definitions, a user guide, five checked question answers, a demo script, editable slides and role reports. The bug ledger records the institution count, growth sorting, renamed-institution labels, invalid saved selection and export-scope corrections.

The release instructions explain deployment, rollback and ownership. A captioned backup walkthrough supports the live demonstration. Individual reflection worksheets ask each person to describe genuine work and learning rather than supplying invented experiences.

## Evidence to discuss

The production deployment is READY at stem-pathways-dashboard.vercel.app. docs/qa/live-number-checks.json and ui-filter-checks.json contain the observed results. The notebook reproduction and crosswalk reports provide data evidence. The build still emits a non-blocking bundle-size warning, and map points can overlap in dense areas; both limitations are documented.

## Review and next actions

Shraddha should repeat the setup from README and review the live checklist herself, then record a genuine review in GitHub. An APS administrator must confirm main protection. Git-triggered preview and production deployment still need a verified connection. The Vercel project is currently under the lead’s team, so APS must confirm the ownership arrangement.

The team must still hold its rehearsal and demo, record real feedback and submit four personal reflections. The final release tag should follow teammate approval and merge. This report does not treat prepared documents as evidence that those events occurred.

## Files to present

tests/; scripts/verify_data.py; scripts/verify_questions.py; docs/qa/; docs/progress.md; docs/user-guide.md; docs/demo-script.md; docs/deployment.md; docs/github-team-guide.md.
