# CIP reference

`cip-crosswalk.csv` is a parsed copy of the official NCES CIP 2010–2020 crosswalk, using All codes and Show Results at https://nces.ed.gov/ipeds/cipcode/crosswalk.aspx?y=56. It includes 2,180 six-digit detail rows and preserves the old/new code, title and action. Empty old codes identify new programs. It is a reference table, not an edited Completions source.

Run `python scripts/review_cip.py` to validate the observed code inventories against this reference. The audit stores its SHA-256. Two selected-family code moves remain within family 15, so aggregation at two digits is unaffected by those moves. New codes and changing institution reports remain interpretation limits.
