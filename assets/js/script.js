//check for when button was clicked 
$("#form-submit-button").click(function(event){
    event.preventDefault();
    //Get data in the text field
    var inputText = $("#search-query").val();
    getWeatherData(inputText);
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
function getUVData(cityName){
    //build api call
    var api_key = "7eb0513d724997973529d1ffcad23676";
    var apiCall = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+api_key;
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

}
function displayUV(data){

}
//convert kelvin to farenheight
function convertTemp(temp){
    return (temp * 1.8) - 459.67; 
}