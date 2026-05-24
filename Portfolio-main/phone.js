// Tilt / shine effect
const card = document.getElementById('card');
const shine = document.getElementById('shine');
let rect;

function setRect(){ rect = card.getBoundingClientRect(); }
setRect();
window.addEventListener('resize', setRect);

function tilt(x, y){
const px = (x - rect.left) / rect.width; // 0..1
const py = (y - rect.top) / rect.height; // 0..1
const rx = (py - 0.5) * 14; // tilt range
const ry = (0.5 - px) * 18;

card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;

// Shine follows cursor
const gx = px * 100, gy = py * 100;
shine.style.background = `radial-gradient( circle at ${gx}% ${gy}%, rgba(255,255,255,.35), transparent 45% )`;
}

card.addEventListener('mousemove', (e)=> tilt(e.clientX, e.clientY));
card.addEventListener('mouseleave', ()=>{
card.style.transform = 'rotateX(0deg) rotateY(0deg)';
shine.style.background = 'none';
});

// Touch support
let touching = false;
card.addEventListener('touchstart', (e)=> { touching = true; }, {passive:true});
card.addEventListener('touchmove', (e)=>{
if(!touching) return;
const t = e.touches[0];
tilt(t.clientX, t.clientY);
}, {passive:true});
card.addEventListener('touchend', ()=>{
touching = false;
card.style.transform = 'rotateX(0deg) rotateY(0deg)';
shine.style.background = 'none';
});

// Color swatches
const imgEl = document.getElementById('phoneImg');
document.querySelectorAll('.swatch').forEach(btn=>{
btn.addEventListener('click', ()=>{
const src = btn.getAttribute('data-img');
imgEl.src = src;
});
});

// Fake cart
document.getElementById('buyBtn').addEventListener('click', ()=>{
alert('Added “Selam One (128 GB)” to cart ✅');
});