// Declare a namespace object to store any global scope variables and methods
const myApp = {};

// Add properties to namespace object including the API endpoints
myApp.globalTimeline = "https://corona-api.com/timeline";

// Use Fetch API to get all relevant global data
myApp.getData = () => {
    const url = new URL(myApp.globalTimeline)
    fetch(url)
        .then(response => response.json())
        .then(jsonResponse => jsonResponse.data[0]);
}

// Declare an initialization method
myApp.init = () => {

    // Call the getData method 
    myApp.getData();
}

// Call the initialization method
myApp.init();