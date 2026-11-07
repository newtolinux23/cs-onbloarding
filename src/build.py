import os
d=os.path.dirname(os.path.abspath(__file__)); root=os.path.dirname(d)
truck=open(f'{d}/truck.svg').read().strip()
fill=open(f'{d}/fill.js').read().replace('if (typeof module !== "undefined") module.exports = { fillPacket };','')
for src,out in [('index.src.html','index.html'),('hr.src.html','hr.html')]:
    s=open(f'{d}/{src}').read().replace('__TRUCK__',truck).replace('/*__FILL__*/',fill)
    assert '__TRUCK__' not in s and '__FILL__' not in s
    open(f'{root}/{out}','w').write(s)
print('built')
