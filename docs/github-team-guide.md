# How the four roles contribute to GitHub

Use one shared repository and your own GitHub account. Nobody needs to upload another complete copy of the dashboard. A genuine review, a focused correction or a personal reflection is a useful individual contribution. The current implementation is AI-assisted work prepared for the lead; role ownership alone is not proof of personal authorship.

| Person | What to review or update |
|---|---|
| Sri Dhanush Reddy Kondapalli | Review the user flow, questions, scope and release checklist. Coordinate PR 1 and the program-manager discussion. |
| Twinkle Mohan | Check charts, labels, accessible tables, mobile layout and the new comparison/map views. Update design notes or code for genuine findings. |
| Yoshna Bandi | Run the notebook and source checks, review the crosswalk and schema, and record the result in the data role report. |
| Shraddha Patel | Repeat the live checklist, check source numbers and setup instructions, and record findings or approval in the PR. |

## A focused contribution

```bash
git clone https://github.com/APS-Data-Technologies/STEM-Pathways-Dashboard.git
cd STEM-Pathways-Dashboard
git switch feature/stem-dashboard
git pull --ff-only
git switch -c review/chart-labels
# Make a genuine change, then run the relevant checks.
git add docs/design.md
git commit -m "Clarify chart labels and comparison scales"
git push -u origin review/chart-labels
```

Open a pull request into the integration branch while the main integration PR is open. After the integration merges, branch from main and target main. Use descriptive branch names such as `review/data-contract`, `fix/empty-state` or `docs/reflection`; do not put project calendar periods in names.

For a documentation-only change, GitHub's pencil editor can create a new branch and PR. Write what you actually checked, your result and the files affected. Do not create empty commits merely to appear in the contribution graph.

## Review and merge

The integration PR is https://github.com/APS-Data-Technologies/STEM-Pathways-Dashboard/pull/1. One teammate other than the author must review the actual diff and approve before merge. An APS administrator should enforce that rule on main. A lead cannot approve their own PR on behalf of another person.

Each person should replace their reflection worksheet with their own account of the work they reviewed, changed and learned. The lead can collect reports centrally if the program manager allows it, but individual review evidence remains useful. No passwords or tokens belong in this repository or in chat.
