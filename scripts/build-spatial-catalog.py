"""Convert HYG v4.1 CSV to a local 3D catalogue. Usage: python3 script.py source.csv"""
import csv,json,sys
from pathlib import Path
rows=[]
for r in csv.DictReader(open(sys.argv[1],encoding='utf-8')):
    d=float(r['dist'])
    # Never turn HYG's 100000 pc unknown-distance sentinel into a real position.
    if not 0<d<10000: continue
    if float(r['mag'])>8.5 and d>30: continue
    rows.append([int(r['id']),int(r['hip'] or 0),r['proper'],*[float(r[k]) for k in ['x','y','z','vx','vy','vz','absmag']],float(r['ci'] or .65),d])
p=Path(__file__).resolve().parents[1]/'data/stars3d.js'
p.write_text('// HYG v4.1 subset; CC BY-SA 4.0. See HYG-LICENSE.md and THIRD_PARTY_NOTICES.md.\n// [id,hip,name,x,y,z(pc),vx,vy,vz(pc/year),absoluteMag,B-V,distancePc]\n(function(r){r.SPATIAL_STARS='+json.dumps(rows,separators=(',',':'))+';})(typeof module!=="undefined"?module.exports:globalThis);\n')
print(len(rows),'spatial stars')
