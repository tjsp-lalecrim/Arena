// Selection audit only: never automatically authorizes or adds a platform.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
function audit(){
 const l=read('doc/mapas/IMPERIAL_DUNGEONS_LAYOUT_M01.json'),d=read('data/ArenaDungeon.json'),c=read('data/ArenaRecovery.json'),m=read('data/Map008.json');
 const points=c.restPoints.filter(p=>p.mapId===8&&(p.dungeonPilot||p.dungeonRefuge)),seen=new Set(),groups=[];
 for(let y=0;y<l.rows.length;y++)for(let x=0;x<l.rows[y].length;x++)if(l.rows[y][x]==='^'&&!seen.has(x+','+y)){
  const queue=[[x,y]],cells=[];seen.add(x+','+y);while(queue.length){const [a,b]=queue.shift();cells.push([a,b]);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const key=[a+dx,b+dy].join();if(l.rows[b+dy]?.[a+dx]==='^'&&!seen.has(key)){seen.add(key);queue.push([a+dx,b+dy]);}}}
  const matched=points.filter(p=>cells.some(v=>v.join()===p.sourceCell.join())),excluded=(c.restExclusions||[]).filter(p=>cells.some(v=>v.join()===p.sourceCell.join()));
  for(const cell of cells)assert.equal(matched.filter(p=>p.sourceCell.join()===cell.join()).length+excluded.filter(p=>p.sourceCell.join()===cell.join()).length,1,'Each rendered platform needs a reviewed point or exclusion');
  let walls=0,dryEdges=0;for(const [a,b]of cells)for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){walls+=Number(l.rows[b+dy]?.[a+dx]==='#');dryEdges+=Number(l.rows[b+dy]?.[a+dx]==='.');}
  for(const p of matched){assert.ok(walls>=2&&dryEdges>=1,'Reviewed geometric context/dry approach required');assert.deepEqual([p.x,p.y],[p.sourceCell[0]*l.scale+l.margin+1,p.sourceCell[1]*l.scale+l.margin+1]);assert.notDeepEqual([p.x,p.y],d.key);assert.notDeepEqual([p.x,p.y],d.gateCenter);assert.ok(!d.integration.treasures.some(t=>Math.abs(t.position[0]-p.x)+Math.abs(t.position[1]-p.y)<=1));const e=m.events[p.eventId];assert.equal(e.note,'ArenaRecovery:'+p.id);assert.deepEqual([e.x,e.y],[p.x,p.y]);assert.equal(e.pages[0].priorityType,0);assert.equal(e.pages[0].through,true);assert.ok(e.pages[0].list[0].parameters[0].includes(p.id));}
  groups.push({cells,walls,dryEdges,points:matched,exclusions:excluded});
 }
 assert.equal(seen.size,41);assert.equal(groups.length,17);assert.equal(points.length,40);assert.equal(groups.reduce((s,g)=>s+g.exclusions.length,0),1);return{sourceCells:41,adjacentGroups:17,points:40,added:39,groups};
}
if(require.main===module)console.log(JSON.stringify(audit(),null,2));
module.exports=audit;
