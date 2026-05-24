const API_KEY = "4e97f9b6a557deaa4b08377f9646716b"; // <- paste your real key

// DOM
const form = document.getElementById("form");
const cityInput = document.getElementById("city");
const box = document.getElementById("box");

// Load last city
const LAST_KEY = "selam_last_city";
const lastCity = localStorage.getItem(LAST_KEY);
if (lastCity) { cityInput.value = lastCity; fetchWeather(lastCity); }

form.addEventListener("submit", (e) => {
e.preventDefault();
const term = cityInput.value.trim();
if (!term) return;
localStorage.setItem(LAST_KEY, term);
fetchWeather(term);
});

async function fetchWeather(term) {
try {
box.innerHTML = `<p style="color:var(--muted)">Loading...</p>`;

// 1) Geocode the user text to lat/lon (handles “Addis Ababa”, “Addis Ababa, ET”, etc.)
const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(term)}&limit=1&appid=${API_KEY}`;
const gRes = await fetch(geoURL);
const gData = await gRes.json();
if (!Array.isArray(gData) || gData.length === 0) throw new Error("City not found");

const { lat, lon, name, country, state } = gData[0];

// 2) Get current weather by coordinates (most reliable)
const wxURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
const wRes = await fetch(wxURL);
if (!wRes.ok) throw new Error("Weather unavailable");
const data = await wRes.json();

const label = [name, state, country].filter(Boolean).join(", ");
const temp = Math.round(data.main.temp);
const feels = Math.round(data.main.feels_like);
const desc = data.weather?.[0]?.description ?? "—";
const icon = data.weather?.[0]?.icon ?? "01d";
const humidity = data.main.humidity;
const wind = Math.round(data.wind.speed);

box.innerHTML = `
<div class="weather-row">
<img alt="${desc}" src="https://openweathermap.org/img/wn/${icon}@2x.png" />
<div>
<h2 style="margin:0;">${label}</h2>
<div style="font-size:40px; font-weight:700;">${temp}°C</div>
<div style="color:var(--muted); text-transform:capitalize;">${desc}</div>
<small style="color:var(--muted);">Feels like ${feels}°C</small>
</div>
</div>
<div class="weather-grid">
<div class="weather-item"><span>Humidity</span><strong>${humidity}%</strong></div>
<div class="weather-item"><span>Wind</span><strong>${wind} m/s</strong></div>
</div>
`;
} catch (err) {
box.innerHTML = `<p style="color:#ff7676;">${err.message || "Something went wrong."}</p>`;
console.error(err);
}
}