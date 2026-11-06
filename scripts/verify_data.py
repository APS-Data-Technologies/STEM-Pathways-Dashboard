"""Independent CSV/ZIP source checks; no pandas and no cleaning-function imports."""
import argparse, csv, hashlib, io, json, re, zipfile
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
def read(name): return json.loads((ROOT/name).read_text())
def verify(exports_only=False):
    rows=read('public/data/completions.json'); meta=read('public/data/metadata.json'); institutions=read('public/data/institutions.json')
    keys=set(); ids={i['unitid'] for i in institutions}
    for r in rows:
        k=tuple(r[c] for c in ['year','unitid','field_family','award_level'])
        assert k not in keys; keys.add(k)
        assert r['unitid'] in ids and r['year'] in meta['years']
        assert r['field_family'] in {f['code'] for f in meta['fields']}
        assert r['award_level'] in meta['award_levels']
        assert type(r['completions']) is int and r['completions']>=0
    with (ROOT/'public/data/completions.csv').open() as f:
        csvrows=list(csv.DictReader(f))
    assert len(csvrows)==len(rows)
    for a,b in zip(csvrows,rows):
        assert all(a[k]==str(v) for k,v in b.items())
    assert len(rows)==meta['rows']; assert len(institutions)==meta['institutions']
    assert all(p.stat().st_size<2_000_000 for p in (ROOT/'public/data').iterdir())
    if exports_only:
        print(f'PASS: {len(rows)} valid records; CSV matches JSON; all files <2 MB'); return []
    for s in read('data/source-manifest.json'):
        assert hashlib.sha256((ROOT/'data/raw'/s['filename']).read_bytes()).hexdigest()==s['sha256'], 'Source snapshot changed: '+s['filename']
    selected={i['unitid']:i['name'] for i in institutions if i['name'] in ['Judson University','Northwestern University','University of Chicago']}
    assert len(selected)==3
    checks=[]
    for year in [2016,2023]:
        with zipfile.ZipFile(ROOT/f'data/raw/C{year}_A.zip') as z:
            member=next(n for n in z.namelist() if '_rv.csv' in n.lower())
            payload=z.read(member)
        try: decoded=payload.decode('utf-8-sig')
        except UnicodeDecodeError: decoded=payload.decode('cp1252')
        totals={i:0 for i in selected}
        for raw in csv.DictReader(io.StringIO(decoded)):
            r={k.strip().upper():v.strip() for k,v in raw.items()}
            uid=int(r['UNITID'])
            if uid in totals and r['MAJORNUM']=='1' and re.fullmatch(r'\d{2}\.\d{4}',r['CIPCODE']) and r['CIPCODE'][:2] in {'11','14','15','26','27','40'} and int(r['AWLEVEL']) in {3,5,7}:
                totals[uid]+=int(r['CTOTALT'])
        for uid,name in selected.items():
            actual=sum(r['completions'] for r in rows if r['year']==year and r['unitid']==uid)
            assert totals[uid]==actual
            checks.append({'institution':name,'unitid':uid,'year':year,'field':'All six STEM families','award_level':'Associate + bachelor + master','expected_source_total':totals[uid],'export_total':actual,'status':'PASS','source':f'https://nces.ed.gov/ipeds/datacenter/data/C{year}_A.zip','member':member})
    (ROOT/'docs/qa/number-checks.json').write_text(json.dumps(checks,indent=2)+'\n')
    print(json.dumps(checks,indent=2)); return checks
if __name__=='__main__':
    p=argparse.ArgumentParser(); p.add_argument('--exports-only',action='store_true'); a=p.parse_args(); verify(a.exports_only)
