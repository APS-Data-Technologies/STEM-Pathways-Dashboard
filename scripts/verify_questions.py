"""Reconcile every exported cell directly to raw NCES CSVs using the standard library."""
import csv,io,json,re,zipfile
from collections import defaultdict
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def source_rows(path,revised=False):
    with zipfile.ZipFile(path) as z:
        names=[n for n in z.namelist() if n.lower().endswith('.csv')]
        name=next(n for n in names if '_rv.' in n.lower()) if revised else names[0]
        b=z.read(name)
    try:t=b.decode('utf-8-sig')
    except UnicodeDecodeError:t=b.decode('cp1252')
    for raw in csv.DictReader(io.StringIO(t)):
        yield {k.strip().upper():v.strip() for k,v in raw.items()}
def verify():
    rows=json.loads((ROOT/'public/data/completions.json').read_text());metadata=json.loads((ROOT/'public/data/metadata.json').read_text())
    expected=defaultdict(int);names={};local=0;annual=defaultdict(int)
    for year in metadata['years']:
        hd={int(r['UNITID']):r for r in source_rows(ROOT/f'data/raw/HD{year}.zip') if r['STABBR']=='IL'}
        for r in source_rows(ROOT/f'data/raw/C{year}_A.zip',True):
            uid=int(r['UNITID']);cip=r['CIPCODE'];level=int(r['AWLEVEL'])
            if uid in hd and r['MAJORNUM']=='1' and re.fullmatch(r'\d{2}\.\d{4}',cip) and cip[:2] in {'11','14','15','26','27','40'} and level in {3,5,7}:
                value=int(r['CTOTALT']);expected[(year,uid,cip[:2],{3:'Associate',5:"Bachelor's",7:"Master's"}[level])]+=value;annual[year]+=value;names[uid]=hd[uid]['INSTNM']
                if year==2023 and cip[:2]=='11' and level==5 and hd[uid]['CITY']=='Chicago' and hd[uid]['CONTROL']=='1':local+=value
    actual={(r['year'],r['unitid'],r['field_family'],r['award_level']):r['completions'] for r in rows}
    assert dict(expected)==actual,'A source cell differs or is missing'
    families=defaultdict(lambda:defaultdict(int));levels=defaultdict(int);institutions=defaultdict(int)
    for (y,uid,f,l),v in expected.items():
        families[f][y]+=v;levels[l]+=v
        if y==2023 and f=='11' and l=="Bachelor's":institutions[uid]+=v
    first,last=metadata['years'][0],metadata['years'][-1]
    field_answer=[{'field_family':f,'start':a[first],'end':a[last],'change_percent':(a[last]/a[first]-1)*100} for f,a in families.items()]
    field_answer.sort(key=lambda x:-x['change_percent'])
    ranked=sorted(institutions.items(),key=lambda x:-x[1])[:8]
    result={'status':'PASS','method':'Independent standard-library raw ZIP/CSV aggregation. No pipeline functions or pandas imported. Every year/institution/field/degree cell reconciles exactly, including reported zero cells.','source_cells_checked':len(actual),'total_awards':sum(expected.values()),'annual_totals':dict(annual),'fields_by_endpoint_growth':field_answer,'degree_level_totals':dict(levels),'latest_computer_science_bachelors_top_institutions':[{'unitid':u,'institution':names[u],'awards':v} for u,v in ranked],'judson_total':sum(v for (y,u,f,l),v in expected.items() if u==146339),'judson_endpoints':{str(y):sum(v for (yy,u,f,l),v in expected.items() if yy==y and u==146339) for y in [first,last]},'chicago_public_computer_science_bachelors_2023':local}
    (ROOT/'docs/qa/full-source-check.json').write_text(json.dumps(result,indent=2)+'\n');print(f"PASS: {len(actual)} cells and {sum(expected.values()):,} awards reconcile exactly. Local advising selection: {local}.")
if __name__=='__main__':verify()
