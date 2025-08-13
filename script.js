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