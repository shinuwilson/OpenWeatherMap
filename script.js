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
