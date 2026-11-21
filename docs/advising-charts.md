# Version 2 · Charts for advising conversations

The most recent five complete award years open by default (2021–2025). Show full history extends the selection to 2016–2025 and keeps the other filters. Existing shared links with explicit years still open their original selection.

## What changed after the demo

- The annual trend fits its vertical scale to the displayed counts. The axis uses whole awards and prints its bounds. Choose **Start at zero** for context. A caption shows the first and last reported counts, years, and net change. Missing years leave gaps. A single observation has its own explanation.
- The Overview institution ranking now shows a doughnut chart. The center gives the total for the active selection. The legend lists counts and percentages, and a college name opens its detail page. Four leading institutions are named when the rest are grouped. If only five qualify, all five are named. Every positive award contributes to the denominator.
- Institution field comparisons retain horizontal bars. Exact tables, filters, exports and saved links remain available. Compare shows degree awards for up to three colleges. The data contract covers degree awards only.
- STEM field, degree level, city and institution control now accept multiple choices. The Institutions page shows a table of awards by field and degree level for one college. Shared links, CSV exports and printed briefs follow these selections.

## Source and verification

The NCES July 28, 2026 release covers completions through June 30, 2025. The 2025 totals are provisional. For 2024 the November snapshot uses the revised member of C2024_A.zip. Each annual directory joins to the corresponding awards file. The source manifest lists all 20 archive URLs, hashes and CSV members.

| Award year | Aggregate records | Illinois degrees in scope |
|---|---:|---:|
| 2024 | 471 | 26,598 |
| 2025 (provisional) | 467 | 29,018 |

Across all ten years there are 4,746 aggregate records and 243,002 degrees. Run the independent reconciliation with `python scripts/verify_questions.py`. The node tests cover the 224–233 example, reported zeros, missing years, constant series, share totals, saved selections and all 1,540 core filter combinations. For comparison at a meeting, switch between the fitted and zero-based axes and read the two endpoint counts aloud.

[NCES release schedule](https://nces.ed.gov/ipeds/survey-components/data-release-schedule) · [Source manifest](../data/source-manifest.json) · [Reconciliation](qa/full-source-check.json)
