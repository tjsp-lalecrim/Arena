"""Export the two Hell Hound masters using the existing alpha cutout pipeline."""
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps
from battle_components import cutouts

ROOT = Path(__file__).resolve().parents[1]
MASTERS = ROOT / 'art/masters/fang-hell-hound-v01'
DOC = ROOT / 'doc/arte/hell-hound-v01'


def export(kind, columns, cell, ground, target_width, destination):
    image = Image.open(MASTERS / (kind + '-source.png')).convert('RGBA')
    # Keep the subjects and original alpha edges. Trim faint disconnected haze.
    image.putalpha(image.getchannel('A').point(lambda alpha: alpha if alpha > 32 else 0))
    poses = cutouts(image, columns * 4, columns)
    scale = target_width / poses[0][0].width if kind == 'battle' else target_width / max(
        pose.width for pose, _, _ in poses
    )
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
            # Keep the master’s centerline and horizontal bite extension.
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


battle = ROOT / 'img/enemies/Arena_Combat_hell_hound_v01.png'
walk = ROOT / 'img/characters/$Arena_hell_hound_walk_v01.png'
battle_cell = (192, 128)
battle_ground = 120
metadata = {
    'battle': export('battle', 4, battle_cell, battle_ground, 130, battle),
    'walk': export('walk', 3, (80, 80), 76, 66, walk),
}
profile = {
    'file': battle.stem, 'cell': battle_cell, 'ground': battle_ground,
    'version': 'fang-hell-hound-v01', 'actionMotion': 'strike', 'motions': {},
}
timing = {'idle': [28, 28, 28, 28], 'strike': [12, 9, 8, 12],
          'hurt': [6, 8, 8, 8], 'defeat': [12, 14, 13, 17]}
for row, (name, durations) in enumerate(timing.items()):
    profile['motions'][name] = {
        'frames': [{'rect': [col * 192, row * 128, 192, 128], 'duration': duration}
                   for col, duration in enumerate(durations)],
        'loop': name == 'idle', 'impact': 2 if name == 'strike' else None,
    }
for name, contents in [('profile.json', profile), ('exports.json', metadata)]:
    (DOC / name).write_text(json.dumps(contents, indent=2) + '\n', encoding='utf-8')
