var historyArr = [
  "N-A-1",
  "N-A-2",
  "N-A-3",
  "N-A-4",
  "N-A-5",
  "N-A-6",
  "N-A-7",
];

//check for when button was clicked
$("#form-submit-button").click(function (event) {
  event.preventDefault();
  //Get data in the text field
  var inputText = $("#search-query").val();
  getWeatherData(inputText); // for the day
  getForecastData(inputText); // for 5 days ahead
  updateHistoryList(); //update the search history
});

//make the call to the api and get the data
function getWeatherData(cityName) {
  //build the api call
  var api_key = "7eb0513d724997973529d1ffcad23676";
  var apiCall =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    api_key;
  //make call to the api
  fetch(apiCall).then(function (response) {
    //check if the response is valid
    if (response.ok) {
      response.json().then(function (data) {
        //pass data to data handler
        displayData(data);
      });
    }
  });
}

//get uv data
function getUVData(lon, lat) {
  //build api call
  var api_key = "INSERT KEY";
  var apiCall =
    "http://api.openweathermap.org/data/2.5/uvi?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    api_key;
  fetch(apiCall).then(function (response) {
    response.json().then(function (data) {
      displayUV(data);
    });
  });
}

//display data taken from the fetch
function displayData(data) {
  //replace city placeholder with name
  $("#city").text(
    data.name + "(" + moment.unix(data.dt).format("MM/DD/YYYY") + ")"
  );
  //replace temp
  $("#temp").text("Temperature: " + convertTemp(data.main.temp) + "F");
  //Replace humidity
  $("#humidity").text("Humidity: " + data.main.humidity + "%");
  //replace wind speed
  $("#wind-speed").text("Wind Speed: " + data.wind.speed + "mph");
  //display the weather icon
  $("#city-icon").empty();
  var iconURL =
    "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
  var iconEl = $("<img>");
  iconEl.attr("src", iconURL);
  iconEl.id = "forecast-icon";
  $("#city-icon").append(iconEl);
  //Grab the uv data using lon and lat
  //actual uv data is displauyed in a seperate method as it is async
  getUVData(data.coord.lon, data.coord.lat);
}

// display the UV data
function displayUV(data) {
  $("#uv-index-wrapper p").text("UV Index: "); // The data valuse needs to be moved into the span
  //make the uv index text
  var uvTextEl = $("<p>");
  uvTextEl.text("UV Index: ");
  var indexEl = $("<p>");
  indexEl.text(" " + data.value);
  // change background color based on value
  if (data.value < 3) {
    indexEl.addClass("bg-success");
  } else if (data.value < 7) {
    indexEl.addClass("bg-warning");
  } else {
    indexEl.addClass("bg-danger");
  }
  $("#uv-index-wrapper").empty();
  $("#uv-index-wrapper").append(uvTextEl);
  $("#uv-index-wrapper").append(indexEl);
}

//convert kelvin to farenheight
function convertTemp(temp) {
  return (temp * 1.8 - 459.67).toFixed(2);
}

//get the 5 day forecast
function getForecastData(cityName) {
  //build the api call
  var api_key = "7eb0513d724997973529d1ffcad23676";
  var apiCall =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=" +
    api_key;
  //make call to the api
  fetch(apiCall).then(function (response) {
    //check if the response is valid
    if (response.ok) {
      response.json().then(function (data) {
        //pass data to data handler
        forecastHandler(data);
      });
    }
  });
}

//deal with data and pass needed info to cardgen
function forecastHandler(data) {
  // Add the 5day forecast text  <h3 class="h3">5-Day Forecast</h3>
  var fiveDayEl = $("<h3>");
  fiveDayEl.addClass("h3");
  fiveDayEl.text("5-Day Forecast");
  $("#five-day-forecast-text").empty();
  $("#five-day-forecast-text").append(fiveDayEl);
  // every 8th one is a new day
  var cardId = 1;
  //clear last items
  $("#five-day-forecast").text("");
  for (var i = 0; i < 40; i += 8) {
    generateCard(data.list[i + 4], cardId);
    cardId++;
  }
}

//Cards will be dynamically generated
function generateCard(data, cardId) {
  //make column
  var colEl = $("<div>");
  colEl.addClass("col-sm-2");
  //make card holder
  var cardEl = $("<div>");
  cardEl.addClass("card bg-primary");
  //create the text content
  var h5El = $("<h5>");
  h5El.addClass("card-title text-white");
  h5El.text(moment.unix(data.dt).format("MM/DD/YYYY")); //convert unix time to date
  // add the icon
  var iconURL =
    "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
  var iconEl = $("<img>");
  iconEl.attr("src", iconURL);
  iconEl.addClass("forecast-icon");
  iconEl.id = "forecast-icon";
  // make all inner text
  var p2El = $("<p>");
  p2El.addClass("text-white");
  p2El.text("Temp: " + convertTemp(data.main.temp) + "F");
  // make all inner text
  var p3El = $("<p>");
  p3El.addClass("text-white");
  p3El.text("Humidity: " + data.main.humidity + "%");
  //append all into card
  cardEl.append(h5El);
  cardEl.append(iconEl);
  cardEl.append(p2El);
  cardEl.append(p3El);
  //Add card to div
  colEl.append(cardEl);
  //Append div to page
  $("#five-day-forecast").append(colEl);
}

function saveHistory() {
  if (!localStorage.getItem("history")) {
    //convert the array to json
    var arrayHolder = {
      history: historyArr,
    };
    var jsonArray = JSON.stringify(arrayHolder);
    //put the JSON into the localstorage
    localStorage.setItem("history", jsonArray); // this puts the json string into the local storage
  } else {
    var pastArrJson = localStorage.getItem("history"); //get back json string
    var pastArr = JSON.parse(pastArrJson);
    for (var i = 0; i < pastArr.history.length; i++) {
      if (pastArr.history[i] !== historyArr[i]) {
        //if they are different
        pastArr.history[i] = historyArr[i]; // replace with new data
      }
    }
    //put back into object
    var arrayHolder = {
      history: pastArr.history,
    };
    localStorage.setItem("history", JSON.stringify(arrayHolder)); // put changed array back into
  }
}

function loadHistory() {
  //Grab json string
  historyArrJson = localStorage.getItem("history");
  //parse json string
  parsedHistory = JSON.parse(historyArrJson);

  for (var i = 0; i < 7; i++) {
    //change to 8
    var currentSlot = "#history-" + (i + 1);
    var slotText = $(currentSlot).text();
    if (parsedHistory.history[i] === slotText) {
    } else {
      //replace if its different
      $(currentSlot).text(parsedHistory.history[i]);
      historyArr[i] = parsedHistory.history[i];
    }
  }
  //save the history after loading
  saveHistory();
}

//update history
function updateHistoryList() {
  //go through and move all list items down by one
  historyArr[6] = historyArr[5];
  historyArr[5] = historyArr[4];
  historyArr[4] = historyArr[3];
  historyArr[3] = historyArr[2];
  historyArr[2] = historyArr[1];
  historyArr[1] = historyArr[0];
  historyArr[0] = $("#search-query").val();
  saveHistory();
  loadHistory();
}

//Handle the history clicks
$("#history-group").on("click", "li", function () {
  //determine which item was clicked
  var clickedItem = $(this).text().trim();
  //actually search for the items
  getWeatherData(clickedItem); // for the day
  getForecastData(clickedItem); // for 5 days ahead
  //put the text into the search bar
  $("#search-query").val(clickedItem);
  updateHistoryList(); //update the search history
});
loadHistory();
