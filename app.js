'use strict';
const filters=document.querySelectorAll('[data-filter]');
filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active))});document.querySelectorAll('[data-category]').forEach(item=>{item.hidden=button.dataset.filter!=='all'&&item.dataset.category!==button.dataset.filter})}));
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const layers=[...document.querySelectorAll('[data-depth]')];
const hero=document.querySelector('.hero');
let current=scrollY,target=scrollY,frame=0;
function render(){current+=(target-current)*.12;const mobile=innerWidth<550?.55:1;layers.forEach(layer=>{const y=Math.min(current,hero.offsetHeight)*Number(layer.dataset.depth)*mobile;layer.style.transform=`translate3d(0,${y.toFixed(2)}px,0)${layer.classList.contains('round-stamp')?' rotate(12deg)':''}`});if(Math.abs(target-current)>.1)frame=requestAnimationFrame(render);else frame=0}
function update(){if(motion.matches)return;target=scrollY;if(!frame)frame=requestAnimationFrame(render)}
addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});motion.addEventListener('change',()=>{if(motion.matches){cancelAnimationFrame(frame);frame=0;layers.forEach(layer=>layer.style.transform='')}else update()});update();

const video=document.querySelector('#hero-video');
const videoToggle=document.querySelector('#video-toggle');
let manualPause=false;
function syncVideo(){
 if(motion.matches){video.pause();video.removeAttribute('src');video.querySelector('source').removeAttribute('src');video.load();videoToggle.hidden=true;return}
 const source=video.querySelector('source');
 if(!source.getAttribute('src')){source.src=source.dataset.src;video.load()}
 videoToggle.hidden=false;
 if(!manualPause)video.play().catch(()=>{videoToggle.textContent='Reproduzir vídeo';videoToggle.setAttribute('aria-pressed','true')});
}
videoToggle.addEventListener('click',()=>{manualPause=!video.paused;if(manualPause)video.pause();else video.play().catch(()=>{});videoToggle.textContent=manualPause?'Reproduzir vídeo':'Pausar vídeo';videoToggle.setAttribute('aria-pressed',String(manualPause))});
video.addEventListener('playing',()=>{videoToggle.textContent='Pausar vídeo';videoToggle.setAttribute('aria-pressed','false')});
video.addEventListener('error',()=>{videoToggle.hidden=true});
motion.addEventListener('change',syncVideo);syncVideo();

// Native modal: keyboard focus, Escape and focus restoration are handled by dialog.
const productPhotos={
 burger:{name:'Double Cheese Burger Menu',photos:['assets/burger.webp']},
 wrap:{name:'Frango Tenders Wrap Menu',photos:['assets/products/wrap-1.webp']},
 pizza:{name:'Chicken Tikka Pizza',photos:['assets/products/pizza-1.webp']},
 curry:{name:'Prato Frango Tandoori Curry',photos:['assets/products/curry-1.webp']}
};
productPhotos.rice={name:'Arroz de Camarão Cheeze',photos:['assets/products/rice-1.webp']};
const dishDialog=document.querySelector('#dish-dialog');
const dishPhoto=document.querySelector('#dish-photo');
let videoWasPlaying=false;
document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>{
 const product=productPhotos[button.dataset.product];
 document.querySelector('#dish-title').textContent=product.name;
 dishPhoto.src=product.photos[0];
 dishPhoto.alt=`${product.name} — imagem ilustrativa`;
 videoWasPlaying=!video.paused;video.pause();dishDialog.showModal();document.body.classList.add('dish-open');
}));
document.querySelector('.dish-close').addEventListener('click',()=>dishDialog.close());
dishDialog.addEventListener('click',e=>{if(e.target===dishDialog)dishDialog.close()});
dishDialog.addEventListener('close',()=>{document.body.classList.remove('dish-open');if(videoWasPlaying&&!motion.matches&&!manualPause)video.play().catch(()=>{})});
