"""Source/approval evidence only. Does not implement a swimming cost."""
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parents[1];out=R/'doc/evidencias/m01-14/aprovacao-natacao';out.mkdir(parents=True,exist_ok=True)
install=Path('D:/SteamLibrary/steamapps/common/The Elder Scrolls Arena');sources=[]
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def record(p,pages=None):
 p=Path(p);d={'file':str(p),'bytes':p.stat().st_size,'sha256':h(p)}
 if pages:d['pdfPages']=pages
 return d
for pattern,pages in [('Arena_Combat*.pdf',[3,4]),('Arena_Races*.pdf',[2,3,6]),('Arena_Magical Effects*.pdf',[2,3,4,5]),('Arena_Unofficial FAQ*.pdf',[10]),('Arena_Fang Lair (quest)*.pdf',[2,5]),('Arena_Halls of Colossus*.pdf',[3,4])]:sources.append(record(next((R/'doc/wiki').glob(pattern)),pages))
sources.extend([record(install/'Docs/Manual.pdf',[5,6,7]),record(install/'Docs/Player Guide.pdf',[19,20,21,22,28,67,68]),record(install/'Docs/Arena Codex Scientia.pdf',[22])])
prints=list((R/'doc/prints').glob('m01-14-aprovacao-ressalvas-2026-10-27*'));assert len(prints)==1
files=list((install/'ARENA').glob('*'));files=[p for p in files if p.is_file()];copy=R/'tmp/swimming-review/arena-copy';different=[p.name for p in files if not (copy/p.name).exists() or h(p)!=h(copy/p.name)]
prior=json.loads((R/'doc/evidencias/m01-14/fontes-e-topologia.json').read_text())['sources'];assert all(any(r['sha256']==h(install/'ARENA'/name) for r in prior) for name in ['START.MIF','GLOBAL.BSA'])
report={'date':'2026-10-27','reviewedVersion':'b194b44','approval':{'source':record(prints[0]),'scope':'Structure/current visual approved; lateral door apparent thickness/contrast/legibility is accepted non-blocking future work','notEvidenceOf':['editor open/edit/save/reopen','physical Galaxy A56','original DOS swimming experiment']},'sources':sources,'originalPreservation':{'gameFilesComparedToIgnoredCopy':len(files),'differentGameFiles':different,'originalMifAndBsaMatchPriorRecordedHashes':True,'dosboxBinaryEqualsIgnoredCopy':h(install/'DOSBox-0.74/dosbox.exe')==h(R/'tmp/swimming-review/dosbox-copy/dosbox.exe'),'configurationEqualsIgnoredCopy':h(install/'DOSBox-0.74/arena.conf')==h(R/'tmp/swimming-review/dosbox-copy/arena.conf'),'incidentalLogs':[record(install/'DOSBox-0.74/stdout.txt'),record(install/'DOSBox-0.74/stderr.txt')],'logCaveat':'First direct emulator launch touched/recreated stdout/stderr. No prior backup; not deleted or restored speculatively. Subsequent emulator and game execution used ignored copies.'},'observation':{'controlledSwimmingExperimentPerformed':False,'reason':'DOSBox process started with local-copy mounts, but no observable targetable game window was available. No stationary/moving/zero-fatigue/HP measurement.'},'editorAttempt':{'launched':True,'screenshotError':'FrameArrived timed out: timed out waiting on channel','pluginControlError':'element is not available in cached app state for RPGMV.exe','mapOpenEditSaveReopenVerified':False,'noProjectFileWrites':True},'proposal':json.loads((R/'tmp/swimming-review/route-proposal.json').read_text()),'runtimeChange':'None: no cost, resource, race, map asset, quest completion or encounter code changed','m01_14':'Visual approved; editor authoring evidence remains pending','m01_15':'Not started: requested dependency condition has not yet been verified'}
manifest=json.loads((R/'doc/arte/DUNGEON_M01_14_R03_MANIFEST.json').read_text(encoding='utf8'))
report['approval']['runtimeFilesAtApprovedVersion']=[dict(v,file=v['file'].replace('\\','/')) for v in manifest['files'] if v['file'].replace('\\','/').startswith('img/')]
assert len(report['approval']['runtimeFilesAtApprovedVersion'])==5,'approval file trace must not be empty'
previous=out/'fontes-e-condicoes.json'
if previous.exists():
 manual=json.loads(previous.read_text(encoding='utf8')).get('approval',{}).get('editorManualReply')
 if manual:report['approval']['editorManualReply']=manual
(out/'fontes-e-condicoes.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print('Research audit written; controlled game/editor tests remain explicitly unverified; copy differences:',different)
