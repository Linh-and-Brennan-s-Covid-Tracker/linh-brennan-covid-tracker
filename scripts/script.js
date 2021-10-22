// Declare a namespace object to store any global scope variables and methods
const myApp = {};

// Add properties to namespace object including the API endpoints
myApp.globalTimeline = "https://corona-api.com/timeline";
myApp.allCountries = "https://corona-api.com/countries";
myApp.countryFlags = "https://www.countryflags.io/";

// Create an object to store the most recent searches by the user
myApp.searchedCountries = [];

// Use Fetch API to get all relevant global data
myApp.getGlobalData = () => {
  const url = new URL(myApp.globalTimeline);
  fetch(url)
    .then((response) => response.json())
    .then((jsonResponse) => myApp.displayGlobalData(jsonResponse.data[0]));
};

// Use Fetch API to all the data of each country
myApp.getCountryData = (countryCode) => {
  const url = new URL(myApp.allCountries);
  fetch(url)
    .then((response) => response.json())
    .then((jsonResponse) => {
      myApp.renderWorldMap(jsonResponse.data);
      myApp.generateDropdown(jsonResponse.data);
      myApp.validateInput(jsonResponse.data, countryCode);
    });
};

// Dynamically render different country options within the dropdown menu
myApp.generateDropdown = (countryData) => {
  const countrySelect = document.querySelector("#country");
  countrySelect.innerHTML = "";
  countryData.sort((a, b) => a.name > b.name);
  const optionElement = document.createElement("option");
  optionElement.textContent = "Please select an option";
  countrySelect.append(optionElement);
  countryData.forEach((country) => {
    const { code, name } = country;
    const optionElement = document.createElement("option");
    optionElement.value = code;
    optionElement.textContent = name;
    optionElement.id = code;
    countrySelect.append(optionElement);
  });
};

//Declare a method to display country Data;
myApp.displayCountryData = (countryData) => {
  const countryList = document.querySelector("#individualCountries");
  const countryStats = ["confirmed", "deaths", "critical", "recovered"];
  countryList.innerHTML = "";
  const countryName = document.createElement("li");
  countryName.innerHTML = `<span class="statisticTitle">Name: </span>
  <span>${countryData[0].name}</span>`;
  countryList.append(countryName);
  const countryPopulation = document.createElement("li");
  countryPopulation.innerHTML = `<span class="statisticTitle">Population: </span>
  <span>${countryData[0].population.toLocaleString()}</span>`;
  countryList.append(countryPopulation);
  for (let i = 0; i < countryStats.length; i++) {
    const listElements = document.createElement("li");
    listElements.innerHTML = `
    <span class="statisticTitle">${countryStats[i]}: </span>
    <span>${countryData[0].latest_data[
      `${countryStats[i]}`
    ].toLocaleString()}</span>`;
    countryList.append(listElements);
  }
  myApp.displaySearchHistory(countryData[0]);
};

//Declare a method to display global Data;
myApp.displayGlobalData = (data) => {
  const globalList = document.querySelector("#globalList");
  const globalInfo = ["active", "confirmed", "date", "deaths"];
  for (let i = 0; i < globalInfo.length; i++) {
    const listElements = document.createElement("li");
    listElements.innerHTML = `
    <span class="statisticTitle">${globalInfo[i]}: </span>
    <span>${data[globalInfo[i]].toLocaleString()}</span>`;
    globalList.append(listElements);
  }
  const lastUpdated = document.querySelector("#lastUpdated");
  const updatedCaption = document.createElement("p");
  updatedCaption.textContent = `Last updated: ${data.updated_at}`;
  lastUpdated.append(updatedCaption);
};

//Declare a method to filter based on user selection
myApp.validateInput = (allCountries, countryCode) => {
  const apiResponse = allCountries.filter(
    (country) => country.code === `${countryCode}`
  );
  if (apiResponse.length > 0) {
    myApp.displayCountryData(apiResponse);
  }
};

//Declare a method to listen for user's change within the dropdown menu
myApp.getUserInput = () => {
  document.querySelector("#country").addEventListener("change", (event) => {
    myApp.getCountryData(event.target.value);
  });
};

// Displays the recent search history and renders the five most recent to the aside element of the page
myApp.displaySearchHistory = (countryData) => {
  const { code, latest_data, name } = countryData;
  const { confirmed } = latest_data;
  const recentQuery = {
    name: name,
    confirmed: confirmed,
  };
  myApp.searchedCountries.unshift(recentQuery);
  const searchHistory = document.querySelector("#searchHistory");
  const liElement = document.createElement("li");
  //<span class="flagContainer"><img src="${
  //myApp.countryFlags
  //}${code}/flat/32.png" alt="the ${name} flag"></span>

  liElement.innerHTML = `<span class="flagContainer">${
    recentQuery.name
  }: ${recentQuery.confirmed.toLocaleString()}</span>`;
  searchHistory.prepend(liElement);
  if (myApp.searchedCountries.length === 6) {
    myApp.searchedCountries.pop();
    const allLiElements = searchHistory.getElementsByTagName("li");
    searchHistory.removeChild(allLiElements[allLiElements.length - 1]);
  }
};

// Courtesy of AnyChart we accessed their library to use a custom world map the user is able to interact with : https://docs.anychart.com/Quick_Start/Quick_Start
myApp.renderWorldMap = (countryData) => {
  const mapContainer = document.querySelector("#container");
  mapContainer.innerHTML = "";
  let data = [];
  for (let i = 0; i < countryData.length; i++) {
    const { code, latest_data } = countryData[i];
    const { confirmed } = latest_data;
    const country = {
      id: code,
      value: confirmed,
    };
    data.push(country);
  }
  let map = anychart.map();
  map.geoData(anychart.maps.world);
  let series = map.choropleth(data);
  series.labels(false);
  map.container("container");
  map.draw();
};

// Declare an initialization method
myApp.init = () => {
  myApp.getGlobalData();
  myApp.getCountryData();
  myApp.getUserInput();
};

// Call the initialization method
myApp.init();
