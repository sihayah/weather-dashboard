var searchHeader = $("<h2>").text("Search for a City:").addClass("searchHeader")
var cityInput = $("<input>").addClass("w-100");
var searchBtn= $("<button>").text("Search").addClass("search-btn w-100");
var pastCityBtn = $("<button>").addClass("pastcity-btn w-100").text("cityname");
var sidebarTop= $("<div>").addClass("sidebar-top").append(searchHeader, cityInput, searchBtn);
var sidebar = $("<div>").addClass("column col-4").append(sidebarTop, pastCityBtn)

// fetch city geocoding info
var city = "brooklyn";
var cityApiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="+city+"&key=AIzaSyDM4zn3VakUdAUG3ZTzwqR4eN7lt-ymykw"

fetch(cityApiUrl).then(function(response){
    if(response.ok) {
        response.json().then(function(data){
            console.log(data.items)
        })
    }
})

// fetch current forecast
var lon = (-73)
var lat = 40
var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=alerts,minutely&appid=040415255db151a197c9c6d3e8634198";

var forecastHeader =$("<h2>").text("5-day Forecast:").addClass("forecast-header")

var future = $("<div>").addClass("future");

let days= ["day1", "day2", "day3", "day4", "day5"];

for (var i=0; i<days.length; i++) {
    var dayHeader = $("<h2>").addClass("day-header").text("(date)")
    var dayTemp = $("<li>").text("Temp:")
    var dayWind = $("<li>").text("Wind:")
    var dayHumidity = $("<li>").text("Humidity:")
    var dayUl = $("<ul>").append(dayTemp, dayWind, dayHumidity)
    var day = $("<div>").addClass("card day").append(dayHeader, dayUl)
    $(future).append(day)
}

var conditionsContainer = $("<div>").addClass("flex-column col-8 conditions-container").append(forecastHeader, future);

fetch(weatherApiUrl).then(function(response){
    if(response.ok) {
        response.json().then(function(data) {
            console.log(data.current)
            var temp = (1.8*(data.current.temp -273)+32).toFixed(2)
            var humidity = data.current.humidity
            var wind = data.current.wind_speed
            var uv = data.current.uvi
            var currentTemp = $("<li>").text("Temp: "+temp+"\u00B0"+"F")
            var currentWind = $("<li>").text("Wind: "+wind+" MPH")
            var currentHumidity = $("<li>").text("Humidity: "+humidity+"%")
            var uvSpan = $("<span>").text(uv)
            var currentUv = $("<li>").text("UV Index: ").append(uvSpan)
            if (uv<2.01) {
                $(uvSpan).addClass("uvi-good")
            } else {
                $(uvSpan).addClass("uvi-bad")
            }
            var currentUl = $("<ul>").addClass("current-ul").append(currentTemp, currentWind,currentHumidity, currentUv);
            var icon = $("<span>").addClass("material-icons-outlined")
            if ((data.current.clouds)>50){
                console.log("cloudy")
            }
            var currentHeader = $("<h2>").addClass("current-header").text("city (" +moment().format('L')+")").append(icon)
            var current = $("<div>").addClass("current border-right-0").append(currentHeader).append(currentUl);
           (currentHeader).append(currentUl);
            $(conditionsContainer).prepend(current)
        })
    } else {
        $(current).text("information not available")
    }
})



var headerText = $("<h1>").addClass("headerText").text("Weather Dashboard");
var header = $("header").addClass("header");
$("header").append(headerText);
var row = $("<div>").addClass("row main-container").append(sidebar, conditionsContainer);
$("body").append(row)