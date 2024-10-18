 // BORROWED CODE from art's group STARTS HERE 
 // NEED TO CHANGE TO A CURRENT-WEATHER CALL FOR TOP CARD, A 5-DAY FORECAST CALL FOR BOTTOM CARDS
function inputCCs() {
    make a loop for the city and country until it is filled correctly
    const inputCityEl = document.getElementById("cityInput");
    const inputCountryEl = document.getElementById("countryInput");
    // Figure out how to get the inputs before the loop below
    const city_one = inputCityEl.value;
    const country_one = inputCountryEl.value;
    // Need to get both inputs before starting the loop or it will break
    console.log(city_one);
    console.log(country_one);
    getWeather(city_one, country_one);
  }
  // Getting parameters for the city and country
  function getWeather(city, country) {
    // fetch request gets a list of all the repos for the node.js organization
    const requestUrlGeocode = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=09e9ace5d5bf69cfa6ecf2329111b073`;
    // Fetch for first response
    fetch(requestUrlGeocode)
      .then(function (response) {
        return response.json();
      })
      // Function response after getting data, data only available inside the function
      .then(function (data) {
        console.log("result: " + data[0]);
        // if statement for data
        if (data[0]) {
          const resultObj = data[0];
          let lat = resultObj.lat;
          let long = resultObj.lon;
          // Getting coordinates of the city/country stated in the parameter in the first fetch function
          const requestUrlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=09e9ace5d5bf69cfa6ecf2329111b073`;
          // Fetching geocode from location now (from the weather)
          fetch(requestUrlWeather)
            .then(function (response) {
              return response.json();
            })
            // Looking to change from Current Weather to 5 day weather api(?) - future dev
            .then(function (weatherdata) {
              console.log(weatherdata.weather[0]);
              // "Decorative" part
              const weatherObj = weatherdata.weather[0];
              const iconWeather = document.createElement("img");
              iconWeather.setAttribute(
                "src",
                `https://openweathermap.org/img/wn/${weatherObj.icon}@2x.png`
              );
              weatherResultEl.appendChild(iconWeather);
              // // Icon for city
              // const iconCity = document.createElement("img");
              // iconCity.setAttribute("src", "./assets/images/weather2.jpg");
              // weatherCityEl.appendChild(iconCity);
            });
        } else {
          showError("That location was not found. Try again");
        }
      });
  }
//   BORROWED CODE ENDS HERE 