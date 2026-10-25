const stage = document.querySelector('#stage');
const archer = document.querySelector('#archer');
const arrowReady = document.querySelector('#arrowReady');
const projectileLayer = document.querySelector('#projectileLayer');
const effigy = document.querySelector('#effigy');
const targetArea = document.querySelector('#targetArea');
const card = document.querySelector('#messageCard');
const title = document.querySelector('#messageTitle');
const message = document.querySelector('#messageText');
const startButton = document.querySelector('#startButton');
const arrowsLeftEl = document.querySelector('#arrowsLeft');
const scoreEl = document.querySelector('#score');
const guide = document.querySelector('#aimGuide');
const controlsHint = document.querySelector('#controlsHint');
const flash = document.querySelector('#impactFlash');
const fireworks = document.querySelector('#fireworks');
const tips = ['Aim for the chest to ignite the whole effigy!','A higher arc can clear the mela crowd.','Pull back farther for a faster, brighter shot.'];
const heads = document.querySelector('#headRow');
for (let i=0;i<10;i++){const h=document.createElement('div');h.className='r-head';h.style.transform=`translateY(${Math.abs(4.5-i)*2}px) scale(${i===4||i===5?1:.86})`;heads.append(h)}

let active=false, aiming=false, burning=false, arrows=3, score=0, pointerStart=null, soundOn=true, audioCtx=null, wind=(Math.random()-.5)*.07;
document.querySelector('#windText').textContent=Math.abs(wind)<.025?'CALM':wind>0?'→ BREEZE':'BREEZE ←';
document.querySelector('.wind-track i').style.left=`${35+wind*180}%`;
const bounds=()=>stage.getBoundingClientRect();
const startPoint=()=>{const b=bounds();return{x:b.width*.205,y:b.height*.59}};
function playTone(freq=440,duration=.12,type='sine',volume=.04){if(!soundOn)return;try{audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(freq,audioCtx.currentTime);g.gain.setValueAtTime(volume,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration)}catch{}}
function setCard(t,m,button){title.innerHTML=t;message.textContent=m;startButton.innerHTML=button;card.classList.remove('hidden')}
function begin(){if(burning)return;active=true;card.classList.add('hidden');controlsHint.style.opacity='';document.querySelector('#tipText').textContent=tips[Math.floor(Math.random()*tips.length)];playTone(560,.08,'triangle')}
startButton.addEventListener('click',()=>{if(arrows===0||targetArea.classList.contains('destroyed'))reset();begin()});
document.querySelector('#soundButton').addEventListener('click',e=>{soundOn=!soundOn;e.currentTarget.textContent=soundOn?'♫':'♪';if(soundOn)playTone(520,.08)});
document.querySelector('#resetButton').addEventListener('click',reset);
function reset(){active=false;aiming=false;burning=false;arrows=3;score=0;scoreEl.textContent='000';arrowsLeftEl.textContent='03';arrowReady.style.display='block';projectileLayer.replaceChildren();effigy.classList.remove('burning');targetArea.classList.remove('destroyed');effigy.style.opacity='';flash.style.opacity='0';window.dispatchEvent(new Event('effigy:reset'));setCard('AIM FOR THE<br><em>FLAME OF VICTORY</em>','Hold, pull back, and release your burning arrow.','BEGIN THE Dahan <span>↗</span>');controlsHint.style.opacity='.7';}
function aimAt(e){if(!aiming)return;const b=bounds(), dx=pointerStart.x-e.clientX, dy=pointerStart.y-e.clientY, len=Math.min(110,Math.hypot(dx,dy));if(len<7)return;const ang=Math.atan2(dy,dx), p=Math.min(1,len/95);arrowReady.style.transform=`rotate(${-ang}rad) scaleX(${1+p*.55})`;arrowReady.style.left=`${55-p*10}%`;archer.style.transform=`translateX(-50%) rotate(${-Math.sin(ang)*p*4}deg)`;guide.style.left=`${Math.max(8,(pointerStart.x-b.left)/b.width*100-2)}%`;guide.style.top=`${Math.max(20,(pointerStart.y-b.top)/b.height*100-10)}%`;guide.classList.add('active');}
stage.addEventListener('pointerdown',e=>{if(!active||burning||arrows<=0)return;const b=bounds(),x=e.clientX-b.left,y=e.clientY-b.top,origin=startPoint();if(x>b.width*.36||y<b.height*.25||y>b.height*.78)return;aiming=true;pointerStart={x:e.clientX,y:e.clientY};stage.setPointerCapture(e.pointerId);aimAt(e);});
stage.addEventListener('pointermove',aimAt);
stage.addEventListener('pointerup',e=>{if(!aiming)return;aiming=false;guide.classList.remove('active');const dx=pointerStart.x-e.clientX,dy=pointerStart.y-e.clientY,len=Math.hypot(dx,dy);archer.style.transform='translateX(-50%)';arrowReady.style.transform='';arrowReady.style.left='55%';pointerStart=null;if(len<12)return;shoot(dx,dy,len);});
function shoot(dx,dy,len){active=false;arrows--;arrowsLeftEl.textContent=String(arrows).padStart(2,'0');arrowReady.style.display='none';playTone(230,.15,'sawtooth',.025);const b=bounds(),origin=startPoint(),power=Math.min(1,len/100),angle=Math.atan2(dy,dx),speed=470+power*510,vx=Math.cos(angle)*speed,vy=Math.sin(angle)*speed;const el=document.createElement('div');el.className='projectile';projectileLayer.append(el);const tHit=(b.width*.65-origin.x)/Math.max(vx,180);const hitY=origin.y-vy*tHit+350*tHit*tHit;const targetY=b.height*.51;const hit=Math.abs(hitY-targetY)<b.height*.255&&vx>240;const total=Math.max(.4,tHit);const started=performance.now();function tick(now){const t=Math.min((now-started)/1000,total),x=origin.x+vx*t,y=origin.y-vy*t+350*t*t;el.style.left=`${x-16}px`;el.style.top=`${y}px`;el.style.transform=`rotate(${Math.atan2(vy-700*t,vx)}rad)`;if(t<total){requestAnimationFrame(tick);return}el.remove();if(hit)ignite();else miss(x,y)}requestAnimationFrame(tick)}
function miss(x,y){playTone(150,.2,'triangle',.025);if(arrows>0){active=true;arrowReady.style.display='block';if(Math.random()<.35)document.querySelector('#tipText').textContent='Close! Adjust your arc and take another shot.'}else setTimeout(()=>setCard('THE NIGHT IS NOT OVER','Your arrows are spent. Take aim again and light up the mela!','TRY AGAIN <span>↻</span>'),350)}
function ignite(){burning=true;window.dispatchEvent(new Event('effigy:ignite'));playTone(110,.7,'sawtooth',.05);flash.style.transition='none';flash.style.opacity='.42';setTimeout(()=>{flash.style.transition='opacity .6s';flash.style.opacity='0'},80);effigy.classList.add('burning');const b=bounds();for(let i=0;i<20;i++)setTimeout(()=>particle(b.width*.65+(Math.random()-.5)*65,b.height*(.40+Math.random()*.34),['#ffce58','#ff7832','#fff2ad'][i%3]),i*70);let n=0;const fire=setInterval(()=>{particle(b.width*(.65+(Math.random()-.5)*.07),b.height*(.31+Math.random()*.38),['#ffca56','#ff7330','#fff0ad'][Math.floor(Math.random()*3)]);playTone(90+Math.random()*90,.09,'square',.009);if(++n>26)clearInterval(fire)},105);setTimeout(()=>{window.dispatchEvent(new Event('effigy:destroy'));targetArea.classList.add('destroyed');effigy.classList.remove('burning');burstShow();score+=1000+arrows*250;scoreEl.textContent=String(score).padStart(3,'0');playTone(660,.22,'triangle',.05);setTimeout(()=>playTone(880,.4,'triangle',.04),180);setCard('VICTORY OF LIGHT!','Ravan Dahan! The whole mela celebrates your perfect shot.','PLAY AGAIN <span>↻</span>');arrows=0;arrowsLeftEl.textContent='00';burning=false},2900)}
function particle(x,y,color){const b=bounds(),p=document.createElement('i');p.className='particle';const size=3+Math.random()*7;p.style.cssText=`left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${color};box-shadow:0 0 ${size*2}px ${color};`;projectileLayer.append(p);const dx=(Math.random()-.5)*150,dy=-40-Math.random()*155;p.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx}px,${dy}px) scale(.1)`,opacity:0}],{duration:550+Math.random()*550,easing:'ease-out'}).onfinish=()=>p.remove()}
function burstShow(){for(let i=0;i<16;i++){const s=document.createElement('i');s.className='burst';s.style.left=`${48+Math.random()*30}%`;s.style.top=`${20+Math.random()*38}%`;s.style.animationDelay=`${Math.random()*.55}s`;fireworks.append(s);setTimeout(()=>s.remove(),1900)}for(let j=0;j<4;j++)setTimeout(()=>{const s=document.createElement('i');s.className='burst';s.style.left=`${15+Math.random()*70}%`;s.style.top=`${12+Math.random()*32}%`;fireworks.append(s);setTimeout(()=>s.remove(),1300)},j*350)}
// The mela lamps shimmer gently while the player lines up a shot.
setInterval(()=>{if(active&&!aiming){document.querySelector('.moon').style.opacity=.72+Math.random()*.25}},700);
