// 1) Your images (replace with your own file paths later)
const IMAGES = [
"https://picsum.photos/id/1015/1200/700",
"https://picsum.photos/id/1025/1200/700",
"https://picsum.photos/id/1003/1200/700",
"https://picsum.photos/id/1043/1200/700",
"https://picsum.photos/id/1050/1200/700"
];

const imgEl = document.getElementById("slide");
const dotsEl = document.getElementById("dots");
const slider = document.getElementById("slider");

let i = 0;
let timer;

// Build dots
IMAGES.forEach((_, idx) => {
const dot = document.createElement("button");
dot.className = "dot";
dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
dot.addEventListener("click", () => go(idx));
dotsEl.appendChild(dot);
});

function render() {
imgEl.src = IMAGES[i];
document.querySelectorAll(".dot").forEach((d, idx) => {
d.classList.toggle("active", idx === i);
});
}

function next() { i = (i + 1) % IMAGES.length; render(); }
function prev() { i = (i - 1 + IMAGES.length) % IMAGES.length; render(); }
function go(n) { i = n % IMAGES.length; render(); }

document.querySelector(".next").addEventListener("click", next);
document.querySelector(".prev").addEventListener("click", prev);

// Auto-play (pause on hover)
function start() { timer = setInterval(next, 4000); }
function stop() { clearInterval(timer); }
slider.addEventListener("mouseenter", stop);
slider.addEventListener("mouseleave", start);

// Keyboard arrows
window.addEventListener("keydown", (e) => {
if (e.key === "ArrowRight") next();
if (e.key === "ArrowLeft") prev();
});

// Basic swipe (touch)
let x0 = null;
slider.addEventListener("touchstart", e => x0 = e.touches[0].clientX, {passive:true});
slider.addEventListener("touchend", e => {
if (x0 === null) return;
const dx = e.changedTouches[0].clientX - x0;
if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
x0 = null;
});

render();
start();

