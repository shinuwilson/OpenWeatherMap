// OpenWeatherMap API - Robust Frontend Script
// =====================
const apiKey = "a7b0a65c71a270eb16129555df219f42"; 

const weatherBox = document.getElementById("weather");
const forecastBox = document.getElementById("forecast");
const forecastTitle = document.getElementById("forecast-title");

// Buttons
document.getElementById("getWeatherBtn").addEventListener("click", () => {
  const raw = document.getElementById("city").value.trim();
  if (!raw) return showError("Please enter a city (e.g., Barrie,CA).");
  const city = raw.includes(",") ? raw : `${raw},CA`; // help disambiguate
  getWeatherByCity(city);
});

document.getElementById("getLocationBtn").addEventListener("click", () => {
  if (!navigator.geolocation) return showError("Geolocation not supported.");
  navigator.geolocation.getCurrentPosition(
    pos => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
    () => showError("Unable to retrieve location.")
  );
});

// Helpers
function showLoading(targetEl) {
  targetEl.innerHTML = `<div class="card">Loading…</div>`;
}
function showError(msg) {
  weatherBox.innerHTML = `<div class="card error">${msg}</div>`;
  forecastTitle.textContent = "";
  forecastBox.innerHTML = "";
}
function changeBackground(desc = "") {
  const d = desc.toLowerCase();
  const body = document.body;
  if (d.includes("cloud")) body.style.background = "#cfd8dc";
  else if (d.includes("rain")) body.style.background = "#90a4ae";
  else if (d.includes("clear")) body.style.background = "#81d4fa";
  else body.style.background = "#e0f7fa";
}

// Generic fetch with good errors
async function fetchJSON(url) {
  const res = await fetch(url);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch {
    throw new Error(`Bad JSON from server: ${text}`);
  }
  // Some OWM endpoints return HTTP 200 but cod:"404" inside the JSON
  if (!res.ok) {
    const msg = data && data.message ? data.message : res.statusText;
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }
  return data;
}

// API calls
function getWeatherByCity(city) {
  const cw = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const fc = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  loadCurrent(cw);
  loadForecast(fc);
}

function getWeatherByCoords(lat, lon) {
  const cw = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const fc = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  loadCurrent(cw);
  loadForecast(fc);
}

async function loadCurrent(url) {
  showLoading(weatherBox);
  try {
    const data = await fetchJSON(url);

    // If API returned cod not equal to 200 inside JSON (rare for this endpoint)
    if (data.cod && parseInt(data.cod) !== 200) {
      throw new Error(data.message || "City not found");
    }

    const { name } = data;
    const { temp, humidity } = data.main;
    const wind = data.wind?.speed;
    const { description, icon } = data.weather[0];

    weatherBox.innerHTML = `
      <h2>${name}</h2>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
      <p><strong>Temperature:</strong> ${Math.round(temp)}°C</p>
      <p><strong>Condition:</strong> ${description}</p>
      <p><strong>Humidity:</strong> ${humidity}%</p>
      <p><strong>Wind Speed:</strong> ${wind} m/s</p>
    `;
    changeBackground(description);
  } catch (err) {
    console.error(err);
    showError(err.message.includes("Invalid API key")
      ? "Your API key is invalid or not active yet. Check it in OpenWeather > My API keys."
      : err.message || "Failed to load weather.");
  }
}

async function loadForecast(url) {
  forecastTitle.textContent = "";
  showLoading(forecastBox);
  try {
    const data = await fetchJSON(url);
