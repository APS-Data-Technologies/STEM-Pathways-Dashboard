# Data release review

The retained snapshot has eight award years, 2016–2023. All eight Completions archives contain revised `_rv.csv` members. The source manifest records their exact hashes. The current 2024 archive was checked again and contains `C2024_a.csv`, without a revised member. The 2025 archive request returned HTTP 404. These observations concern the downloadable files, not a definitive release-status classification.

NCES distinguishes provisional and final revised releases. Public release summaries may refer to collection years rather than the award year in this dashboard. We retained the internally consistent, already verified snapshot rather than silently adding a file whose release status was not established. APS should confirm that this window satisfies the scope's final-data requirement, or provide the approved final release window for a controlled refresh.

Sources: https://nces.ed.gov/ipeds/help/complete-data-files and https://nces.ed.gov/ipeds/survey-components/data-release-schedule. The archive checked is https://nces.ed.gov/ipeds/datacenter/data/C2024_A.zip.

A refresh requires unchanged raw downloads, a new manifest, full source reconciliation, notebook reproduction, UI regression and a reviewed PR. No automatic data refresh runs in production.
