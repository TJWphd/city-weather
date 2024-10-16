const locationInput = document.getElementById("input");
const search = document.getElementById("searchButton");
const weather = document.getElementById("weather");
const API_key = "09e9ace5d5bf69cfa6ecf2329111b073";
const current = document.getElementById("current");

// a function that runs first and saves the city that was prev. typed in LS.
// & puts a button on the page with the name of the city.
// button is same pattern for putting weather

// adapted code from class mini-project 06-01-27:
const formElementSearch = document.querySelector("#search-form");

function handleSearchFormSubmit(event) {
  formEl.addEventListener("submit", function (event) {
    event.preventDefault();
    const inputValueSearch = document.getElementById("#search-input").value;
    if (!inputValueSearch) {
      console.error("You need a search input value!");
      return;
    }
    const queryString = `./search-results.html?q=${inputValueSearch}`;
    location.assign(queryString);
  });

  // formElementSearch.addEventListener("search", handleSearchFormSubmit);
  // adapted code ends here

  search.addEventListener("search", function (event) {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${locationInput.value}&appid=${API_key}`
    )
      .then((response) => response.json())
      .then((data) => {
        const { name, lat, lon } = data[0]; //defind them and passing them down
        console.log(lat, lon);
        getWeather(name, lat, lon); //passing down to the function
      })
      .catch((error) => {
        weather.innerHTML = `<p>Error: ${error}</p>`;
      });
  });
  const getWeather = (name, lat, lon) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`
    )
      .then((response) => response.json()) //grabbing response and turing it into json
      .then((data) => {
        const { list, city } = data;
        const { name } = city; //grabbed city info in addition to list.
        displayWeather(list, name); //got weather info
      });
  };
  const displayWeather = (weatherData, city) => {
    //passed weather info into here
    weatherData.forEach((element, index) => {
      //an array. going through each item in array. element is the current item we are looking at. index is where we track it.
      if (index % 8 === 0) {
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
        // current.appendChild(cityName);
        current.appendChild(date);
        current.appendChild(conditions);
        current.appendChild(temperature);
        current.appendChild(humidity);
        current.appendChild(windSpeed);
      }
    });
  };
}
