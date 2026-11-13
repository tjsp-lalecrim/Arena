"""Export the single generated title master, never regenerate or composite art."""
from pathlib import Path
from PIL import Image
import hashlib,json
R=Path(__file__).resolve().parents[1]
master=R/'art/masters/ref16-title-v01/title-v01.png'
im=Image.open(master);assert im.size==(1536,1024)
dest=R/'img/titles1/Arena_title_v01.png';dest.parent.mkdir(parents=True,exist_ok=True)
im.convert('RGB').resize((1440,960),Image.Resampling.LANCZOS).save(dest,optimize=True)
print(dest.relative_to(R),dest.stat().st_size,hashlib.sha256(dest.read_bytes()).hexdigest())
