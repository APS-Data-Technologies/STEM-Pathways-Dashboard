# Official source cache

Run `python scripts/build_data.py` to download the unmodified IPEDS ZIP files here.
Large raw national files are deliberately excluded from Git. Their official URLs,
byte counts, and SHA-256 checksums are recorded in `data/source-manifest.json`.
Keep a copy of these exact ZIPs for archival reproducibility: upstream releases may change.
