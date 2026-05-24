const a = document.getElementById('a');
const b = document.getElementById('b');
const result = document.getElementById('result');

function calc(op){
const x = parseFloat(a.value);
const y = parseFloat(b.value);
if (isNaN(x) || isNaN(y)) { result.textContent = 'Result: please enter two numbers'; return; }
let out;
if (op === '+') out = x + y;
if (op === '-') out = x - y;
if (op === '*') out = x * y;
if (op === '/') out = y === 0 ? 'Cannot divide by 0' : x / y;
result.textContent = `Result: ${out}`;
}

document.querySelectorAll('button[data-op]').forEach(btn=>{
btn.addEventListener('click', () => calc(btn.dataset.op));
});