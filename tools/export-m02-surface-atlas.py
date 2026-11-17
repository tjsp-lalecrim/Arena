"""Pack ImageGen material masters into an RPG Maker MV C sheet (8×16 cells)."""

import hashlib
import json
from pathlib import Path
import sys

from PIL import Image, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / 'doc/arte/m02-tilesets'
TILE = 48


def periodic(image, vertical):
    """Feather the opposed edges of a cropped source without repainting the interior."""
    for axis in range(2 if vertical else 1):
        if axis == 1:
            image = image.transpose(Image.Transpose.TRANSPOSE)
        for y in range(image.height):
            for d in range(6):
                far = image.width - 1 - d
                a, b = image.getpixel((d, y)), image.getpixel((far, y))
                weight = (6 - d) / 12
                image.putpixel((d, y), tuple(round(x * (1 - weight) + z * weight) for x, z in zip(a, b)))
                image.putpixel((far, y), tuple(round(z * (1 - weight) + x * weight) for x, z in zip(a, b)))
        if axis == 1:
            image = image.transpose(Image.Transpose.TRANSPOSE)
    return image


def export(environment):
    spec = json.loads((ART / (environment + '.json')).read_text(encoding='utf-8'))
    master = ROOT / spec['master']
    source = Image.open(master).convert('RGB')
    atlas = Image.new('RGBA', (8 * TILE, 16 * TILE))
    cells = []

    def material(index, size):
        col, row = index % 4, index // 4
        x, y = source.width / 4, source.height / 4
        # Keep only the interior between the original generated swatch boundaries.
        bounds = tuple(round(v) for v in ((col + .09) * x, (row + .09) * y,
                                          (col + .91) * x, (row + .91) * y))
        return source.crop(bounds).resize(size, Image.Resampling.LANCZOS)

    def put(texture, label):
        i = len(cells)
        assert i < 128
        atlas.paste(texture, (i % 8 * TILE, i // 8 * TILE))
        cells.append(label)

    for family, index in spec['floors'].items():
        sample = periodic(material(index, (96, 96)), vertical=True)
        for y in (0, 48):
            for x in (0, 48):
                put(sample.crop((x, y, x + TILE, y + TILE)), [family, x // 48, y // 48])

    cap_texture = periodic(material(spec['wallCap'], (48, 48)), vertical=True)
    trim = material(spec['trim'], (48, 96))
    for family, index in spec['walls'].items():
        sample = periodic(material(index, (48, 96)), vertical=False)
        if environment == 'rihad':
            cap = Image.blend(cap_texture, sample.crop((0, 0, 48, 48)), .3)
            if family in ('h', 'j'):
                cap = sample.crop((0, 0, 48, 48))
            gain = .68 if family in ('m', 'c', 'g') else .82
        else:
            cap = Image.blend(cap_texture, sample.crop((0, 0, 48, 48)), .26)
            gain = .52 if family == 'x' else .65
        cap = periodic(ImageEnhance.Brightness(cap).enhance(gain), vertical=True)
        faces = [cap, sample.crop((0, 0, 48, 48)), sample.crop((0, 48, 48, 96))]
        faces[2] = ImageEnhance.Brightness(faces[2]).enhance(.89)
        if environment == 'rihad' and family == 'l':
            # A low retaining course below the hedge, inside its solid plane.
            greenery = periodic(material(spec['walls']['h'], (48, 96)), vertical=False)
            curb = faces[2].crop((0, 29, 48, 48))
            faces[2] = greenery.crop((0, 48, 48, 96))
            faces[2].paste(curb, (0, 29))
        for height, tile in enumerate(faces):
            put(tile, [family, height, 'plain'])
            for edge in ('left', 'right'):
                end = tile.copy()
                width = 7 if environment == 'rihad' and family in ('j', 'g') else 4
                strip = trim.crop((14, 0 if height != 2 else 48, 14 + width, 48 if height != 2 else 96))
                if environment == 'fang' or family == 'h':
                    strip = ImageEnhance.Brightness(tile.crop((0, 0, width, 48))).enhance(.72)
                if height == 0:
                    strip = ImageEnhance.Brightness(strip).enhance(gain)
                if edge == 'right':
                    strip = ImageOps.mirror(strip)
                end.paste(strip, (0 if edge == 'left' else 48 - width, 0))
                put(end, [family, height, edge])
    if spec.get('closedDoors'):
        # Reuse the timbers and trim of the urban master on a transparent panel.
        panel = Image.new('RGBA', (48, 96))
        panel.paste(ImageEnhance.Brightness(trim).enhance(.63).resize((32, 76)), (8, 20))
        wood = ImageEnhance.Brightness(material(spec['walls']['a'], (22, 68))).enhance(.65)
        panel.paste(wood, (13, 28))
        for name, top in (('lintel', 0), ('leaf', 48)):
            put(panel.crop((0, top, 48, top + 48)), ['closedDoor', name])
        edge = Image.new('RGBA', (48, 48))
        edge.paste(trim.resize((8, 32)), (20, 8))
        put(edge, ['closedDoor', 'side'])
        put(edge.transpose(Image.Transpose.ROTATE_90), ['closedDoor', 'back'])
    output = ROOT / 'img/tilesets' / (spec['sheet'] + '.png')
    atlas.save(output)
    digest = lambda file: hashlib.sha256(file.read_bytes()).hexdigest()
    evidence = {'tool':'ImageGen integrado e exportação Pillow', 'masterSha256':digest(master),
                'output':output.relative_to(ROOT).as_posix(), 'sha256':digest(output),
                'size':atlas.size, 'tileSize':TILE, 'firstTile':256, 'cells':cells}
    (ART / ('exports-' + environment + '.json')).write_text(
        json.dumps(evidence, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
    )


if __name__ == '__main__':
    if len(sys.argv) != 2 or sys.argv[1] not in ('rihad', 'fang'):
        sys.exit('Uso: python tools/export-m02-surface-atlas.py rihad|fang')
    export(sys.argv[1])
