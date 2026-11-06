# Data plan and contract — B-06, B-14, B-18, B-23, B-31

Schema version 1. Implemented consistently by pipeline and application; Project Lead + Frontend and UX/UI + Data Visualization sign-off is pending.

## Decisions and open approvals
- Region: Illinois, annual HD directory `STABBR=IL`. Working assumption; APS/Harish approval pending.
- STEM: reported two-digit CIP families 11, 14, 15, 26, 27, 40. This is the project's limited definition, not a claim to cover all federal STEM classifications. Approval pending.
- Years: 2016–2023, eight archives with revised Completions (`_rv.csv`) members verified. The downloaded 2024 archive lacked a revised member and was excluded. APS must confirm the selected window meets its final-release requirement. A missing revised member alone is not proof a year is provisional.
- Awards: `AWLEVEL` 3 associate, 5 bachelor, 7 master. Convert padded string codes such as `03` to integers before selection.
- Counting: `MAJORNUM=1`, `CTOTALT`; six-digit CIP detail only. Exclude all-program/family subtotal rows and second majors to avoid double counting. Counts are awards, not unique people.
- Join: each year's completions to that same year's directory by UNITID. Keep closed/historical institutions; do not join everything to the latest directory.
- Institution names are historical in completion rows; the picker uses the latest directory entry available for each UNITID. UNITID is the grouping key, not name.
- Preserve reported zeros. No matching source row means missing/no records, not a fabricated zero.
- Sort output deterministically and use UTF-8 with newline endings. Raw ZIPs remain unmodified and uncommitted; checksums, selected archive member and URLs are recorded in `data/source-manifest.json`.

## CIP transition decision — review still required
2016–2019 uses CIP 2010; 2020–2023 uses CIP 2020. The pipeline aggregates within the family reported for each year, with observed code additions/removals in `docs/qa/cip-transition.json` and complete inventories by year. It does **not** claim a validated longitudinal crosswalk or silently move programs across families. The UI warns when a range crosses 2020. An observed new/absent code can also reflect a college's program activity, not solely a classification change.

B-18 is partial until the Data Engineer verifies the official [NCES crosswalk](https://nces.ed.gov/ipeds/cipcode/crosswalk.aspx?y=56), documents whether any moves cross the six selected family boundaries, and APS accepts either an explicit as-reported series or a validated remapping. Do not interpret all observed growth as real program growth.

## Files and fields
Every file is in `public/data`, with a JSON version for the app and CSV copy.

| File | Grain / required fields |
|---|---|
| completions.json / .csv | One row per year × UNITID × family × award level: `year` integer; `unitid` integer; `institution` string; `field_family` two-character string; `field_name` string; `award_level` enum; `completions` nonnegative integer |
| institutions.json / .csv | One row per UNITID: `unitid` integer, `name`/`city` strings, `latitude`/`longitude` number or null, `directory_year` integer, `years_present` integer array (CSV string serialization) |
| metadata.json / .csv | Object with schema_version, region/state, years, award_levels, fields, source details, snapshot date, counting/missing/CIP rules, row and institution counts. CSV is `key,value`; nested values JSON encoded. |

The scope's example includes `cip`; this compact contract intentionally aggregates to two-digit `field_family` and omits six-digit `cip` from the app export. Full six-digit detail is retained in the raw source and the notebook's cleaning stage. This aggregation is proposed under the scope's size-budget allowance and needs contract sign-off.

## Summary definitions and hand calculation
- Total: sum of `completions` across all selected years, fields, levels and (when selected) one institution.
- Change: `(last / first - 1) × 100` using the selected start/end year totals.
- Annualized growth: `((last / first) ** (1 / (endYear-startYear)) - 1) × 100`. This is CAGR, not the arithmetic mean of yearly percentages.
- Missing endpoint, zero starting value, or same-year range: growth unavailable. Positive start and zero end: −100%.
- Institutions with awards: distinct UNITIDs with at least one positive selected count; not the 328-directory count.
- Hand check: 100 awards in 2020, 121 in 2022 → 221 selected total if no 2021 row; change 21%; CAGR 10%; 2021 displayed as missing.

Calculation tests include this example and boundary cases. All display rounding occurs after calculations.

## Source links
[IPEDS downloads](https://nces.ed.gov/ipeds/use-the-data/download-access-database); [CIP resources](https://nces.ed.gov/ipeds/cipcode/resources.aspx?y=55). Each annual archive URL and SHA-256 is in the source manifest. Rebuilds verify hashes; upstream changes require a documented snapshot refresh and QA re-check.

## Sign-off record
| Reviewer | Decision | Date / evidence |
|---|---|---|
| Project Lead + Frontend | Pending | Fill after reviewing schema and scope |
| UX/UI + Data Visualization — Data Visualization | Pending | Fill after reviewing labels and measures |
| QA & Documentation — QA, About-text review | Pending | Fill after independent review |
| APS / Harish — region, STEM, release window and CIP method | Pending | Link actual approval |

## Notebook execution evidence
All six code cells ran in order using `python scripts/run_notebook.py` and saved real IPython outputs. This host blocks both TCP and IPC Jupyter kernel sockets, so execution used an in-process IPython runner. A Colab UI/kernel run by a teammate remains to verify; it is not claimed as already performed.
