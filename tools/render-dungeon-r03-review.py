"""Review artifacts only; labels never enter runtime textures."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json
R=Path(__file__).resolve().parents[1];out=R/'doc/evidencias/m01-14/r03';font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',16)
board=Image.new('RGB',(816,1020),'#17191d');d=ImageDraw.Draw(board)
for n in range(5):
 x=(n%2)*408;y=(n//2)*340;im=Image.open(out/('comparavel-%02d.png'%(n+1))).resize((408,312),Image.Resampling.LANCZOS);board.paste(im,(x,y+24));d.text((x+6,y+3),'Área%02d — captura50%%; fonte816×624'%(n+1),font=font,fill='white')
im=Image.open(out/'descanso-isolado.png').resize((408,312),Image.Resampling.LANCZOS);board.paste(im,(408,704));d.text((414,683),'Laje isolada — cenário temporário restaurado',font=font,fill='white');board.save(out/'cinco-areas.png')
# Full native frame crops around the actual wall support; preserve1:1 scale.
c=json.loads((R/'data/ArenaDungeon.json').read_text());contact=Image.new('RGB',(816,928),'#17191d');d=ImageDraw.Draw(contact)
for i,a in enumerate(c['attachments']):
 im=Image.open(out/'objetos'/('%s.png'%a['eventId']));[wx,wy]=a['position'];cx=min(max(wx-8,0),156-17);cy=min(max(wy-6,0),156-13);sx=(wx-cx+.5)*48;sy=(wy-cy+1)*48
 # Camera center in engine uses(816/48-1)/2 and(624/48-1)/2; convert exact.
 cx=min(max(wx-8,0),139);cy=min(max(wy-6,0),143);sx=(wx-cx+.5)*48;sy=(wy-cy+1)*48
 tile=im.crop((round(sx-96),round(sy-120),round(sx+96),round(sy+72)));x=i%4*204;y=i//4*232;contact.paste(tile,(x,y+24));d.text((x+3,y+3),'Fonte%s → %s'%(a['sourceCell'],a['wallCell']),font=font,fill='white')
contact.save(out/'dezesseis-objetos.png')
print('Review boards: five comparable areas and16 actual object supports')
