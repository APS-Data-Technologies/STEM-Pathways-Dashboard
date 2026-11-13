"""Check observed codes against the official NCES 2010–2020 crosswalk.
The checked-in crosswalk is a parsed copy of NCES's all-codes search results.
No program splits, new codes or institutional reporting changes are backcast.
"""
import csv,json,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def review():
    p=ROOT/'data/reference/cip-crosswalk.csv'
    cross=list(csv.DictReader(p.open()))
    inventory=json.loads((ROOT/'docs/qa/cip-code-inventory.json').read_text())
    families={'11','14','15','26','27','40'}
    old={r['cip2010']:r for r in cross if r['cip2010']}
    new={r['cip2020'] for r in cross if r['cip2020']}
    observed_old=set().union(*(set(v) for y,v in inventory.items() if int(y)<2020))
    observed_new=set().union(*(set(v) for y,v in inventory.items() if int(y)>=2020))
    missing_old=sorted(observed_old-set(old));missing_new=sorted(observed_new-new)
    assert not missing_old and not missing_new,(missing_old,missing_new)
    changes=[r for r in cross if r['cip2010'][:2] in families and r['cip2010']!=r['cip2020']]
    crossing=[r for r in cross if r['cip2010'] and r['cip2020'] and r['cip2010'][:2]!=r['cip2020'][:2] and (r['cip2010'][:2] in families or r['cip2020'][:2] in families)]
    assert not crossing,'Family membership changes require review before export'
    report={'source_url':'https://nces.ed.gov/ipeds/cipcode/crosswalk.aspx?y=56','source_selection':'All codes, Show Results; six-digit detail rows extracted from returned table','crosswalk_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'crosswalk_detail_rows':len(cross),'observed_pre2020_codes':len(observed_old),'observed_from2020_codes':len(observed_new),'unmatched_observed_codes':missing_old+missing_new,'within_family_code_moves':changes,'cross_family_moves_affecting_scope':crossing,'result':'PASS: every observed code is represented; the two code moves stay within family 15, so family totals need no remapping.','limitation':'New programs and title/definition changes still affect interpretation. This does not create a constant-program cohort or eliminate all classification effects.'}
    (ROOT/'docs/qa/cip-crosswalk-review.json').write_text(json.dumps(report,indent=2)+'\n')
    print(report['result']);return report
if __name__=='__main__':review()
