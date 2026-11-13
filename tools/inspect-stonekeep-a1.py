"""Bounded source consultation for A1 west. No original assets enter the game.

Requires the previously downloaded decoder and cached layers in ignored tmp.
Only emits the authoring config, never modifies original or runtime maps.
"""
from pathlib import Path
import hashlib, json, struct

R = Path(__file__).resolve().parents[1]
read = lambda f: json.loads((R/f).read_text(encoding='utf8'))
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
    assert layers[tag] == read('tmp/stonekeep-review/39699021-layers.json')[tag]
M, F = layers['MAP1'], layers['FLOR']
assert read('tmp/stonekeep-review/texture-associations.json')['flats'][60].upper() == 'GHOUL.DFA'
prototype = read('data/ArenaGhoul.json')['encounter']
entries = []
for i, (x, y) in enumerate([(82, 2), (83, 3)]):
    assert M[y][x] == 0x803c and F[y][x] >> 8 == 6
    entries.append(dict(
        id=f'stonekeep.a1west.ghoul.{i+1:02}', eventId=70+i,
        enemyId=prototype['enemyId'], troopId=prototype['troopId'],
        sourceOriginal=[x, y], view=[89-x, y], origin=[3+3*(89-x), 3+3*y],
        sourceFlat='GHOUL.DFA', questSpecific=False,
        radius=2, interval=90, regions=[4], scale=1))
config = dict(
    version=1, id='stonekeep.a1-west', sourceSha256=sha,
    bounds=[0, 0, 7, 13],
    coordinates='MIF zero-based; view u=89-x; world=(3+3*u,3+3*y)',
    cells=[dict(view=[u, y], sourceOriginal=[89-u, y], mapRaw=M[y][89-u], floorRaw=F[y][89-u])
           for y in range(14) for u in range(8)],
    entries=entries,
    underStructureCandidates=[dict(
        view=[u, 8], sourceOriginal=[89-u, 8], mapRaw=M[8][89-u], floorRaw=F[8][89-u],
        status='Raised MAP1 over wet FLOR; swimming clearance unconfirmed. Existing collision unchanged, not a definitive closure.')
        for u in range(3, 7)],
    route=dict(
        fromPosition=[30, 9], via=[[27, 9], [24, 9], [21, 12]],
        returnWater=[[30, 12], [30, 15], [30, 18]],
        interpretation='Dry/wet connection through flats/empty MAP1; no raised crossing required.'),
    points=[dict(name='A1 oeste · chegada à margem', position=[30, 9]),
            dict(name='A1 oeste · ilha dos ghouls', position=[21, 15]),
            dict(name='A1 oeste · estrutura pendente', position=[18, 30])])
(R/'doc/mapas/STONEKEEP_A1_OESTE_M02.json').write_text(
    json.dumps(config, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
print('A1-west:112 source cells,2 ghouls,4 unresolved raised cells; source SHA', sha)
