// Declare a namespace object to store any global scope variables and methods
const myApp = {};

// Add properties to namespace object including the API endpoints
myApp.globalTimeline = "https://corona-api.com/timeline";
myApp.allCountries = "https://corona-api.com/countries";

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

// Attach an event listener to the button that takes the Country code value from the option selected by the user
// Make a fetch request with the selected country code
//

//Declare a method to filter based on user selection
myApp.validateInput = (allCountries, countryCode) => {
  const apiResponse = allCountries.filter(
    (country) => country.code === `${countryCode}`
  );
  //Pass the selected code to display user selection accordingly
  myApp.displayCountryData(apiResponse);
};

//Declare a method to listen for user's change within the dropdown menu
myApp.getUserInput = () => {
  document.querySelector("#country").addEventListener("change", (event) => {
    //get the country code from user's selection from dropdown menu to pass in getCountryData function
    myApp.getCountryData(event.target.value);
  });
};

// Declare an initialization method
myApp.init = () => {
  // Call the getData method
  myApp.getGlobalData();
  myApp.getCountryData();
  myApp.getUserInput();
};

// Call the initialization method
myApp.init();
