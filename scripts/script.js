// Declare a namespace object to store any global scope variables and methods
const myApp = {};

// Add properties to namespace object including the API endpoints
myApp.globalTimeline = "https://corona-api.com/timeline";

// Use Fetch API to get all relevant global data
myApp.getGlobalData = () => {
  const url = new URL(myApp.globalTimeline);
  fetch(url)
    .then((response) => response.json())
    .then((jsonResponse) => myApp.displayGlobalData(jsonResponse.data[0]));
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

// Declare an initialization method
myApp.init = () => {
  // Call the getData method
  myApp.getGlobalData();
};

// Call the initialization method
myApp.init();
