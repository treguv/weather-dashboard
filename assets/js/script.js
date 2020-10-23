//check for when button was clicked 
$("#form-submit-button").click(function(event){
    event.preventDefault();
    //Get data in the text field
    var inputText = $("#search-query").val();
    getWeatherData(inputText); // for the day
    getForecastData(inputText); // for 5 days ahead
    //Now we have the city we need to make the actual api call
});

//make the call to the api and get the data
function getWeatherData(cityName){
    //build the api call
    var api_key = "7eb0513d724997973529d1ffcad23676";
    var apiCall = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+api_key;
    //make call to the api
    fetch(apiCall).then(function(response){
        //check if the response is valid
        if(response.ok){
            response.json().then(function(data){
                //pass data to data handler
                displayData(data);
            });
        }
    });
}
//get uv data
function getUVData(lon,lat){
    //build api call
    var api_key = "7eb0513d724997973529d1ffcad23676";
    var apiCall = "http://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid="+api_key;
    fetch(apiCall).then(function(response){
        response.json().then(function(data){
            // console.log("Returning Data");
            displayUV(data);
        })
    });
}
//display data taken from the fetch
function displayData(data){
    //replace city placeholder with name
    $("#city").text(data.name);
    //replace temp
    $("#temp").text("Temperature: " + convertTemp(data.main.temp));
    //Replace humidity
    $("#humidity").text("Humidity: " + data.main.humidity + "%");
    //replace wind speed
    $("#wind-speed").text("Wind Speed: " + data.wind.speed + "mph");
    //display the weather icon
    var iconURL = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    $("#wicon").attr("src",iconURL );
    //Grab the uv data using lon and lat
    //actual uv data is displauyed in a seperate method as it is async
    getUVData(data.coord.lon, data.coord.lat);
}
function displayUV(data){
    $("#uv-index").text("UV Index: " + data.value); // The data valuse needs to be moved into the span
    // $("#uv-wrapper").text("" + data.value);
    // console.log($("#uv-index .uv-wrapper").text());
    // console.log(data.value);
}
//convert kelvin to farenheight
function convertTemp(temp){
    return (temp * 1.8) - 459.67; 
}
//get the 5 day forecast
function getForecastData(cityName){
    //build the api call
    var api_key = "7eb0513d724997973529d1ffcad23676";
    var apiCall = "https://api.openweathermap.org/data/2.5/forecast?q="+cityName+"&appid="+api_key;
    //make call to the api
    fetch(apiCall).then(function(response){
        //check if the response is valid
        if(response.ok){
            response.json().then(function(data){
                //pass data to data handler
                forecastHandler(data);
            });
        }
    });
}
//deal with data and pass needed info to cardgen
function forecastHandler(data){
    // every 8th one is a new day
    var cardId = 1;
    for(var i = 0; i < 40; i+=8){
        console.log(i);
        generateCard(data.list[i], cardId);
        cardId++;
    }
}
//Cards will be dynamically generated
function generateCard(data, cardId){
    //make column
    var colEl = $("<div>");
    colEl.addClass("col-sm-3");
    //make card holder 
    var cardEl = $("<div>");
    cardEl.addClass("card bg-primary");
    console.log(colEl);
    //create the text content
    var h5El = $("<h5>");
    h5El.addClass("card-title text-white");
    h5El.text("Date");
    // make all inner text
    var p1El = $("<p>");
    p1El.addClass("text-white");
     // make all inner text
     var p2El = $("<p>");
     p2El.addClass("text-white");
      // make all inner text
    var p3El = $("<p>");
    p3El.addClass("text-white");

    //append all into card
    cardEl.append(h5El);
    cardEl.append(p1El);
    cardEl.append(p2El);
    cardEl.append(p3El);
    //Add card to div
    colEl.append(cardEl);
    console.log($("#history-1"));
    //Append div to page
    $("#five-day-forecast").append(colEl);
}
// div class = "col-sm-3"> 
//                         <div class = "card bg-primary">
//                             <div class ="card-body">
//                                 <h5 class="card-title text-white">1/23/2020</h5>
//                                 <p class= "text-white">Icon goes here</p>
//                                 <p class= "text-white">Temp: NA</p>
//                                 <p class= "text-white">Humidity: NA</p>

//                             </div>
//                         </div>  
//                     </div>