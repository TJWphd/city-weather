const locationInput = document.getElementById("input");
const search = document.getElementById("searchButton");
const weather = document.getElementById("weather");
const API_key = "09e9ace5d5bf69cfa6ecf2329111b073";
const current = document.getElementById("current");
const search_element = document.getElementById("search-history");

search.addEventListener("click", function (event) {
  console.log(API_key);
  savedSearchHistory(locationInput.value);
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${locationInput.value}&appid=${API_key}`
  )
    .then((response) => response.json())
    .then((data) => {
      const { name, lat, lon } = data[0]; //defines them and passes them down
      console.log(lat, lon);
      getWeather(name, lat, lon); //passes down to the function
    })
    .catch((error) => {
      weather.innerHTML = `<p>Error: ${error}</p>`;
    });
});

const savedSearchHistory = (city) => {
  let cityHistory = JSON.parse(localStorage.getItem("cities"));
  if (!cityHistory) {
    cityHistory = [];
  }
  cityHistory.push(city);
  localStorage.setItem("cities", JSON.stringify(cityHistory));
};

const renderSearchHistory = () => {
  let cityHistory = JSON.parse(localStorage.getItem("cities"));
  if (!cityHistory) {
    return;
  }
  console.log(cityHistory);
  for (city of cityHistory) {
    const button = document.createElement("button");
    button.textContent = city;
    button.value = city;
    button.classList.add("historyButton");
    console.log(city);
    //TODO: add city to the button as a value, then use event.target.value to replace city in the string on line 47 below, may need to add a class to these buttons for targeting
    search_element.appendChild(button);
  }

  search_element.addEventListener("click", function (e) {
    const city = e.target.value;
    console.log(e.target.value);
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_key}`
    )
      .then((response) => response.json())
      .then((data) => {
        const { name, lat, lon } = data[0]; //defines them and passes them down
        console.log(lat, lon);
        getWeather(name, lat, lon); //passes down to the function
      })
      .catch((error) => {
        weather.innerHTML = `<p>Error: ${error}</p>`;
      });
  });
};

const getWeather = (name, lat, lon) => {
  fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`
  )
    .then((response) => response.json()) //grabs response and turns it into json
    .then((data) => {
      const { list, city } = data;
      const { name } = city; //grabs city info in addition to list.
      displayWeather(list, name); //gets weather info
    });
};

const displayWeather = (weatherData, city) => {
  current.innerHTML = "";
  weatherData.forEach((element, index) => {
    //an array. going through each item in array. element is the current item we are looking at. index is where we track it.
    if (index % 8 === 0) {
      const weatherCard = document.createElement("div");
      weatherCard.classList.add("col");
      const cardBody = document.createElement("div");
      cardBody.classList.add("card", "border-0", "bg-secondary", "text-white");
      weatherCard.appendChild(cardBody);
      const cityName = document.createElement("h2"); //variables
      const date = document.createElement("h3");
      const conditions = document.createElement("h4");
      const temperature = document.createElement("h5");
      temperature.classList.add("temperature"); // how to add to css
      const humidity = document.createElement("h6");
      const windSpeed = document.createElement("h7");
      cityName.textContent = city;
      date.textContent = new Date(element.dt * 1000); //converting number into a date
      conditions.textContent = element.weather[0].main;
      temperature.textContent = element.main.temp;
      humidity.textContent = element.main.humidity;
      windSpeed.textContent = element.wind.speed;

      cardBody.appendChild(cityName);
      cardBody.appendChild(date);
      cardBody.appendChild(conditions);
      cardBody.appendChild(temperature);
      cardBody.appendChild(humidity);
      cardBody.appendChild(windSpeed);
      current.appendChild(weatherCard);
    }
  });
};

renderSearchHistory();
