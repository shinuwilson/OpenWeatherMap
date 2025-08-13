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