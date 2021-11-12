var searchHeader = $("<h2>").text("Search for a City:").addClass("searchHeader")
var cityInput = $("<input>").attr("type", "text").addClass("w-100");
var searchBtn= $("<button>").text("Search").attr("type", "submit").addClass("search-btn w-100");
var sidebarTop= $("<div>").addClass("sidebar-top").append(searchHeader, cityInput, searchBtn);
var sidebarBottom= $("<div>")
var sidebar = $("<div>").addClass("column col-4 sidebar").append(sidebarTop).append(sidebarBottom)
let days= [1, 2, 3, 4, 5];
let myCity = "Jakarta"
let city
let cities = []

    // for each day in forecast create a card listing date and weather info
generateForecast = (data) => {
    for (var i=0; i<days.length; i++) {
        var dayIcon = $("<i>").addClass("day-icon")
        var dayWeather = data.daily[i].weather[0].main
        updateIcons(dayIcon, dayWeather)
        var kelvinTemp = data.daily[i].temp.day
        var tempDaily = (1.8*(kelvinTemp -273)+32).toFixed(2)
        var windDaily = data.daily[i].wind_speed
        var humidityDaily = data.daily[i].humidity
        var dayHeader = $("<h2>").addClass("day-header").text("(" +moment().add(i+1, 'days').format('L')+")")
        var dayTemp = $("<li>").text("Temp: "+tempDaily+"\u00B0"+"F")
        var dayWind = $("<li>").text("Wind: "+windDaily+" MPH")
        var dayHumidity = $("<li>").text("Humidity: "+humidityDaily+"%")
        var dayUl = $("<ul>").addClass("day-ul").append(dayTemp, dayWind, dayHumidity)
        var day = $("<div>").addClass("card day").append(dayHeader, dayIcon, dayUl)
        $(future).append(day)
    }
}
// fetch city to get lat and lon
findForecast = (city) => {
    var cityApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid=040415255db151a197c9c6d3e8634198"
    fetch(cityApiUrl).then(function(response){
        if(response.ok) {
            response.json().then(function(data){
                var lat = (data[0].lat)
                var lon = (data[0].lon)

                // fetch current forecast
                var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=alerts,minutely&appid=040415255db151a197c9c6d3e8634198";
            
                fetch(weatherApiUrl).then(function(response){
                if(response.ok) {
                    response.json().then(function(data) {
                        generateCurrentDay(data, city)
                        generateForecast(data)
                    })
                } else {
                    $(conditionsContainer).text("information not available")
                }
            })
            })
        }
    })
}

// after a city has been searched generate a corresponding button
generatePastSearchBtn = (city) => {
    var pastCityBtn = $("<button>").addClass("pastcity-btn w-100").attr("type", "click").text(city);
    $(sidebarBottom).prepend(pastCityBtn)
    $(pastCityBtn).on("click", function (event){
        pastButtonSubmitHandler(city)
    })    
}

// get search history form local storage, parese, and set equal to cities arr
searchHistory = JSON.parse(localStorage.getItem("searchHistory"))
if (searchHistory){
    cities= searchHistory
    for (var i=0; i<cities.length; i++){
        var oldCity = cities[i]
        generatePastSearchBtn(oldCity)
    }
}


findForecast(myCity)

var forecastHeader =$("<h2>").text("5-day Forecast:").addClass("forecast-header")
var future = $("<div>").addClass("future");
var currentContainer = $("<div>")
var conditionsContainer = $("<div>").addClass("flex-column col-8 conditions-container").append(currentContainer, forecastHeader, future);
var headerText = $("<h1>").addClass("headerText").text("Weather Dashboard");
var header = $("header").addClass("header");
$("header").append(headerText);
var row = $("<div>").addClass("row main-container").append(sidebar, conditionsContainer);
$("body").append(row)

// update icons according current or expected weather conditons
updateIcons = (icon, weather) => {


    if (weather=== "Clouds") {
        $(icon).html("<img src=http://openweathermap.org/img/w/03d.png>")
    } else if (weather=== "Rain") {
        $(icon).html("<img src=http://openweathermap.org/img/w/10d.png>")
    } else if (weather=== "Snow") {
        $(icon).html("<img src=http://openweathermap.org/img/w/13d.png>")
    } else if (weather=== "Drizzle") {
        $(icon).html("<img src=http://openweathermap.org/img/w/09d.png>")
    } else if (weather=== "Thunderstorm") {
        $(icon).html("<img src=http://openweathermap.org/img/w/11d.png>")
    } else if (weather=== "Clear") {
        $(icon).html("<img src=http://openweathermap.org/img/w/01d.png>")
    } else {
        $(icon).html("<img src=http://openweathermap.org/img/w/50d.png>")
    }
}

// generate div holding city name, date, and weather conditons for current day
generateCurrentDay = (data, city) => {
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
    var icon = $("<i>")
    var weather= data.current.weather[0].main
    updateIcons(icon, weather)
    var currentHeader = $("<h2>").addClass("current-header").text(city + " (" +moment().format('L')+") ").append(icon)
   var currentDiv = $("<div>").addClass("current border-right-0").append(currentHeader, currentUl)
    $(currentContainer).prepend(currentDiv)
    // debugger;
    $(searchBtn).on("click", function (event){
        buttonSubmitHandler(currentDiv)
        
    })
}


// on button click replace current conditons for previous city with current conditon for new city
//set new city input to local storage and call generatePastSearchBtn()
buttonSubmitHandler = (city) => {
        if(city){console.log(city)}
      var newCity = cityInput[0].value
      if (newCity) {
        // setCity(city)  
        $(currentContainer).html("")  
        $(future).html("")
        findForecast(newCity);
        generatePastSearchBtn(newCity)
        cities.push(newCity)
        console.log(cities)
        localStorage.setItem("searchHistory", JSON.stringify(cities))
        cityInput[0].value = "";
    }
}
pastButtonSubmitHandler = (city) => {
  var newCity = city
  if (newCity) {
    // setCity(city)  
    $(currentContainer).html("")  
    $(future).html("")
    findForecast(newCity);
}
}