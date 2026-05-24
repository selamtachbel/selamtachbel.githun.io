// ---------- config ----------
const VIP_ADDON = 5; // extra per VIP seat
const HOLD_MS = 60 * 60 * 1000; // 1 hour hold

// ---------- DOM ----------
const seatsEl = document.getElementById('seats');
const gridMoviesEl = document.getElementById('movies-grid');
const countEl = document.getElementById('count');
const countStdEl = document.getElementById('count-std');
const countVipEl = document.getElementById('count-vip');
const totalEl = document.getElementById('total');
const reserveBtn = document.getElementById('reserve');
const clearBtn = document.getElementById('clear');
const paymentSec = document.getElementById('payment');
const payTotalEl = document.getElementById('pay-total');
const payForm = document.getElementById('pay-form');
const cancelPayBtn = document.getElementById('cancel-pay');
const currentMovieEl= document.getElementById('current-movie');
const basePriceEl = document.getElementById('base-price');
const holdTimerEl = document.getElementById('hold-timer');

// ---------- state per movie ----------
function key(movieId){ return `cinema_state_${movieId}`; }

function getState(movieId){
const def = { basePrice: 10, selected: [], reserved: [], occupied: [] };
return JSON.parse(localStorage.getItem(key(movieId)) || JSON.stringify(def));
}
function saveState(movieId, state){
localStorage.setItem(key(movieId), JSON.stringify(state));
}

// currently selected movie card
let currentMovie = { id: 'movie1', title: 'The Explorer', price: 10 };

// init movie selection from cards
gridMoviesEl.addEventListener('click', (e)=>{
const card = e.target.closest('.movie-card');
if(!card) return;

// active style
[...gridMoviesEl.children].forEach(c=>c.classList.remove('active'));
card.classList.add('active');

currentMovie = {
id: card.dataset.id,
title: card.querySelector('h3').textContent.trim(),
price: Number(card.dataset.price || 10)
};
currentMovieEl.textContent = currentMovie.title;
basePriceEl.textContent = `$${currentMovie.price}`;

// refresh UI for this movie
refresh();
});

// ---------- helpers ----------
function selectableSeats(){ return [...seatsEl.querySelectorAll('.seat')]; }

// remove expired holds
function purgeExpiredHolds(state){
const now = Date.now();
state.reserved = state.reserved.filter(h => h.until > now);
}

// compute totals
function computeTotals(state){
const seats = selectableSeats();
let std = 0, vip = 0;

state.selected.forEach(i => {
const el = seats[i];
if(!el) return;
if (el.classList.contains('vip')) vip++;
else std++;
});

const total = std * currentMovie.price + vip * (currentMovie.price + VIP_ADDON);
return { std, vip, total };
}

let holdCountdownTimer = null;
function startHoldCountdown(expiresAt){
stopHoldCountdown();
function tick(){
const ms = expiresAt - Date.now();
if(ms <= 0){
holdTimerEl.textContent = '00:00:00';
// auto-release on next refresh
refresh();
stopHoldCountdown();
return;
}
const h = Math.floor(ms/3600000);
const m = Math.floor((ms%3600000)/60000);
const s = Math.floor((ms%60000)/1000);
holdTimerEl.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
tick();
holdCountdownTimer = setInterval(tick, 1000);
}
function stopHoldCountdown(){
if(holdCountdownTimer){ clearInterval(holdCountdownTimer); holdCountdownTimer = null; }
}

// ---------- rendering ----------
function refresh(){
const state = getState(currentMovie.id);
purgeExpiredHolds(state);
saveState(currentMovie.id, state);

// Paint seats according to state
const seats = selectableSeats();
seats.forEach((el, i) => {
el.classList.remove('selected','reserved','occupied');
// occupied first
if (state.occupied.includes(i)) {
el.classList.add('occupied');
return;
}
// reserved (still valid?)
const h = state.reserved.find(h => h.index === i);
if (h && h.until > Date.now()) {
el.classList.add('reserved');
return;
}
// user selected (local, not yet held)
if (state.selected.includes(i)) {
el.classList.add('selected');
}
});

const { std, vip, total } = computeTotals(state);
countEl.textContent = String(state.selected.length);
countStdEl.textContent = String(std);
countVipEl.textContent = String(vip);
totalEl.textContent = total.toFixed(2);
reserveBtn.disabled = state.selected.length === 0;

// If there is any active hold, show payment section with countdown
const activeHold = state.reserved.filter(h=>h.until > Date.now()).sort((a,b)=>a.until-b.until)[0];
if (activeHold){
paymentSec.classList.remove('hidden');
payTotalEl.textContent = total.toFixed(2); // will be replaced on reserve anyway
startHoldCountdown(activeHold.until);
} else {
paymentSec.classList.add('hidden');
stopHoldCountdown();
}

currentMovieEl.textContent = currentMovie.title;
basePriceEl.textContent = `$${currentMovie.price}`;
}

// ---------- seat selection ----------
seatsEl.addEventListener('click', (e)=>{
const seat = e.target.closest('.seat');
if(!seat) return;

const seats = selectableSeats();
const index = seats.indexOf(seat);

const state = getState(currentMovie.id);
purgeExpiredHolds(state);

// cannot click occupied or reserved
const isOccupied = state.occupied.includes(index);
const isReserved = state.reserved.some(h => h.index === index && h.until > Date.now());
if (isOccupied || isReserved) return;

// toggle in selected
const pos = state.selected.indexOf(index);
if (pos >= 0) state.selected.splice(pos,1);
else state.selected.push(index);

saveState(currentMovie.id, state);
refresh();
});

// ---------- buttons ----------
clearBtn.addEventListener('click', ()=>{
const state = getState(currentMovie.id);
state.selected = [];
saveState(currentMovie.id, state);
refresh();
});

reserveBtn.addEventListener('click', ()=>{
const state = getState(currentMovie.id);
purgeExpiredHolds(state);

if (state.selected.length === 0) return;

// convert selected → reserved (hold 1 hour)
const expires = Date.now() + HOLD_MS;
state.reserved = [
...state.reserved.filter(h=>h.until > Date.now()), // keep valid holds
...state.selected.map(i => ({ index: i, until: expires }))
];
// compute total at reserve time
const { total } = computeTotals(state);
state.selected = []; // clear selection once held
saveState(currentMovie.id, state);

payTotalEl.textContent = total.toFixed(2);
paymentSec.classList.remove('hidden');
startHoldCountdown(expires);
refresh();
});

cancelPayBtn.addEventListener('click', ()=>{
paymentSec.classList.add('hidden');
});

// payment submit (demo)
payForm.addEventListener('submit', ()=>{
const name = document.getElementById('fullname').value.trim();
const email= document.getElementById('email').value.trim();
if (!name || !email){ alert('Please enter your name and email.'); return; }

const state = getState(currentMovie.id);
purgeExpiredHolds(state);

// convert ALL active holds → occupied
const now = Date.now();
const toOccupy = state.reserved.filter(h => h.until > now).map(h => h.index);
state.occupied = Array.from(new Set([...state.occupied, ...toOccupy]));
state.reserved = state.reserved.filter(h => h.until <= now); // remove holds we just consumed
saveState(currentMovie.id, state);

alert(`Thanks, ${name}! Your payment ($${payTotalEl.textContent}) is recorded (demo).`);
paymentSec.classList.add('hidden');
refresh();
});

// ---------- initial movie selection (first card active) ----------
(function initFirstMovie(){
const first = gridMoviesEl.querySelector('.movie-card');
if (first){
first.classList.add('active');
currentMovie = {
id: first.dataset.id,
title: first.querySelector('h3').textContent.trim(),
price: Number(first.dataset.price || 10)
};
currentMovieEl.textContent = currentMovie.title;
basePriceEl.textContent = `$${currentMovie.price}`;
}
refresh();
})();

// Also periodically purge expired holds (in case the tab stays open)
setInterval(()=>refresh(), 10_000);


