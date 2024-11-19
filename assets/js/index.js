const locationInput = document.getElementById("input");
const search = document.getElementById("searchButton");
const cityNameEl = document.getElementById("cityName");
const weather = document.getElementById("weather");
const current = document.getElementById("current");
const forecast = document.getElementById("forecast");
const API_key = "09e9ace5d5bf69cfa6ecf2329111b073";

const search_element = document.getElementById("search-history");

// Event listener for search button click
search.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent form submission
  const city = locationInput.value.trim();
  if (city) {
    savedSearchHistory(city);
    getCoords(city);
    renderSearchHistory();
    locationInput.value = ""; // Clears input field
  }
});

// turns city entry into latitude/longitude coordinates for API
async function getCoords(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_key}`
    );
    const data = await response.json();
    const { name, lat, lon } = data[0];
    getWeather(name, lat, lon);
    cityNameEl.textContent = city;
  } catch (error) {
    weather.innerHTML = `<p>Error: ${error}</p>`;
  }
}

// enters coords into API to return weather forecast
async function getWeather(name, lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// creates HTML elements and displays weather in them
const displayWeather = (weatherData) => {
  current.innerHTML = "";
  let isFirstDay = true;
  forecast.innerHTML = "";
  const cityName = document.createElement("h2");
  cityName.textContent = weatherData.cityName;
  current.appendChild(cityName);

  weatherData.list.forEach((element, index) => {
    if (index % 8 === 0) {
      const weatherCard = document.createElement("div");
      weatherCard.classList.add("col");
      const cardBody = document.createElement("div");
      cardBody.classList.add("card", "border-0", "bg-secondary", "text-white");

      const cityName = document.createElement("h2");
      cityName.textContent = weatherData.cityName;
      const date = document.createElement("div");
      date.textContent = new Date(element.dt * 1000).toLocaleDateString();

      const iconURL = `https://openweathermap.org/img/wn/${element.weather[0].icon}.png`;
      const icon = document.createElement("img");
      icon.setAttribute("src", iconURL);
      icon.setAttribute("alt", element.weather[0].description);
      const tempKelvin = element.main.temp;
      const tempFahrenheit = ((tempKelvin - 273.15) * 9) / 5 + 32;

      const temperature = document.createElement("div"); // Create the temperature element
      temperature.textContent = `${tempFahrenheit.toFixed(1)}°F`; // show 1 decimal place
      temperature.classList.add("temperature");
      const humidity = document.createElement("div");
      humidity.textContent = `Humidity: ${element.main.humidity}%`;
      const windSpeed = document.createElement("div");
      windSpeed.textContent = `Wind: ${element.wind.speed} m/s`;

      // appends elements to card body
      cardBody.appendChild(date);
      cardBody.appendChild(icon);
      cardBody.appendChild(temperature);
      cardBody.appendChild(humidity);
      cardBody.appendChild(windSpeed);

      // appends card body to card
      weatherCard.appendChild(cardBody);

      // displays current day's weather in Current Zone container
      if (isFirstDay) {
        current.appendChild(cardBody);
        isFirstDay = false;
      } else {
        forecast.appendChild(weatherCard);
      }
    }
  });
};

// saves search history to local storage
const savedSearchHistory = (city) => {
  let cityHistory = JSON.parse(localStorage.getItem("cities")) || [];
  cityHistory.push(city);
  localStorage.setItem("cities", JSON.stringify(cityHistory));
};

// renders search history from local storage
function renderSearchHistory() {
  const history = JSON.parse(localStorage.getItem("cities")) || [];
  const searchHistoryContainer = document.getElementById("search-history");
  searchHistoryContainer.innerHTML = "";

  if (history.length > 0) {
    history.forEach((city) => {
      const searchHistoryButton = document.createElement("button");
      searchHistoryButton.textContent = city;
      searchHistoryButton.addEventListener("click", () => {
        getCoords(city);
      });
      searchHistoryContainer.appendChild(searchHistoryButton);
    });
  } else {
    const noHistoryMessage = document.createElement("div");
    noHistoryMessage.textContent = "No search history available";
    searchHistoryContainer.appendChild(noHistoryMessage);
  }
}

// Renders search history on page load
renderSearchHistory();
