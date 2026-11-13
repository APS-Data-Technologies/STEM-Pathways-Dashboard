# Yoshna Bandi

Role: Data Engineer

Stage: Validation and Handover. AI-assisted implementation prepared on the lead’s behalf; ownership is not a claim of individual authorship.

## Role and current position

Yoshna owns the source data, cleaning rules and reproducibility. The role is to make sure a reviewer can trace a displayed award count back to the public IPEDS files and rebuild the same output. The pipeline and its evidence are prepared for her technical review.

## What the implementation provides

The snapshot covers Illinois award years 2016–2023, three degree levels and six CIP families. Sixteen unchanged annual Completions and institution-directory ZIPs are recorded with source URLs, selected CSV members and SHA-256 checksums. The application exports contain 3,808 aggregate rows and 187,386 awards. Each of the six JSON or CSV files is below 2 MB.

City and institution control now come from the directory for the same award year as each completion record. This prevents a later ownership or location change from silently rewriting historical filter results. The institution picker and map use the latest directory record in the snapshot, which is explained to users.

## How the cleaning works

scripts/build_data.py joins the annual sources on UNITID and keeps Illinois institutions. It selects first majors, six-digit detail CIP codes and associate, bachelor’s and master’s awards. It uses CTOTALT once and excludes subtotal rows to prevent double counting. It preserves reported zero values and leaves absent records missing. The final aggregation is institution, award year, field family and degree level.

The official NCES 2010–2020 crosswalk has been checked against every observed code. The two selected-family moves are 15.0503 to 15.1701 and 15.0505 to 15.1703. Both remain within family 15, so the family totals do not need reassignment. New programs and institutional reporting changes can still affect trends.

## Evidence to discuss

scripts/verify_questions.py independently reads the raw CSVs using the Python standard library and reconciles every one of the 3,808 exported cells. The selected-college verifier provides 12 additional source checks. All seven notebook code cells ran in order and reproduced the six committed exports byte for byte. The crosswalk report, pipeline row counts and hashes are saved in docs/qa/.

## Review and next actions

Yoshna should run the shared Colab notebook herself and record the result. Lead and UX/UI should acknowledge schema version 2. APS still needs to accept Illinois, the six-family definition and the selected final-release window. The current 2024 archive has no revised member; that observation alone does not prove that the data are provisional. The release review records the uncertainty instead of silently expanding the dataset.

## Files to present

scripts/build_data.py; scripts/review_cip.py; scripts/verify_questions.py; notebooks/clean_ipeds.ipynb; data/source-manifest.json; data/reference/cip-crosswalk.csv; public/data/; docs/data-plan-and-contract.md.
