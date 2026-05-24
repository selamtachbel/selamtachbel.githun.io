// Basic state + persistence
const STORAGE_KEY = "selam_todos_v1";
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let filter = "all"; // all | active | done

// DOM
const form = document.getElementById("form");
const input = document.getElementById("input");
const list = document.getElementById("list");
const count = document.getElementById("count");
const clearDoneBtn = document.getElementById("clearDone");
const filterBtns = document.querySelectorAll("[data-filter]");

// Helpers
function save() {
localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
function updateCount() {
const active = todos.filter(t => !t.done).length;
const total = todos.length;
count.textContent = `${active} active • ${total} total`;
}
function render() {
list.innerHTML = "";
const filtered = todos.filter(t =>
filter === "all" ? true : filter === "active" ? !t.done : t.done
);

filtered.forEach((t, idx) => {
const li = document.createElement("li");
li.className = "todo";
li.innerHTML = `
<label class="todo__row">
<input type="checkbox" ${t.done ? "checked" : ""} />
<span class="todo__text ${t.done ? "is-done" : ""}">${t.text}</span>
</label>
<button class="todo__del" aria-label="Delete">✕</button>
`;

// Toggle done
li.querySelector('input').addEventListener('change', (e) => {
t.done = e.target.checked;
save(); updateCount(); render();
});

// Delete
li.querySelector('.todo__del').addEventListener('click', () => {
const i = todos.indexOf(t);
if (i > -1) todos.splice(i, 1);
save(); updateCount(); render();
});

list.appendChild(li);
});

updateCount();
// highlight active filter button
filterBtns.forEach(b => b.style.color = (b.dataset.filter === filter) ? "var(--accent-2)" : "");
}

// Add new
form.addEventListener("submit", (e) => {
e.preventDefault();
const text = input.value.trim();
if (!text) return;
todos.unshift({ text, done: false, id: Date.now() });
input.value = "";
save(); updateCount(); render();
});

// Filters
filterBtns.forEach(btn => btn.addEventListener("click", () => {
filter = btn.dataset.filter;
render();
}));

// Clear done
clearDoneBtn.addEventListener("click", () => {
todos = todos.filter(t => !t.done);
save(); render();
});

// Enter to add from input works via form submit
render();

