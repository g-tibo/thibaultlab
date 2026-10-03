const $=s=>document.querySelector(s);
/* ---------- ER hero ---------- */
(()=>{
const cv=$("#er"),ctx=cv.getContext("2d");
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
let W=0,H=0,dpr=1,cx=0,cy=0,Rn=0,Rc=0,pts=[],fibers=[],hairs=[],t=0,run=false,mx=-9999,my=-9999;
const R=(a,b)=>a+Math.random()*(b-a),TAU=Math.PI*2,ERC="#62726E";

function build(){
  const wide=W>720;
  Rc=wide?Math.min(W*.42,H*.62):W*.42;
  cx=wide?W*.64:W*.5;cy=wide?H*.5:Rc+14;Rn=Rc*.4;
  const rin=Rn*.55,rout=Rc*.88,k=Math.max(Rc/380,.75),cap=wide?720:320;
  pts=[];
  for(let n=0;n<9000&&pts.length<cap;n++){
    const a=R(0,TAU),r=rin+(rout-rin)*Math.pow(Math.random(),.9),u=(r-rin)/(rout-rin),md=(11+22*u)*k,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;
    let ok=true;for(const p of pts){const dx=p.bx-x,dy=p.by-y;if(dx*dx+dy*dy<md*md){ok=false;break}}
    if(ok)pts.push({bx:x,by:y,md:md,amp:md*.32,s1:R(.25,.6),s2:R(.25,.6),p1:R(0,TAU),p2:R(0,TAU)});
  }
  const arcs=Array.from({length:wide?9:6},()=>({a:R(0,TAU),s:R(.45,1.3),r0:Rn*R(1.0,1.35),d:Rn*R(.3,.55)}));
  for(const p of pts){
    const dx=p.bx-cx,dy=p.by-cy,rr=Math.hypot(dx,dy),an=Math.atan2(dy,dx);
    p.sheet=false;p.rr=rr;p.con=rr>Rn*1.02&&rr-Rn*1.05<p.md*.75;
    if(rr<Rn*1.02)continue;
    for(const q of arcs){
      let da=Math.abs(an-q.a);da=Math.min(da,TAU-da);
      if(da<q.s/2&&rr>q.r0&&rr<q.r0+q.d&&Math.random()<.62){p.sheet=true;break}
    }
    if(!p.sheet&&rr<Rn*1.9&&Math.random()<.049)p.sheet=true;
  }
  /* 30% fewer filled cells in direct contact with the ring around the nucleus */
  {
    const touch=pts.filter(p=>p.sheet&&p.con);
    for(let i=touch.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[touch[i],touch[j]]=[touch[j],touch[i]]}
    touch.slice(0,Math.round(touch.length*.3)).forEach(p=>p.sheet=false);
  }
  fibers=Array.from({length:110},()=>({a0:R(0,TAU),span:R(.25,1.1),f:R(.05,.95),lw:R(.8,2.2),light:Math.random()<.55}));
  hairs=Array.from({length:180},()=>({a:R(0,TAU),len:R(6,24),curl:R(-.8,.8),ph:R(0,TAU)}));
}
function size(){
  const r=cv.getBoundingClientRect();if(!r.width||!r.height)return;
  dpr=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;
  cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  build();draw();
}
/* wobbling membrane. k=0 outer edge, k=1 inner edge */
function rad(a,k){
  const w=Math.sin(3*a+t*.5+k*1.3)*.032+Math.sin(5*a-t*.4+k*2.1)*.022+Math.sin(8*a+t*.55+k)*.012;
  return Rc*(k?.87+w*1.2+Math.sin(2*a+1+t*.3)*.024:1+w);
}
function trace(k){
  for(let i=0;i<=180;i++){const a=i/180*TAU,r=rad(a,k),x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}
  ctx.closePath();
}
function draw(){
  ctx.clearRect(0,0,W,H);

  /* ER lattice between nucleus and membrane */
  ctx.save();
  ctx.beginPath();trace(1);ctx.clip();
  ctx.fillStyle="#D9DFD8";ctx.fillRect(0,0,W,H);
  if(window.d3&&d3.Delaunay&&pts.length>3){
    const flat=new Float64Array(pts.length*2);
    pts.forEach((p,i)=>{
      let x=p.bx+Math.cos(t*p.s1+p.p1)*p.amp,y=p.by+Math.sin(t*p.s2+p.p2)*p.amp;
      {const ox=x-cx,oy=y-cy,ca=Math.cos(t*.03),sa=Math.sin(t*.03);x=cx+ox*ca-oy*sa;y=cy+ox*sa+oy*ca}
      const dx=x-mx,dy=y-my,d2=dx*dx+dy*dy;
      if(d2<8100){const d=Math.sqrt(d2)||1,f=(90-d)/90*9;x+=dx/d*f;y+=dy/d*f}
      flat[2*i]=x;flat[2*i+1]=y;
    });
    const vor=new d3.Delaunay(flat).voronoi([0,0,W,H]);
    ctx.fillStyle=ERC;ctx.beginPath();
    for(let i=0;i<pts.length;i++){
      if(!pts[i].sheet)continue;
      const poly=vor.cellPolygon(i);if(!poly)continue;
      ctx.moveTo(poly[0][0],poly[0][1]);for(let k=1;k<poly.length;k++)ctx.lineTo(poly[k][0],poly[k][1]);ctx.closePath();
    }
    ctx.fill();
    ctx.lineJoin="round";ctx.lineCap="round";
    ctx.beginPath();vor.render(ctx);ctx.lineWidth=3.2;ctx.strokeStyle="rgba(60,80,78,.10)";ctx.stroke();
    ctx.beginPath();vor.render(ctx);ctx.lineWidth=1.1;ctx.strokeStyle=ERC;ctx.stroke();
  }
  ctx.restore();

  /* woolly membrane ring */
  ctx.save();
  const mg=ctx.createLinearGradient(cx-Rc,cy-Rc,cx+Rc,cy+Rc);mg.addColorStop(0,"#F6F8F5");mg.addColorStop(1,"#D7DED8");
  ctx.shadowColor="rgba(50,66,62,.28)";ctx.shadowBlur=16;ctx.shadowOffsetY=5;
  ctx.fillStyle=mg;ctx.beginPath();trace(0);trace(1);ctx.fill("evenodd");
  ctx.restore();
  ctx.lineCap="round";
  for(const f of fibers){
    ctx.beginPath();
    for(let s=0;s<=12;s++){
      const a=f.a0+f.span*s/12,r0=rad(a,1),r1=rad(a,0),r=r0+(r1-r0)*f.f+Math.sin(a*7+t*.8+f.f*9)*1.6;
      const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;s?ctx.lineTo(x,y):ctx.moveTo(x,y);
    }
    ctx.lineWidth=f.lw;ctx.strokeStyle=f.light?"rgba(255,255,255,.6)":"rgba(105,122,117,.24)";ctx.stroke();
  }
  ctx.lineWidth=.8;ctx.strokeStyle="rgba(255,255,255,.75)";ctx.beginPath();
  for(const h of hairs){
    const r=rad(h.a,0),x=cx+Math.cos(h.a)*r,y=cy+Math.sin(h.a)*r,sw=Math.sin(t*1+h.ph)*6,ang=h.a+h.curl*.3;
    const ex=x+Math.cos(ang)*h.len+sw,ey=y+Math.sin(ang)*h.len+sw;
    ctx.moveTo(x,y);ctx.quadraticCurveTo(x+Math.cos(h.a+h.curl)*h.len*.6+sw,y+Math.sin(h.a+h.curl)*h.len*.6,ex,ey);
  }
  ctx.stroke();

  /* flat nucleus in the page colour, ringed by a thick uneven line */
  const r=Rn*(1+.008*Math.sin(t*.7));
  ctx.fillStyle="#CFD6CD";ctx.beginPath();ctx.arc(cx,cy,r*.99,0,TAU);ctx.fill();
  const env=(a,o)=>r*(o?1.07+.022*Math.sin(3*a+t*.45)+.013*Math.sin(9*a-t*.6+1)+.006*Math.sin(17*a+t*.9):.955+.016*Math.sin(4*a-t*.35+2)+.009*Math.sin(11*a+t*.7));
  ctx.fillStyle=ERC;ctx.beginPath();
  for(const o of [1,0]){
    for(let i=0;i<=240;i++){const a=i/240*TAU,q=env(a,o),x=cx+Math.cos(a)*q,y=cy+Math.sin(a)*q;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}
    ctx.closePath();
  }
  ctx.fill("evenodd");
  /* soft veil behind the text */
  if(W>720){const v=ctx.createLinearGradient(0,0,W*.6,0);
  v.addColorStop(0,"rgba(196,204,196,.86)");v.addColorStop(.55,"rgba(196,204,196,.55)");v.addColorStop(1,"rgba(196,204,196,0)");
  ctx.fillStyle=v;ctx.fillRect(0,0,W,H)}
}
function loop(){if(!run)return;t+=.016;draw();requestAnimationFrame(loop)}
function setRun(v){if(reduce)return;if(v&&!run){run=true;requestAnimationFrame(loop)}else if(!v)run=false}
new ResizeObserver(size).observe(cv);
new IntersectionObserver(es=>setRun(es[0].isIntersecting),{threshold:0}).observe(cv);
$("#hero").addEventListener("pointermove",e=>{const b=cv.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top});
$("#hero").addEventListener("pointerleave",()=>{mx=my=-9999});
})();
