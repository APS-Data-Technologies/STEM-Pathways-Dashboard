# STEM-Pathways-Dashboard
Team B
# STEM Pathways Dashboard

A public, interactive dashboard showing how students move into STEM college degrees, built from free federal IPEDS data.

Built by a Judson University student team as part of the **Fall 2026 APS Data Technologies Internship** (Oct 26 – Dec 11, 2026).

🔗 **Live dashboard:** _coming soon (Vercel link)_
📓 **Data cleaning notebook:** _Colab link coming soon_

> ℹ️ **Public data only.** IPEDS completions are counts of degrees awarded by college, program and award level. This project contains no individual student records.

---

## Table of contents

- [The problem](#the-problem)
- [Questions the dashboard answers](#questions-the-dashboard-answers)
- [Features](#features)
- [Tech stack](#tech-stack)
- [How it works](#how-it-works)
- [About the data](#about-the-data)
- [Getting started](#getting-started)
- [Rebuilding the data](#rebuilding-the-data)
- [How we work](#how-we-work)
- [Testing](#testing)
- [Timeline](#timeline)
- [Team](#team)

---

## The problem

Counselors, advisors and education leaders want to know which STEM fields are growing, but the federal data that answers this is large and hard to read. This dashboard turns free IPEDS data into clear, interactive charts for one region.

**Users:** K-12 counselors, college advisors and education leaders.

## Questions the dashboard answers

_The Product Owner sets the final 3–5 questions in Week 1. Examples:_

1. Which STEM fields grew fastest in the region over the period?
2. How do associate, bachelor's and master's trends differ?
3. Which colleges award the most computer science or engineering degrees?

## Features

### Must-haves (v1.0)

| # | Feature | What it does |
|---|---------|--------------|
| 1 | **Clean dataset** | STEM degree completions by field and year for one region, built by a documented, reproducible notebook. |
| 2 | **Trend chart** | Total STEM degrees awarded per year. |
| 3 | **Field breakdown** | Compare fields such as computer science, engineering, biology and math. |
| 4 | **Institution view** | Pick a college and see its STEM completions by year and by field. |
| 5 | **Filters** | Field, year (or year range) and degree level (associate, bachelor's, master's). Every chart updates. |
| 6 | **Live with About page** | Public link that works on phone and laptop, plus an *About the data* page. |

### Stretch (only if must-haves pass testing by Fri Nov 20)

- [ ] Download the filtered data as a CSV file
- [ ] Map view of colleges in the region
- [ ] Short "key findings" summary written from the data

### Out of scope

Other regions or a national view, real-time data, individual student records, certificates and doctoral degrees, enrollment/cost/salary/job-outcome or demographic data, user accounts, a database server, and forecasting.

## Tech stack

| Layer | Tool |
|-------|------|
| Data cleaning | Python + [pandas](https://pandas.pydata.org/) in Google Colab |
| Frontend | [React](https://react.dev/) + [Vite](https://vitejs.dev/) |
| Charts | [Recharts](https://recharts.org/) |
| Hosting | [Vercel](https://vercel.com/), auto-deploys from `main` |
| Design | Figma |
| Project management | Asana, Slack, GitHub |

No database is needed. Every tool is free.

## How it works

```
 IPEDS raw files (downloaded once)
            │
            ▼
 Colab notebook (Python / pandas) ── filter region → keep STEM → clean → aggregate
            │
            ▼
 Small JSON + CSV files in /public/data (committed to this repo)
            │
            ▼
 React app (Vite + Recharts) ── loads the files in the browser, hosted on Vercel
```

## About the data

**Source:** [IPEDS](https://nces.ed.gov/ipeds/) (Integrated Postsecondary Education Data System), U.S. Department of Education.

- **Completions survey:** number of awards per college, by program (CIP code) and award level.
- **Institution directory:** each college's name, state and location.
- The two are joined on the college ID (`UNITID`).

| Item | Choice | Status |
|------|--------|--------|
| Region | Illinois (all IPEDS colleges in the state) | Proposed, awaiting approval |
| STEM definition | 2-digit CIP families: **11** Computer & Information Sciences, **14** Engineering, **15** Engineering Technologies, **26** Biological & Biomedical Sciences, **27** Mathematics & Statistics, **40** Physical Sciences | Proposed, awaiting approval |
| Years | Most recent 8–10 final award years at download time | Proposed |
| Award levels | Associate, bachelor's, master's | Confirmed |
| Counting rule | First majors only (no double counting of double majors) | To confirm in Week 1 |

**Important:** numbers are **degrees awarded**, not students enrolled.

### Known limits

- CIP codes were revised in 2020, so some program codes change between years (mappings are documented in the notebook).
- Some colleges open, close or merge during the period.
- The newest years may be provisional and later revised by IPEDS.
- The dashboard uses a fixed snapshot; it does not update automatically.

### Output files (`/public/data`)

| File | Contents |
|------|----------|
| Completions | One row per `{year, unitid, institution, field_family, field_name, cip, award_level, completions}` |
| Institutions | `{unitid, name, city, latitude, longitude}` |
| Metadata | Source, years, download date, STEM list |

Each file is JSON (for the app) plus a CSV copy, kept under about 2 MB. Exact file names are defined in the data contract in `/docs`.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS) and npm

### Run the dashboard locally

```bash
git clone <repo-url>
cd <repo-folder>
npm install
npm run dev
```

Open the local URL Vite prints (usually http://localhost:5173). The cleaned data files are already in `/public/data`, so no extra setup is needed.

### Deploying

Merging a pull request into `main` redeploys the live dashboard on Vercel automatically. Every PR also gets a preview link.

## Rebuilding the data

You only need this if you want to change the region, years or STEM list, or refresh the data.

1. Open the cleaning notebook in Google Colab (link above, or the copy saved in this repo).
2. Download the IPEDS Completions and Institution Directory files for the chosen years (source links are recorded in the notebook). Don't edit raw files by hand.
3. Run the notebook **top to bottom**. Each step documents what it does, why, and row counts before and after.
4. The notebook exports the JSON and CSV files. Commit them to `/public/data` through a pull request.
5. Ask the QA & Documentation Lead to re-check the affected numbers against IPEDS.

> 💾 Colab sessions reset. Save the notebook and its outputs to GitHub after every working session.

## How we work

- **Branches:** create a feature branch for every change, e.g. `feature/field-breakdown-chart`.
- **Pull requests:** every PR needs **1 approving review** from a teammate. `main` is protected; no direct pushes.
- **Reviews:** respond to review requests within one working day.
- **Tasks and bugs:** tracked in Asana. Every task has one owner and a due date. Bugs include steps to reproduce and a priority (P1 blocks the demo, then P2, P3).
- **Stand-ups:** async in Slack: what I did, what's next, anything blocking me.
- **Secrets:** none should be needed, but if one is, it goes in `.env` and Vercel settings, never in code.

## Testing

The QA & Documentation Lead keeps the test and number-check template in `/docs` (view, filter, expected value, value shown, source, pass/fail).

- **Number checks:** dashboard totals are compared with IPEDS for at least 3 colleges × 2 years (Week 2), 10 numbers (Week 4), and a final re-check before code freeze.
- **Filters:** every filter combination shows data or a clear "no data for this choice" message.
- **Devices:** tested on phone and laptop.
- **Reproducibility:** a fresh notebook run must reproduce the committed data files exactly.
- **Readability:** every chart has a title, axis labels, units, tooltips and colorblind-safe colors.

## Timeline

| When | Phase | Key date |
|------|-------|----------|
| Mon Oct 26 | Kickoff | Teams and roles confirmed |
| Oct 26 – 30 | Week 1: Plan and design | Questions, data plan, IPEDS downloads, wireframes |
| Nov 2 – 6 | Week 2: Build the core | **First deploy by Wed Nov 4**; clean data exported |
| Nov 9 – 13 | Week 3: Build features | Mid-project check-in with APS |
| Nov 16 – 20 | Week 4: Connect and test | **Feature complete Fri Nov 20** |
| Nov 23 – 27 | Week 5: Light polish (Thanksgiving) | **Code freeze Wed Nov 25** (tag `v1.0`) |
| Nov 30 – Dec 4 | Demo prep | User guide, script, slides, backup video, dry run |
| Nov 30 – Dec 11 | Demos | 15–20 min team demo |
| Fri Dec 11 | Project ends | Reflections and hand-over |

## Team

| Role | Name | Owns |
|------|------|------|
| Product Owner (Project Lead) | _TBD_ | Dashboard questions, Asana board, wireframes, scope and demo |
| Frontend Developer | _TBD_ | React pages, filters, institution view, About page |
| Data Engineer | _TBD_ | Data plan, IPEDS download, cleaning notebook, exported files |
| Data Visualization Developer | _TBD_ | Charts and summary numbers |
| QA & Documentation Lead | _TBD_ | Testing, number checks, GitHub repo, Vercel deploys, README, user guide |

---

**APS Data Technologies × Judson University** · Fall 2026 Internship Program
