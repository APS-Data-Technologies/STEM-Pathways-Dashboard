# Validation results

Stage: Validation and Handover. Evidence applies to the release candidate deployed as `dpl_9VKsE1nDJDRU8VAGJrstHckoCKKQ`.

## Recorded checks

| Check | Result | Evidence |
|---|---|---|
| JavaScript unit tests | 15 passed | tests/data.test.js; tests/advising.test.js |
| Core field/degree/year combinations | 1,008 reconcile or show missing series | tests/data.test.js |
| City/control partitions | All eight annual totals reconcile | tests/advising.test.js |
| Full source reconciliation | All 3,808 exported cells match raw ZIP/CSV totals | full-source-check.json |
| Selected raw-source checks | 12 passed across three colleges and four award years | number-checks.json |
| Live number checks | All 12 displayed values match independent source totals | live-number-checks.json |
| Live core-view filters | 78 checks passed across Overview, Fields and Institutions | ui-filter-checks.json |
| Notebook | Seven cells execute in order and reproduce all six exports exactly | clean_ipeds.ipynb; reproducibility.json |
| CIP crosswalk | All observed codes match the appropriate version; two moves remain in family 15 | cip-crosswalk-review.json |
| Build and production | Build succeeds; deployment READY | deployment.md |
| Responsive layout | Desktop and 375-pixel iframe inspected; no horizontal main-content overflow in checked phone view | stem-overview.jpg; phone evidence |
| Comparison and export | Two Chicago public institutions show 9 and 454 awards; selected CSV totals 463 | Browser inspection and export reconciliation |
| Saved selection | View, filters and selected institutions survive reload | Browser reload and URL unit tests |

## Interpretation and limits

These checks are not a complete Cartesian browser test of every city, institution and filter combination. The automated helpers cover all 1,008 core region combinations; browser checks exercise every field, degree level and award year across the three core data views, plus representative cities and all institution controls. Comparison, map, About, guide and export receive scenario checks. The phone test uses an iframe viewport, not a physical phone or a full cross-browser certification.

Browser console messages from the browser extension were excluded from application findings. No application console error was observed in the checked flows. The build has a non-blocking bundle-size warning. Map points can overlap, and the list remains the reliable way to access every institution.

The source checker uses independent standard-library CSV aggregation rather than calling the cleaning functions. It checks counts, not the truth of every institution's original submission. NCES imputations and later revisions remain possible.

## Human acceptance still needed

A teammate should repeat the setup from README, run Colab, review chart readability and test a real counselor question. The lead signs off the screens and obtains sponsor scope decisions. The integration PR needs another teammate's approval. A real team rehearsal, demo, feedback and personal reflections are not completed by these automated checks.

Additional release checks: the actual downloaded comparison CSV contains exactly two records (Chicago State 9, UIC 454), totaling 463. See export-check.json. All six views have no horizontal overflow in the 375 px frame; see stem-narrow-checks.json. No production-origin console errors were observed in the captured browser log.
