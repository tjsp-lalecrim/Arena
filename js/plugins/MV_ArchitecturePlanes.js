/*:
 * @plugindesc v0.1.0 Geometria compartilhada de paredes e vãos ortogonais.
 * @help Antes de Arena_RihadDecor e Arena_ArchitectureLab. Sem estado/colisão.
 */
var MVArchitecturePlanes;
(function(){"use strict";
 function lerp(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
 function at(q,u,v){return lerp(lerp(q[0],q[1],u),lerp(q[3],q[2],u),v);}
 function sub(q,u0,u1,v0,v1){return[at(q,u0,v0),at(q,u1,v0),at(q,u1,v1),at(q,u0,v1)];}
 function face(r,s,out){var l=r[0]*48,t=r[1]*48,x=r[2]*48,y=r[3]*48,d=out?-96:96;
  if(s==='N')return[[l-d,t-d],[x+d,t-d],[x,t],[l,t]];
  if(s==='E')return[[x+d,t-d],[x+d,y+d],[x,y],[x,t]];
  if(s==='S')return[[x+d,y+d],[l-d,y+d],[l,y],[x,y]];
  return[[l-d,y+d],[l-d,t-d],[l,t],[l,y]];
 }
 function triangle(ctx,image,src,dst){var sx=src[1][0]-src[0][0],sy=src[1][1]-src[0][1],tx=src[2][0]-src[0][0],ty=src[2][1]-src[0][1],det=sx*ty-tx*sy;
  var px=dst[1][0]-dst[0][0],py=dst[1][1]-dst[0][1],qx=dst[2][0]-dst[0][0],qy=dst[2][1]-dst[0][1];
  var a=(px*ty-qx*sy)/det,b=(py*ty-qy*sy)/det,c=(qx*sx-px*tx)/det,d=(qy*sx-py*tx)/det;
  ctx.save();ctx.beginPath();ctx.moveTo(dst[0][0],dst[0][1]);ctx.lineTo(dst[1][0],dst[1][1]);ctx.lineTo(dst[2][0],dst[2][1]);ctx.closePath();ctx.clip();ctx.setTransform(a,b,c,d,dst[0][0]-a*src[0][0]-c*src[0][1],dst[0][1]-b*src[0][0]-d*src[0][1]);ctx.drawImage(image,0,0);ctx.restore();
 }
 function warp(ctx,b,q){var w=b.width,h=b.height;triangle(ctx,b._canvas,[[0,0],[w,0],[w,h]],[q[0],q[1],q[2]]);triangle(ctx,b._canvas,[[0,0],[w,h],[0,h]],[q[0],q[2],q[3]]);}
 // Wall faces retain their approved perspective. An aperture is a separate
 // local section: constant tangent width, never a slice of the flared wall UVs.
 function entryPlane(sf,seg,width){var s=seg.side,f=sf.faces[s],c=seg.center*48,h=width/2,axis=s==='N'||s==='S'?1:0,a=f[0][axis],b=f[3][axis];
  return s==='N'?[[c-h,a],[c+h,a],[c+h,b],[c-h,b]]:s==='S'?[[c+h,a],[c-h,a],[c-h,b],[c+h,b]]:s==='E'?[[a,c-h],[a,c+h],[b,c+h],[b,c-h]]:[[a,c+h],[a,c-h],[b,c-h],[b,c+h]];
 }
 MVArchitecturePlanes={lerp:lerp,at:at,sub:sub,face:face,triangle:triangle,warp:warp,entryPlane:entryPlane};
})();
