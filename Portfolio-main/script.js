// Show the current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Dark / Light mode toggle
const themeToggle = document.getElementById("themeToggle");
let darkMode = true;

themeToggle.addEventListener("click", () => {
darkMode = !darkMode;
if (darkMode) {
document.body.classList.remove("light");
themeToggle.textContent = "🌙";
} else {
document.body.classList.add("light");
themeToggle.textContent = "☀️";
}
});
