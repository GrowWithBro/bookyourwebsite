
// ---- Data & Store (USD) ----
const Store={key:'byw-cart-v2',get(){try{return JSON.parse(localStorage.getItem(this.key)||'{}')}catch{return{}}},set(v){localStorage.setItem(this.key,JSON.stringify(v))},clear(){localStorage.removeItem(this.key)}};
const templates=[
 {slug:'startup',name:'LaunchPad Startup',category:'SaaS/Startup',base:799,thumb:'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop',demo:'demos/startup.html',features:['Hero + value props','Pricing tables','Blog/Changelog','Contact + CTA','Integrations grid']},
 {slug:'restaurant',name:'Gourmet Dine',category:'Restaurant',base:599,thumb:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop',demo:'demos/restaurant.html',features:['Menu & gallery','Reservations','Map & timings','Chef story','Reviews']},
 {slug:'fitness',name:'FitForge',category:'Fitness/Gym',base:549,thumb:'https://images.unsplash.com/photo-1517838224956-91f81b835e1a?w=1200&auto=format&fit=crop',demo:'demos/fitness.html',features:['Programs','Trainer bios','Schedule','Membership plans','Testimonials']},
 {slug:'education',name:'EduSpark',category:'Education',base:699,thumb:'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1200&auto=format&fit=crop',demo:'demos/education.html',features:['Courses grid','Admissions CTA','Placement stats','FAQ accordion','Contact']},
 {slug:'portfolio',name:'FolioPro',category:'Portfolio',base:399,thumb:'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop',demo:'demos/portfolio.html',features:['Case studies','Services','Process','Contact form','Blog']},
 {slug:'realestate',name:'EstateEdge',category:'Real Estate',base:999,thumb:'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&auto=format&fit=crop',demo:'demos/realestate.html',features:['Property listings','Filters & map','Agent profiles','Lead capture','Mortgage calc*']},
 {slug:'ecommerce',name:'ShopSwift',category:'E‑commerce',base:1099,thumb:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop',demo:'demos/ecommerce.html',features:['Featured products','Collections','Cart UI (front)','Checkout link','Reviews']},
 {slug:'agency',name:'BrandForge Agency',category:'Agency',base:649,thumb:'https://images.unsplash.com/photo-1552581234-26160f608093?w=1200&auto=format&fit=crop',demo:'demos/agency.html',features:['Services','Case studies','Team','Pricing','Lead capture']},
 {slug:'salon',name:'GlowSalon',category:'Salon/Beauty',base:449,thumb:'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop',demo:'demos/salon.html',features:['Services & pricing','Gallery','Booking CTA','Map','Reviews']},
 {slug:'doctor',name:'CareClinic',category:'Healthcare',base:789,thumb:'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&auto=format&fit=crop',demo:'demos/doctor.html',features:['Departments','Doctors','Appointment CTA','Insurance info','Contact']},
];
const plans=[
 {id:'starter',label:'Starter',multiplier:1,includes:['1 page','1 round revisions','Basic SEO','Delivery 5–7 days']},
 {id:'pro',label:'Pro',multiplier:1.5,includes:['Up to 5 pages','2 rounds revisions','SEO + Schema','Delivery 7–10 days']},
 {id:'ultimate',label:'Ultimate',multiplier:2,includes:['10+ pages','Unlimited revisions (2 months)','SEO + Performance','Delivery 10–14 days']},
];
const addons=[
 {id:'logo',label:'Logo & Brand Kit',price:129},
 {id:'copy',label:'Copywriting (up to 5 pages)',price:149},
 {id:'seo',label:'Advanced SEO Setup',price:189},
 {id:'hosting',label:'1‑Year Hosting + SSL',price:119},
 {id:'cms',label:'CMS & Blog Setup',price:149}
];
function currency(n){return '$ '+n.toLocaleString('en-US',{minimumFractionDigits:0})}

// ---- Cart Helpers ----
function addToCart({slug,plan='starter',addonIds=[]}){
  const t=templates.find(x=>x.slug===slug); if(!t) return;
  const p=plans.find(x=>x.id===plan)||plans[0];
  const base=Math.round(t.base*p.multiplier);
  const extras=addonIds.map(id=>(addons.find(a=>a.id===id)||{price:0}).price).reduce((a,b)=>a+b,0);
  const total=base+extras;
  const cart=Store.get(); cart.item={slug,plan,addonIds,total,ts:Date.now()}; Store.set(cart);
  location.href='checkout.html';
}
function cartSummary(){
  const c=Store.get().item; if(!c) return null;
  const t=templates.find(x=>x.slug===c.slug);
  const p=plans.find(x=>x.id===c.plan);
  const add=c.addonIds.map(id=>addons.find(a=>a.id===id));
  const base=Math.round(t.base*p.multiplier);
  const extras=add.reduce((s,a)=>s+(a?.price||0),0);
  const total=base+extras;
  return {t,p,add,base,extras,total};
}

// ---- Visual Systems (stars / aurora / grid / cursor / reveal / tilt) ----
function makeCanvas(id,z){const c=document.createElement('canvas');c.id=id;c.width=innerWidth;c.height=innerHeight;c.style.zIndex=z;document.body.appendChild(c);return c}
let starCvs,aurCvs,gridCvs,sctx,actx,gctx,stars=[];
function setupBG(){
  starCvs=makeCanvas('bg-stars',-3); aurCvs=makeCanvas('bg-aurora',-2); gridCvs=makeCanvas('bg-grid',-1);
  sctx=starCvs.getContext('2d'); actx=aurCvs.getContext('2d'); gctx=gridCvs.getContext('2d');
  stars=Array.from({length:280},()=>({x:Math.random()*starCvs.width,y:Math.random()*starCvs.height,r:Math.random()*1.4+.2,spd:Math.random()*.2+.06,tw:Math.random()*Math.PI*2}));
  drawGrid(); requestAnimationFrame(loopBG);
  addEventListener('resize',()=>{[starCvs,aurCvs,gridCvs].forEach(c=>{c.width=innerWidth;c.height=innerHeight});drawGrid()});
}
function loopBG(t){
  sctx.clearRect(0,0,starCvs.width,starCvs.height);
  for(const s of stars){s.tw+=.04;s.x-=s.spd;if(s.x<-2)s.x=starCvs.width+2;const a=.7+Math.sin(s.tw)*.3;sctx.fillStyle=`rgba(255,255,255,${a})`;sctx.beginPath();sctx.arc(s.x,s.y,s.r,0,Math.PI*2);sctx.fill()}
  actx.clearRect(0,0,aurCvs.width,aurCvs.height);
  for(let i=0;i<2;i++){const grad=actx.createLinearGradient(0,0,aurCvs.width,aurCvs.height);grad.addColorStop(0,'rgba(112,214,255,0.10)');grad.addColorStop(.5,'rgba(182,140,255,0.10)');grad.addColorStop(1,'rgba(102,255,183,0.10)');actx.fillStyle=grad;const y=Math.sin((t/2000)+i)*60+120*i+aurCvs.height*.15;actx.beginPath();actx.moveTo(0,y);for(let x=0;x<=aurCvs.width;x+=40){const yy=y+Math.sin((t/800)+x/200+i)*30;actx.lineTo(x,yy)}actx.lineTo(aurCvs.width,aurCvs.height);actx.lineTo(0,aurCvs.height);actx.closePath();actx.fill()}
  requestAnimationFrame(loopBG);
}
function drawGrid(){const s=60;gctx.clearRect(0,0,gridCvs.width,gridCvs.height);gctx.strokeStyle='#70d6ff14';gctx.lineWidth=1;for(let x=0;x<gridCvs.width;x+=s){gctx.beginPath();gctx.moveTo(x,0);gctx.lineTo(x,gridCvs.height);gctx.stroke()}for(let y=0;y<gridCvs.height;y+=s){gctx.beginPath();gctx.moveTo(0,y);gctx.lineTo(gridCvs.width,y);gctx.stroke()}}
function setupReveal(){const obs=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}})},{threshold:.12});document.querySelectorAll('.card,.section-title,.hero,.reveal').forEach(el=>obs.observe(el))}
function setupTilt(){document.querySelectorAll('.card').forEach(card=>{let rect;card.addEventListener('pointermove',e=>{rect=rect||card.getBoundingClientRect();const rx=((e.clientY-rect.top)/rect.height-.5)*-6;const ry=((e.clientX-rect.left)/rect.width-.5)*6;card.style.transform=`translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`});card.addEventListener('pointerleave',()=>card.style.transform='translateY(0) rotateX(0) rotateY(0)')})}
let cDot,cRing;function setupCursor(){cDot=document.createElement('div');cDot.className='cursor';cRing=document.createElement('div');cRing.className='cursor-ring';document.body.append(cDot,cRing);let x=innerWidth/2,y=innerHeight/2,mx=x,my=y;addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;cDot.style.transform=`translate(${x}px,${y}px)`});(function loop(){mx+=(x-mx)*.15;my+=(y-my)*.15;cRing.style.transform=`translate(${mx}px,${my}px)`;requestAnimationFrame(loop)})() ;document.querySelectorAll('.btn').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();const dx=e.clientX-(r.left+r.width/2);const dy=e.clientY-(r.top+r.height/2);b.style.transform=`translate(${dx*.03}px,${dy*.03}px)`;b.style.setProperty('--ang',(performance.now()/20)%360+'deg')});b.addEventListener('mouseleave',()=>b.style.transform='translate(0,0)')})}
document.addEventListener('DOMContentLoaded',()=>{setupBG();setupReveal();setupTilt();setupCursor()});
