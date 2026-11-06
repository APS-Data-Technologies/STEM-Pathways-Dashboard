# QA evidence — Implementation implementation

Operator: AI-assisted execution on the project lead's behalf. Independent teammate review remains pending. This is a scoped implementation check, not the full Validation device/accessibility acceptance suite.

## Executed checks
| Check | Result | Evidence / limits |
|---|---|---|
| Production compilation | PASS | `npm run build`; React/Vite production output generated. One non-blocking bundle-size warning (~629 KB JS, ~185 KB gzip). |
| Calculation and data-contract tests | PASS | `npm test`: 9 tests, 0 failures. Includes missing vs zero, invalid records, zero baseline, CAGR hand calculation and institution filtering. |
| Regional filter consistency | PASS | 1,008 combinations (7 field choices × 4 award choices × 36 year ranges) preserve totals / explicit missing series. Algorithmic test, not 1,008 manual browser interactions. |
| Independent raw-source checks | PASS | `python scripts/verify_data.py`: 3 colleges × 2 years, direct CSV/ZIP sums without pandas/build functions. See number-checks.json. |
| Export schema/size/parity | PASS | 3,808 valid aggregate rows; all six files below 2 MB; completions CSV matches JSON. |
| Source identity | PASS | All 16 source archive SHA-256 hashes match manifest. |
| Notebook code execution | PASS, scoped | All 6 code cells run top-to-bottom with real outputs via in-process IPython runner; TCP and IPC Jupyter kernel sockets unavailable on this host. Colab UI execution not yet verified. |
| Exact reproducibility | PASS | Rebuilding all six exports preserves every byte/hash; reproducibility.json. |
| Default overview in browser | PASS | 187,386 total; +11.0% endpoint change; +1.5% CAGR; 3,808 rows; 123 institutions with positive awards. |
| Filter persistence | PASS | Computer science + bachelor's + 2023 produced 3,617; navigating to Fields retained selection and value. |
| Institution search/selection | PASS | 2023 all-fields/levels: Judson 6, Northwestern 1,846, University of Chicago 1,480, matching raw-source checks. |
| Empty result | PASS | Adler University, 2023 selection showed explicit no-records message, not zero awards. |
| Accessible exact table | PASS | Expanded annual table showed all eight source-checked annual totals. Table works independently of color. |
| Error and retry | PASS | Temporarily removed metadata JSON, reloaded: clear data-read error + Try again. Restored original file, clicked retry: 187,386 restored without page reload. Test file restored before build/commit. |
| Navigation / About | PASS | Four views opened; About includes sources, award-year definition, scope and CIP caveat. |
| 375 px layout | PASS, emulated | Fixed-width iframe harness; usable width 360 with desktop scrollbar. All four views had scrollWidth equal to clientWidth; screenshot attached. Not physical-phone testing. |
| 1280 px layout | PASS, emulated | Fixed-width iframe harness; usable width 1265 with scrollbar. Overview has no horizontal overflow; charts rendered. |

## Source check table
| Institution | 2016 raw = export | 2023 raw = export |
|---|---:|---:|
| Judson University | 6 | 6 |
| Northwestern University | 1,276 | 1,846 |
| University of Chicago | 853 | 1,480 |

## Visual evidence
[Desktop, 1280 px frame](desktop-1280.png) · [Mobile, 375 px frame](mobile-375.png) · [Editable Figma](https://www.figma.com/design/Rxr9Zc3exDhzLhv19xAPYd) · [Figma mobile export](figma-mobile.png).

To repeat responsive checks, run Vite and visit `/docs/qa/layout-harness.html?width=375` or `?width=1280`. This developer harness is not part of the production app build.

## Unresolved items, with owners
| Priority / task | Owner | Remaining action |
|---|---|---|
| P1 acceptance — B-15 | QA + project owner | Public deployment now passes; GitHub connection and auto-deploy verification remain |
| P1 publishing | Lead + APS admin | Correct GitHub app repository write access or publish the ZIP with your own GitHub Desktop account; browser publication is in progress; teammate review and merge remain pending |
| P1 workflow — B-11 | APS repository administrator | Protect main; required review/checks; current account lacks admin |
| P2 methodology — B-18 | Data + APS | Validate CIP crosswalk and accept as-reported method or implement approved harmonization |
| Scope/contract — B-04/B-14/B-17/B-31 | Lead, UX/Viz, QA, APS | Actual approvals, including latest eligible final-year selection |
| P3 performance | Frontend | Assess bundle splitting / mobile performance in Validation; build warning is recorded, not hidden |

Not yet verified: real physical phone browsers, full keyboard/screen-reader audit, slow-network loading-state timing, all institution filter combinations in-browser, Colab UI run, external sponsor approvals, protected-main enforcement or deployment triggers. Browser extension metadata errors were observed; they are separate from application defects. Do not claim zero browser-console errors universally.

## Live deployment verification
Production URL: https://stem-pathways-dashboard.vercel.app/
Public HTML and metadata JSON return HTTP 200. In-browser totals verified: default 187,386; computer science / bachelor / 2023 = 3,617; reset restores 187,386. Deployment READY. Git-triggered deployment remains unverified.
