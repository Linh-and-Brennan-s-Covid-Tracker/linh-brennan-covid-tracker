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
      // Pass the fetch request data into the renderWorldMap method
      myApp.renderWorldMap(jsonResponse.data);
      //generate dropdown options based on loading the entire API data
      myApp.generateDropdown(jsonResponse.data);
      //pass the entire API data to validateInput to filter data based on country selected by the user
      myApp.validateInput(jsonResponse.data, countryCode);
    });
};

// Dynamically render different country options within the dropdown menu
myApp.generateDropdown = (countryData) => {
  // Store a reference to the select element
  const countrySelect = document.querySelector("#country");
  // Sort the country data retrieved by the fetch request by country name or alphabetical order
  countryData.sort((a, b) => a.name > b.name);
  // Create option elements for each index of the countryData array
  countryData.forEach((country) => {
    // Destructure each object in the array to access the country name and code
    const { code, name } = country;
    // Create each option element
    const optionElement = document.createElement("option");
    // Attach the destructured variables
    optionElement.value = code;
    optionElement.textContent = name;
    optionElement.id = code;
    // Append each option element to the select element
    countrySelect.append(optionElement);
  });
};

//Declare a method to display country Data;
myApp.displayCountryData = (countryData) => {
  //Store reference for the unordered list
  const countryList = document.querySelector("#individualCountries");
  //Create an array of the object properties that we will be accessing
  const countryStats = ["confirmed", "deaths", "critical", "recovered"];
  //Clear unordered list every time the method is called to prevent duplication;
  countryList.innerHTML = "";

  //Manually added 2 additional li elements
  const countryName = document.createElement("li");
  countryName.innerHTML = `<span class="statisticTitle">Name: </span>
  <span>${countryData[0].name}</span>`;
  countryList.append(countryName);

  const countryPopulation = document.createElement("li");
  countryPopulation.innerHTML = `<span class="statisticTitle">Population: </span>
    <span>${countryData[0].population.toLocaleString()}</span>`;
  countryList.append(countryPopulation);

  //Create a for loop to render li elements.
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
  //Display global API to the HTML page
  const globalList = document.querySelector("#globalList");
  //Create an local array of specific relevant properties and use them to access the properties value of the data object
  const globalInfo = ["active", "confirmed", "date", "deaths"];
  for (let i = 0; i < globalInfo.length; i++) {
    //Create li element to display active properties, confirmed case, date, deaths, updated_at
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
  // Create an if statement to display data only when user selects option
  if (apiResponse.length > 0) {
    //Pass the selected code to display user selection accordingly
    myApp.displayCountryData(apiResponse);
  }
};

//Declare a method to listen for user's change within the dropdown menu
myApp.getUserInput = () => {
  document.querySelector("#country").addEventListener("change", (event) => {
    //get the country code from user's selection from dropdown menu to pass in getCountryData function
    myApp.getCountryData(event.target.value);
  });
};

myApp.displaySearchHistory = (countryData) => {
  // Access the specific data from each country object that needs to be displayed, save reference to the values obtained by destructing the object
  const { code, latest_data, name } = countryData;
  const { confirmed } = latest_data;
  // Store the data into a new object and push that to the country list array
  const recentQuery = {
    name: name,
    confirmed: confirmed,
  };
  // Update the unordered list element with the most recent search
  myApp.searchedCountries.unshift(recentQuery);
  // Store reference to the element that will render the user's search history
  const searchHistory = document.querySelector("#searchHistory");
  // Create an li element to store the information from the recent query object
  const liElement = document.createElement("li");
  // Update the li element content with the data from the array and request a flag image from the country flag api
  liElement.innerHTML = `<span class="flagContainer"><img src="${
    myApp.countryFlags
  }${code}/flat/32.png" alt="the ${name} flag"></span><span>${
    recentQuery.name
  }: ${recentQuery.confirmed.toLocaleString()}</span>`;
  searchHistory.prepend(liElement);
  // Limit the number of items that are displayed for the user, if the length exceeds 5 remove the oldest query
  if (myApp.searchedCountries.length === 6) {
    // Remove the oldest search query from the array stored within the namespace object
    myApp.searchedCountries.pop();
    // Store references for all of the li elements in the search history unordered list
    const allLiElements = searchHistory.getElementsByTagName("li");
    // Remove the oldest search query the page
    searchHistory.removeChild(allLiElements[allLiElements.length - 1]);
  }
};

// Courtesy of AnyChart we accessed their library to use a custom world map the user is able to interact with : https://docs.anychart.com/Quick_Start/Quick_Start
myApp.renderWorldMap = countryData => {
  // Store a reference to the div container for the world map in a variable
  const mapContainer = document.querySelector("#container");
  // Clear the inner HTML to prevent duplicating the world map whenever a new country is selected by the user
  mapContainer.innerHTML = "";
  // Create an empty array to store an object with information from each country return by the fetch request
  let data = [];
  // Loop through the country data and specifically push the country code and confirmed cases values to the empty array
  for (let i = 0; i < countryData.length; i++) {
    // Destructure the data to access specific data
    const { code, latest_data } = countryData[i];
    const { confirmed } = latest_data; 
    // Create a country object that stores the destructured data
    const country = {
      "id": code, "value": confirmed
    }
    // Push each object into the empty array created earlier in the method
    data.push(country);
  }
  
  // Generate from library
  let map = anychart.map();
  map.geoData(anychart.maps.world);
  
  // set the series
  let series = map.choropleth(data);
  
  // disable labels
  series.labels(false);
  
  // set the container
  map.container('container');
  map.draw();
}

// Declare an initialization method
myApp.init = () => {
  // Call the getData method
  myApp.getGlobalData();
  myApp.getCountryData();
  myApp.getUserInput();
};

// Call the initialization method
myApp.init();
