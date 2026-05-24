// === Config ===
const PATH = "assets/phone360/";
const PREFIX = "phone-";
const EXT = "jpg";
const FRAMES = 4; // you currently have 4 images
const SENSITIVITY = 6; // drag sensitivity

// === DOM ===
const imgEl = document.getElementById("spinImg");
const stage = document.getElementById("stage");
const hint = document.getElementById("hint");
const btnNext= document.getElementById("next");
const btnPrev= document.getElementById("prev");
const btnPlay= document.getElementById("play");
const btnPause=document.getElementById("pause");

// Build frame URLs
const pad2 = n => String(n).padStart(2, "0");
const frames = Array.from({length: FRAMES}, (_,i) => `${PATH}${PREFIX}${pad2(i+1)}.${EXT}`);

// State
let idx = 0;
let startX = null;
let lastX = null;
let playing = false;
let timer = null;

// Show frame
function show(i){
idx = (i + FRAMES) % FRAMES;
imgEl.src = frames[idx];
}

// Drag logic
function startDrag(x){ startX = lastX = x; hint.style.opacity = "0"; }
function moveDrag(x){
if (startX === null) return;
const dx = x - lastX;
if (Math.abs(dx) >= SENSITIVITY){
const steps = Math.trunc(dx / SENSITIVITY);
show(idx + steps);
lastX = x;
}
}
function endDrag(){ startX = lastX = null; }

stage.addEventListener("mousedown", e => startDrag(e.clientX));
window.addEventListener("mousemove", e => moveDrag(e.clientX));
window.addEventListener("mouseup", endDrag);

stage.addEventListener("touchstart", e => startDrag(e.touches[0].clientX), {passive:true});
stage.addEventListener("touchmove", e => moveDrag(e.touches[0].clientX), {passive:true});
stage.addEventListener("touchend", endDrag);

// Buttons
btnNext.addEventListener("click", () => show(idx + 1));
btnPrev.addEventListener("click", () => show(idx - 1));

// Auto play
function play(){
if (playing) return;
playing = true;
timer = setInterval(() => show(idx + 1), 800); // slower for 4 frames
}
function pause(){
playing = false;
clearInterval(timer);
}
btnPlay.addEventListener("click", play);
btnPause.addEventListener("click", pause);

// Keyboard
window.addEventListener("keydown", e=>{
if (e.key === "ArrowRight") show(idx + 1);
if (e.key === "ArrowLeft") show(idx - 1);
if (e.key === " ") playing ? pause() : play();
});

// Start
show(0);