"""Build a reproducible Illinois STEM snapshot from unmodified official IPEDS ZIPs.

Run from the repository root: python scripts/build_data.py
The same functions are called by notebooks/clean_ipeds.ipynb.
"""
from __future__ import annotations
import argparse
import hashlib
import io
import json
import time
import urllib.request
import zipfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://nces.ed.gov/ipeds/datacenter/data/"
YEARS = list(range(2016, 2024))
FIELDS = {"11": "Computer & information sciences", "14": "Engineering", "15": "Engineering technologies", "26": "Biological & biomedical sciences", "27": "Mathematics & statistics", "40": "Physical sciences"}
AWARDS = {3: "Associate", 5: "Bachelor's", 7: "Master's"}

def save_json(path, value):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    Path(path).write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":"), allow_nan=False) + "\n", encoding="utf-8")

def download(name):
    path = ROOT / "data/raw" / name
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        for attempt in range(3):
            try:
                with urllib.request.urlopen(BASE + name, timeout=60) as response:
                    payload = response.read()
                with zipfile.ZipFile(io.BytesIO(payload)) as archive:
                    assert any(n.lower().endswith('.csv') for n in archive.namelist())
                path.write_bytes(payload)
                break
            except Exception:
                if attempt == 2:
                    raise
                time.sleep(1)
    with zipfile.ZipFile(path) as z:
        assert z.testzip() is None, f"Corrupt ZIP: {name}"
    print(f"Source ready: {name}", flush=True)
    return path

def read_zip(path, columns):
    with zipfile.ZipFile(path) as z:
        csvs = [n for n in z.namelist() if n.lower().endswith('.csv')]
        revised = [n for n in csvs if '_rv.' in n.lower()]
        if path.name.upper().startswith('C') and not revised:
            raise ValueError(f"Revised Completions member required: {path.name}")
        name = (revised or csvs)[0]
        # Older IPEDS files use Windows-1252; newer files may be UTF-8.
        payload = z.read(name)
        try:
            text = payload.decode('utf-8-sig')
        except UnicodeDecodeError:
            text = payload.decode('cp1252')
        frame = pd.read_csv(io.StringIO(text), dtype=str, usecols=lambda c: c.strip().upper() in columns, keep_default_na=False)
    frame.columns = frame.columns.str.strip().str.upper()
    missing = set(columns) - set(frame.columns)
    if missing:
        raise ValueError(f"{path.name}: missing {missing}")
    for c in frame:
        frame[c] = frame[c].str.strip()
    return frame

def clean_year(year):
    hd = read_zip(ROOT / f'data/raw/HD{year}.zip', ['UNITID','INSTNM','STABBR','CITY','LATITUDE','LONGITUD'])
    raw = read_zip(ROOT / f'data/raw/C{year}_A.zip', ['UNITID','CIPCODE','AWLEVEL','MAJORNUM','CTOTALT'])
    assert not hd.UNITID.duplicated().any(), f"Duplicate directory UNITID in {year}"
    directory = hd.loc[hd.STABBR.eq('IL')].copy()
    joined = raw.merge(directory, on='UNITID', how='inner', validate='many_to_one')
    first = joined.loc[joined.MAJORNUM.eq('1')].copy()
    # Keep detail codes only. Never sum CIP family (xx) or all-program (99) totals
    # together with the six-digit detail rows, which would double count awards.
    detail = first.loc[first.CIPCODE.str.fullmatch(r'\d{2}\.\d{4}')].copy()
    detail['field_family'] = detail.CIPCODE.str[:2]
    stem = detail.loc[detail.field_family.isin(FIELDS)].copy()
    stem['AWLEVEL'] = pd.to_numeric(stem.AWLEVEL, errors='raise').astype(int)
    selected = stem.loc[stem.AWLEVEL.isin(AWARDS)].copy()
    selected['completions'] = pd.to_numeric(selected.CTOTALT, errors='raise')
    assert selected.completions.notna().all(), f"Missing totals in {year}"
    assert selected.completions.ge(0).all(), f"Negative totals in {year}"
    assert selected.completions.mod(1).eq(0).all()
    assert not selected.duplicated(['UNITID','CIPCODE','AWLEVEL','MAJORNUM']).any()
    selected['completions'] = selected.completions.astype(int)
    selected['year'] = year
    selected['unitid'] = selected.UNITID.astype(int)
    selected['award_level'] = selected.AWLEVEL.astype(int).map(AWARDS)
    selected['field_name'] = selected.field_family.map(FIELDS)
    selected['institution'] = selected.INSTNM
    # Family-level export is deliberately compact; CIP detail remains in source files.
    keys = ['year','unitid','institution','field_family','field_name','award_level']
    output = selected.groupby(keys, as_index=False, sort=True).completions.sum()
    # Zero rows are retained when the institution reported a zero. Missing rows remain missing.
    assert len(output) > 0, f"No output for {year}; check column coding"
    assert int(output.completions.sum()) == int(selected.completions.sum())
    audit = {'year':year,'raw_completions_rows':len(raw),'directory_rows':len(hd),'illinois_institutions':len(directory),'illinois_rows':len(joined),'first_major_rows':len(first),'six_digit_rows':len(detail),'stem_rows':len(stem),'selected_award_rows':len(selected),'export_rows':len(output),'total_completions':int(output.completions.sum()),'cip_version':'CIP 2010' if year < 2020 else 'CIP 2020'}
    directory['year'] = year
    codes = sorted(selected.CIPCODE.unique().tolist())
    print(f"{year}: {len(raw):,} raw rows -> {len(output):,} export rows; {audit['total_completions']:,} awards", flush=True)
    return output, directory, audit, codes

def build(download_sources=True):
    names = [n for y in YEARS for n in [f'C{y}_A.zip', f'HD{y}.zip']]
    if download_sources:
        with ThreadPoolExecutor(max_workers=4) as pool:
            list(pool.map(download, names))
    frames, directories, audits, codes = [], [], [], {}
    for y in YEARS:
        frame, directory, audit, year_codes = clean_year(y)
        frames.append(frame); directories.append(directory); audits.append(audit); codes[str(y)] = year_codes
    records = pd.concat(frames, ignore_index=True).sort_values(['year','unitid','field_family','award_level'])
    history = pd.concat(directories, ignore_index=True).sort_values(['UNITID','year'])
    latest = history.drop_duplicates('UNITID', keep='last')
    institutions = []
    for _, r in latest.sort_values('INSTNM').iterrows():
        def coordinate(v):
            try: return float(v) if v and float(v) != -999 else None
            except ValueError: return None
        institutions.append({'unitid':int(r.UNITID),'name':r.INSTNM,'city':r.CITY,'latitude':coordinate(r.LATITUDE),'longitude':coordinate(r.LONGITUD),'directory_year':int(r.year),'years_present':history.loc[history.UNITID.eq(r.UNITID),'year'].astype(int).tolist()})
    dest = ROOT / 'public/data'
    dest.mkdir(parents=True, exist_ok=True)
    save_json(dest / 'completions.json', records.to_dict('records'))
    records.to_csv(dest / 'completions.csv', index=False, lineterminator='\n')
    save_json(dest / 'institutions.json', institutions)
    pd.DataFrame(institutions).to_csv(dest / 'institutions.csv', index=False, lineterminator='\n')
    sources = [{'filename':n,'url':BASE+n,'sha256':hashlib.sha256((ROOT/'data/raw'/n).read_bytes()).hexdigest(),'bytes':(ROOT/'data/raw'/n).stat().st_size} for n in names]
    for source in sources:
        with zipfile.ZipFile(ROOT/'data/raw'/source['filename']) as archive:
            members = [n for n in archive.namelist() if n.lower().endswith('.csv')]
            source['csv_member'] = next((n for n in members if '_rv.' in n.lower()), members[0])
    metadata = {'schema_version':1,'region':'Illinois','state':'IL','years':YEARS,'award_levels':list(AWARDS.values()),'fields':[{'code':k,'name':v} for k,v in FIELDS.items()],'source_name':'NCES IPEDS Completions and Institutional Characteristics','source_url':'https://nces.ed.gov/ipeds/use-the-data/download-access-database','download_date':'2026-11-06','scope_status':'Working assumptions; sponsor approval pending','release_status':'Revised Completions CSV members verified for 2016–2023. Downloaded 2024 archive had no revised member, so it is excluded pending release review.','counting_rule':'First majors only (MAJORNUM=1); six-digit CIP detail; AWLEVEL 3, 5, 7; CTOTALT only','cip_handling':'Aggregate each year under its reported two-digit CIP family. CIP 2010 is used before 2020; CIP 2020 thereafter. No unsupported longitudinal code remapping. The 2020 classification break can affect trends.','missing_data_rule':'Reported zero values are retained. No matching records are shown as no data, never imputed to zero.','unit':'Degrees awarded, not unique people or enrollments','rows':len(records),'institutions':len(institutions),'sources':sources}
    save_json(dest / 'metadata.json', metadata)
    pd.DataFrame([{'key':k,'value':json.dumps(v,ensure_ascii=False) if isinstance(v,(list,dict)) else v} for k,v in metadata.items()]).to_csv(dest/'metadata.csv',index=False,lineterminator='\n')
    save_json(ROOT/'docs/qa/pipeline-audit.json',audits)
    save_json(ROOT/'docs/qa/cip-code-inventory.json',codes)
    save_json(ROOT/'docs/qa/cip-transition.json',{'note':'Observed additions/removals are not asserted to be one-to-one mappings. A sponsor-approved harmonized crosswalk is a remaining methodology review.','added_2020':sorted(set(codes['2020'])-set(codes['2019'])),'absent_2020':sorted(set(codes['2019'])-set(codes['2020']))})
    save_json(ROOT/'data/source-manifest.json',sources)
    for path in dest.iterdir():
        assert path.stat().st_size < 2_000_000, f"File exceeds 2 MB budget: {path}"
    print(json.dumps({'rows':len(records),'institutions':len(institutions),'total':int(records.completions.sum())}), flush=True)
    return records, metadata, audits

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--offline', action='store_true')
    args = parser.parse_args()
    build(download_sources=not args.offline)
