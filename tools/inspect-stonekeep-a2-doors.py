"""Bounded MIF consultation: three connected A2 doors, no original assets exported."""
from pathlib import Path
import hashlib, json, struct

R = Path(__file__).resolve().parents[1]
b = Path(r'D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena\ARENA\39699021.MIF').read_bytes()
sha = hashlib.sha256(b).hexdigest()
assert sha == '4eb604e21b1b73c3fa85c1a544588d6a847a9cff496c4efab9f1b313b8b7d45b'
ns = {}
exec((R/'tmp/original-review/decode-map.py').read_text().split("b=(root/'START.MIF')")[0], ns)
layers = {}
for tag in ['MAP1', 'FLOR']:
    off = b.index(tag.encode())
    size, length = struct.unpack_from('<HH', b, off+4)
    vals = struct.unpack('<8100H', ns['decode'](b[off+8:off+6+size], length))
    layers[tag] = [list(vals[y*90:y*90+90]) for y in range(90)]
M, F = layers['MAP1'], layers['FLOR']
def records(tag, stride):
    off = b.index(tag.encode())
    size = struct.unpack_from('<H', b, off+4)[0]
    assert size % stride == 0
    return [list(b[i:i+stride]) for i in range(off+6, off+6+size, stride)]
locks = {tuple(r[:2]): r[2] for r in records('LOCK', 3)}
triggers = records('TRIG', 4)
tex = json.loads((R/'tmp/stonekeep-review/texture-associations.json').read_text(encoding='utf8'))
assert tex['textures'][15]['file'].upper() == 'DCAS5.IMG'
doors = []
for index, (ox, y, axis) in enumerate([(42, 12, 'east-west'), (44, 14, 'north-south'), (47, 17, 'east-west')]):
    u = 89-ox
    assert M[y][ox] == 0xb010 and (ox, y) not in locks
    assert not any(r[:2] == [ox, y] for r in triggers)
    delta = [(0, -1), (0, 1)] if axis == 'east-west' else [(-1, 0), (1, 0)]
    # Source wall mass on the flanks; opening is perpendicular to the wall line.
    assert all((v := M[y+dy][89-(u+dx)]) >> 8 == (v & 255) for dx, dy in delta)
    doors.append(dict(
        id=f'stonekeep.a2central.door.{index+1:02}', sourceOriginal=[ox, y], view=[u, y],
        center=[3+3*u, 3+3*y], axis=axis, raw=0xb010, texture='DCAS5.IMG',
        lockValue=None, triggerAtDoor=None,
        access='west/east' if axis == 'east-west' else 'north/south',
        condition='No LOCK or TRIG at this coordinate; ordinary interaction, not a new key rule.',
        neighborhood=[dict(view=[u+dx, y+dy], mapRaw=M[y+dy][89-u-dx], floorRaw=F[y+dy][89-u-dx])
                      for dy in range(-1, 2) for dx in range(-1, 2)]))
config = dict(
    version=1, id='stonekeep.a2central.doors', sourceSha256=sha,
    coordinates='MIF zero-based -> view=(89-x,y) -> Map015=(3+3*viewX,3+3*y)',
    doors=doors,
    pendingLocked=[dict(sourceOriginal=[x, y], view=[89-x, y], center=[3+3*(89-x), 3+3*y],
                        lockValue=locks[(x, y)], dependency='Original iron-key mapping/lock interaction unresolved; no invented key or lock system.')
                   for x, y in [(51, 15), (51, 19), (54, 19)]],
    points=[dict(name='A2 centro · porta leste', position=[147, 39]),
            dict(name='A2 centro · porta intermediária', position=[138, 42]),
            dict(name='A2 centro · porta oeste', position=[132, 54])])
(R/'doc/mapas/STONEKEEP_A2_PORTAS_CENTRO_M02.json').write_text(
    json.dumps(config, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
print('3 A2 doors source-confirmed, no LOCK/TRIG at coordinates; 3 LOCK=1 dependencies recorded.')
