"""Export the two Ghost masters using the existing alpha cutout pipeline."""
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps
from collections import deque
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
MASTERS = ROOT / 'art/masters/fang-ghost-v01'
DOC = ROOT / 'doc/arte/ghost-v01'


def export(kind, columns, cell, ground, target_width, destination):
    image = Image.open(MASTERS / (kind + '-source.png')).convert('RGBA')
    # Keep the subjects and original alpha edges. Trim faint disconnected haze.
    # The masters have a regular authored grid. Isolate each cell first so
    # detached spectral wisps never become assigned to a neighbouring pose.
    poses = []
    for row in range(4):
        for col in range(columns):
            rect = (round(col*image.width/columns), round(row*image.height/4),
                    round((col+1)*image.width/columns), round((row+1)*image.height/4))
            crop = image.crop(rect)
            alpha = np.array(crop.getchannel('A'))
            seen = np.zeros(alpha.shape, dtype=bool)
            groups = []
            for y, x in zip(*np.where(alpha > 32)):
                if seen[y,x]: continue
                todo=deque([(y,x)]);seen[y,x]=True;group=[]
                while todo:
                    yy,xx=todo.popleft();group.append((yy,xx))
                    for dy,dx in ((-1,0),(1,0),(0,-1),(0,1)):
                        ny,nx=yy+dy,xx+dx
                        if 0<=ny<alpha.shape[0] and 0<=nx<alpha.shape[1] and not seen[ny,nx] and alpha[ny,nx]>32:
                            seen[ny,nx]=True;todo.append((ny,nx))
                groups.append(group)
            groups.sort(key=len,reverse=True)
            kept = groups[:1] if row<3 or kind=='walk' else [g for g in groups if len(g)>80]
            mask=Image.new('L',crop.size)
            for group in kept:
                for y,x in group:mask.putpixel((int(x),int(y)),255)
            # Retain the generated alpha, including its soft two-pixel fringe.
            from PIL import ImageFilter, ImageChops
            mask=mask.filter(ImageFilter.MaxFilter(5))
            crop.putalpha(ImageChops.multiply(crop.getchannel('A'),mask))
            box=crop.getbbox();assert box
            pose=crop.crop(box)
            poses.append((pose,pose.getbbox(),[rect[0]+box[0],rect[1]+box[1],rect[0]+box[2],rect[1]+box[3]]))
    scale = target_width / poses[0][0].height
    atlas = Image.new('RGBA', (cell[0] * columns, cell[1] * 4))
    frames = []
    hashes = set()
    for i, (pose, _, source) in enumerate(poses):
        assert min(source[:2]) > 0 and source[2] < image.width and source[3] < image.height
        row, col = divmod(i, columns)
        if kind == 'battle':
            # The consumer mirrors enemy sprites once in battle.
            pose = ImageOps.mirror(pose)
        body = pose.convert('RGBa').resize(
            (round(pose.width * scale), round(pose.height * scale)), Image.Resampling.LANCZOS
        ).convert('RGBA')
        sprite = Image.new('RGBA', cell)
        x = (cell[0] - body.width) // 2
        if kind == 'battle':
            source_center = (col + 0.5) * image.width / columns
            # Keep the shared centerline and horizontal reaching-arm extension.
            x = round(cell[0] / 2 + (source_center - source[2]) * scale)
        sprite.alpha_composite(body, (x, ground - body.height))
        box = sprite.getbbox()
        assert box and min(box[:2]) > 0 and box[2] < cell[0] and box[3] < cell[1], (kind, i, box)
        frame_hash = hashlib.sha256(sprite.tobytes()).hexdigest()
        hashes.add(frame_hash)
        atlas.alpha_composite(sprite, (col * cell[0], row * cell[1]))
        frames.append({'source': source, 'visible': box, 'sha256': frame_hash})
    assert len(hashes) == columns * 4
    atlas.save(destination)
    return frames


battle = ROOT / 'img/enemies/Arena_Combat_ghost_v01.png'
walk = ROOT / 'img/characters/$Arena_ghost_float_v01.png'
battle_cell = (192, 160)
battle_ground = 150
metadata = {
    'battle': export('battle', 4, battle_cell, battle_ground, 104, battle),
    'walk': export('walk', 3, (96, 96), 90, 65, walk),
}
profile = {
    'file': battle.stem, 'cell': battle_cell, 'ground': battle_ground,
    'version': 'fang-ghost-v01', 'actionMotion': 'strike', 'motions': {},
}
timing = {'idle': [28, 28, 28, 28], 'strike': [12, 9, 8, 12],
          'hurt': [6, 8, 8, 8], 'defeat': [12, 14, 13, 17]}
for row, (name, durations) in enumerate(timing.items()):
    profile['motions'][name] = {
        'frames': [{'rect': [col * 192, row * 160, 192, 160], 'duration': duration}
                   for col, duration in enumerate(durations)],
        'loop': name == 'idle', 'impact': 2 if name == 'strike' else None,
    }
for name, contents in [('profile.json', profile), ('exports.json', metadata)]:
    (DOC / name).write_text(json.dumps(contents, indent=2) + '\n', encoding='utf-8')
