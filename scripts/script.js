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
//console.log(jsonResponse.data.filter(item => item.code === "AF"))

myApp.getCountryData = (countryName) => {
  const url = new URL(myApp.allCountries);
  fetch(url)
    .then((response) => response.json())
    .then((jsonResponse) => {
      const apiResponse = jsonResponse.data.filter((country) => country.name === `${countryName}`);
      // Create a conditional statement that will evaluate to true if the user input matches a country from the fetch request response
      if (apiResponse.length) {
        myApp.displayCountryData(apiResponse) 
        console.log(apiResponse);
      } else {
        myApp.displayErrors(countryName)
      }

      }
    );
};

myApp.displayErrors = (countryName) => {
  const countryList = document.querySelector("#individualCountries");
  countryList.innerHTML = "";
  const errorMessage = document.createElement("p");
  errorMessage.textContent = `We could not find data on this country, ${countryName}. It appears there are no available data.`;
  countryList.append(errorMessage);
};

myApp.displayCountryData = (countryData) => {
  const countryList = document.querySelector("#individualCountries");
  const countryStats = ["confirmed", "deaths", "critical", "recovered"];
  const countryInfo = ["name", "population"];

  countryList.innerHTML = "";

  for (let i = 0; i < countryStats.length; i++) {
    const listElements = document.createElement("li");
    listElements.append(
      `${countryStats[i]} : ${countryData[0].latest_data[`${countryStats[i]}`]}`
    );
    countryList.append(listElements);
  }
  
  for (let i = 0; i < countryInfo.length; i++) {
    const listElements = document.createElement("li");
    console.log(countryData[0].name);
    listElements.append(
      `${countryInfo[i]} : ${countryData[0]}.${countryInfo[i]}`
    )
    countryList.append(listElements);
  }
};

myApp.formatInput = (userInput) => {
  // Store reference to the country the user is attempting to make an query for and make it lowercase
  let countryName = userInput.toLowerCase();

  // Store a reference of the first character of the coutry's name and convert it to upper case
  const firstCharacter = countryName.charAt(0).toUpperCase();

  // Remove the duplicate first character from the coutry name variable
  countryName = countryName.slice(1);

  // Concatenate the first character and country name variables
  const finalFormat = firstCharacter + countryName;

  // Return the user input with an update format
  return finalFormat;
};

//Display global API to the HTML page
//Create li element to display active properties, confirmed case, date, deaths, updated_at
//Create li for each one of this property
//Create an local array of specific relevant properties and use them to access the properties value of the data object

myApp.displayGlobalData = (data) => {
  const globalList = document.querySelector("#globalList");
  const globalInfo = ["active", "confirmed", "date", "deaths", "updated_at"];
  for (let i = 0; i < globalInfo.length; i++) {
    //create list elements
    const listElements = document.createElement("li");
    listElements.append(`${globalInfo[i]} : ${data[globalInfo[i]]}`);
    globalList.append(listElements);
  }
};

// Declare a method for getting, storing, and using the user's input
myApp.getUserInput = () => {
  // Store the form element in a variable
  const formElement = document.querySelector("form");

  // Attach an event listener to the form element that will react to a submit event
  formElement.addEventListener("submit", (event) => {
    event.preventDefault();

    // Store a reference to the text input element
    const textInput = document.querySelector("#userSearch");

    // In order to access the user input we store reference to their query in a variable
    const userInput = textInput.value;

    // Format user input to reflect the naming convention of the API data, to do this we pass it the userInput variable
    const countryName = myApp.formatInput(userInput);

    // Make a fetch request to the API
    myApp.getCountryData(countryName);
    textInput.value = "";
    // Pass the user input into getCountryData
    // Pass the user's search query to the API when making a call with the fetch API
    // Filter the results down to a specific country, using the filter method on the data returned by the API
    // Error handling message if the country does not exist in the list or mistype in userInput
    // Render the results onto the page
  });
};

// Declare an initialization method
myApp.init = () => {
  // Call the getData method
  myApp.getGlobalData();
  myApp.getUserInput();
};

// Call the initialization method
myApp.init();
