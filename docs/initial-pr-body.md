## Purpose

Counselors and advisors need a clear way to explore public Illinois STEM degree awards. This change provides the cleaned IPEDS snapshot, responsive dashboard, shared filters, institution comparison, geographic view, filtered exports and handover materials.

## Validation

15 unit tests pass, including 1,008 core filter combinations. Every one of 3,808 exported source cells reconciles independently. Seven notebook cells reproduce all six exports. Twelve source-to-live numbers and 78 live core-view filter checks pass. The production Vercel release candidate is READY. See docs/qa/results.md for limits and evidence.

## Review and acceptance

The four named role owners are listed in README and docs/reports. This is AI-assisted implementation prepared on the lead's behalf. Another teammate must review and approve before merge. Sponsor scope acceptance, Git auto-deployment, branch protection, Colab review and APS ownership confirmation remain recorded acceptance actions. Tag v1.0 only on reviewed main after those gates pass.
