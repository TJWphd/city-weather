const locationInput = document.getElementById("input");
const search = document.getElementById("searchButton");
const weather = document.getElementById("weather");
const forecast = document.getElementById("forecast");
// const API_key = "09e9ace5d5bf69cfa6ecf2329111b073";
const current = document.getElementById("current");
const search_element = document.getElementById("search-history");

search.addEventListener("click", function (event) {
  console.log(API_key);
  savedSearchHistory(locationInput.value);
  getCoords(locationInput.value);
});

function getCoords(city) {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_key}`
  )
    .then((response) => response.json())
    .then((data) => {
      const { name, lat, lon } = data[0];
      console.log(lat, lon);
      getWeather(name, lat, lon);
    })
    .catch((error) => {
      weather.innerHTML = `<p>Error: ${error}</p>`;
    });
}

function getWeather(name, lat, lon) {
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => console.error("Error fetching weather data:", error));
}

const savedSearchHistory = (city) => {
  let cityHistory = JSON.parse(localStorage.getItem("cities"));
  if (!cityHistory) {
    cityHistory = [];
  }
  cityHistory.push(city);
  localStorage.setItem("cities", JSON.stringify(cityHistory));
};

const displayWeather = (weatherData) => {
  current.innerHTML = "";
  console.log(weatherData);

  let isFirstDay = true;
  forecast.innerHTML = "";
  weatherData.list.forEach((element, index) => {
    if (index % 8 === 0) {
      const weatherCard = document.createElement("div");
      weatherCard.classList.add("col");
      const cardBody = document.createElement("div");
      cardBody.classList.add("card", "border-0", "bg-secondary", "text-white");

      forecast.appendChild(weatherCard);

      const cityName = document.createElement("h2");
      const date = document.createElement("div");
      const URL = `http://openweathermap.org/img/wn/${element.weather[0].icon}.png`;
      const icon = document.createElement("img");
      icon.src = URL;
      const tempKelvin = element.main.temp;
      const tempCelsius = tempKelvin - 273.15;
      const temperature = document.createElement("div"); // Create the temperature element
      temperature.textContent = tempCelsius.toFixed(2); // Display temperature with 2 decimal places
      temperature.classList.add("temperature");
      cardBody.appendChild(temperature); // Append the temperature element

      temperature.textContent = tempCelsius.toFixed(2); // displays with 2 decimal places
      temperature.classList.add("temperature");
      const humidity = document.createElement("div");
      const windSpeed = document.createElement("div");

      cityName.textContent = weatherData.city.name;
      date.textContent = new Date(element.dt * 1000);
      temperature.textContent = element.main.temp;
      humidity.textContent = element.main.humidity;
      windSpeed.textContent = element.wind.speed;

      cardBody.appendChild(cityName);
      cardBody.appendChild(date);
      cardBody.appendChild(icon);
      cardBody.appendChild(tempCelsius);
      cardBody.appendChild(humidity);
      cardBody.appendChild(windSpeed);
      weatherCard.appendChild(cardBody);

      if (isFirstDay) {
        const currentWeatherCard = weatherCard;
        console.log("123");
        current.innerHTML = "";
        current.appendChild(currentWeatherCard);
        isFirstDay = false;
      }
    }
  });
};

function renderSearchHistory() {
  const history = JSON.parse(localStorage.getItem("cities"));
  const searchHistoryContainer = document.getElementById("search-history");
  searchHistoryContainer.innerHTML = ""; //clears previous history

  if (history && history.length > 0) {
    history.forEach((city) => {
      const searchHistory = document.createElement("button");
      searchHistory.addEventListener("click", () => {
        getCoords(city);
      });
      searchHistory.innerText = city;
      searchHistoryContainer.appendChild(searchHistory);
    });
  } else {
    const noHistoryMessage = document.createElement("div");
    noHistoryMessage.innerText = "No search history available";
    searchHistoryContainer.appendChild(noHistoryMessage);
  }
}
