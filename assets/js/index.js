const locationInput = document.getElementById("input");
const search = document.getElementById("searchButton");
const weather = document.getElementById("weather");
const forecast = document.getElementById("forecast");
const API_key = "09e9ace5d5bf69cfa6ecf2329111b073";
const current = document.getElementById("current");
const search_element = document.getElementById("search-history");

renderSearchHistory();

search.addEventListener("click", function (event) {
  console.log(API_key);
  savedSearchHistory(locationInput.value);
  getCoords(locationInput.value);
  console.log(addEventListener);
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
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
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

// const renderSearchHistory = () => {
//   let cityHistory = JSON.parse(localStorage.getItem("cities"));
//   if (!cityHistory) {
//     return;
//   }
//   console.log(cityHistory);
//   for (city of cityHistory) {
//     const button = document.createElement("button");
//     button.textContent = city;
//     button.value = city;
//     button.classList.add("historyButton");
//     //TODO: add city to the button as a value, then use event.target.value to replace city in the string on line 47 below, may need to add a class to these buttons for targeting
//     search_element.appendChild(button);
//   }

//   search_element.addEventListener("click", function (e) {
//     const city = e.target.value;
//     console.log(e.target.value);
//     fetch(
//       `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_key}`
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         const { name, lat, lon } = data[0]; //defines them and passes them down
//         console.log(lat, lon);
//         getWeather(name, lat, lon); //passes down to the function
//       })
//       .catch((error) => {
//         weather.innerHTML = `<p>Error: ${error}</p>`;
//       });
//   });
// };

// const getWeather = (name, lat, lon) => {
//   fetch(
//     `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`
//   )
//     .then((response) => response.json()) //grabs response and turns it into json
//     .then((data) => {
//       const { list, city } = data;
//       const { name } = city; //grabs city info in addition to list.
//       displayWeather(list, name); //gets weather info
//     });
// };

const displayWeather = (weatherData) => {
  // current.innerHTML = "";
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
      const URL = `https://openweathermap.org/img/wn/${element.weather[0].icon}.png`;
      const icon = document.createElement("img");
      icon.src = URL;
      const temperature = document.createElement("div");
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
      cardBody.appendChild(temperature);
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
  for (let i = 0; i < 10; i++) {
    let city = history[i];
    const searchHistory = document.createElement("button");
    searchHistory.addEventListener("click", (event) => {
      getCoords(event.target.innerText);
    });
    searchHistory.innerText = city;
    document.getElementById("search-history").appendChild(searchHistory);
  }
}
