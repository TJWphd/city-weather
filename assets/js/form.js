// borrowed code from class mini-project 06-01-27
const formElementSearch = document.querySelector("#search-form");

function handleSearchFormSubmit(event) {
  event.preventDefault();

  const inputValueSearch = document.querySelector("#search-input").value;
  const inputValueFormat = document.querySelector("#format-input").value;

  if (!inputValueSearch) {
    console.error("You need a search input value!");
    return;
  }

  const queryString = `./search-results.html?q=${inputValueSearch}&format=${inputValueFormat}`;

  location.assign(queryString);
}

formElementSearch.addEventListener("submit", handleSearchFormSubmit);
// borrowed code ends here
