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
    .then((jsonResponse) => {
      myApp.displayGlobalData(jsonResponse.data[0]);

      //also passed jsonResponse here to receive entire timeline of global data
      myApp.globalChart(jsonResponse.data);
    });
};

// Use Fetch API to all the data of each country

myApp.getCountryData = (countryName) => {
  const url = new URL(myApp.allCountries);
  fetch(url)
    .then((response) => response.json())
    .then((jsonResponse) => {
      const apiResponse = jsonResponse.data.filter(
        (country) => country.name === `${countryName}`
      );
      // Create a conditional statement that will evaluate to true if the user input matches a country from the fetch request response
      if (apiResponse.length) {
        myApp.displayCountryData(apiResponse);
        console.log(apiResponse);
      } else {
        myApp.displayErrors(countryName);
      }
    });
};

//Declare a method to handle errors if user mistyped or there are no data available in the api.
//REMINDER: If userInput include a space, render one error message, else render the current message that we have
myApp.displayErrors = (countryName) => {
  const countryList = document.querySelector("#individualCountries");
  countryList.innerHTML = "";
  const errorMessage = document.createElement("p");
  errorMessage.textContent = `We could not find data on this country, ${countryName}. It appears there are no available data.`;
  countryList.append(errorMessage);
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

    //Clear the text input after the user submitted a search query
    textInput.value = "";
  });
};

myApp.globalChart = (dataInputs) => {
  //create context value followed Chart js documentation and select ID to render Chart to html page
  const ctx = document.getElementById("chart").getContext("2d");
  //create empty array for different labels in graph to be able to get all data points in the API
  const activeCases = [];
  const labels = [];
  const confirmedCases = [];
  const deaths = [];
  const recovered = [];

  //Create a for loop to push all data points to the appropriate array that will be used for line chart later
  for (let i = dataInputs.length - 1; i >= 0; i--) {
    activeCases.push(dataInputs[i].active);
    confirmedCases.push(dataInputs[i].confirmed);
    deaths.push(dataInputs[i].deaths);
    recovered.push(dataInputs[i].recovered);
    labels.push(dataInputs[i].date);
  }
  console.log(labels);

  //Create a line chart using Chartjs documentation (actually just an object with multiple options to format chart: type for the type of chart using, dataSet which consist a key named data to display different array to the appropriate line, the rest of key like data, label, borderColor, options etc are just plugins that provided by Chartjs to style the graph according to your preferences.

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          data: activeCases,
          label: "Active",
          borderColor: "#69B1D6",
          fill: false,
          borderWidth: 2,
          tension: 0.1,
          pointRadius: 0,
        },
        {
          data: confirmedCases,
          label: "Confirmed",
          borderColor: "#EF613A",
          fill: false,
          borderWidth: 2,
          tension: 0.1,
          pointRadius: 0,
        },
        {
          data: deaths,
          label: "Deaths",
          borderColor: "#ff1d3d",
          fill: false,
          borderWidth: 2,
          tension: 0.1,
          pointRadius: 0,
        },
        {
          data: recovered,
          label: "Recovered",
          borderColor: "#5a5fa4",
          fill: false,
          borderWidth: 2,
          tension: 0.1,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: "Global Statistics",
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
          },
        ],
      },
    },
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
