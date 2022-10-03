var today = moment();
$("#moment").text(today.format("MMM Do, YYYY"));

var searchBtn = document.getElementById("btn");

var cityList = [];
var numberOfCity = 9;
var dailyWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var dailyForecastUrl = "https://api.openweathermap.org/data/2.5/onecall?";
var unit = "units=imperial";

var userForm = $("#user-form");

//double check apiKey
var apiKey = "c93eb734109bf395fcdfb7502a3f31f2";

// Click on Search button
$("#btn").on("clicl", function(event) {
    event.preventDefault();
    var cityItem = $("#city").val().trim();
    cityList.push(newCity);
    createCityList();
    setCityList();
    $("#city").val("");
    console.log("city name is " + cityItem);
});

//create city List buttons
function createCityList() {
    $("#city-list").empty();
    cityList.forEach(function(city) {
        $("#city-list").prepend($(`<button class="cityBtn" data-city="${city}">${city}</button>`));
        console.log ($("#city-list"));
    })
};

function setCityList() {
    localStorage.setItem("cities", JSON.stringify(cityList));
};

// click on each city names to show weather;
$("#city-list").on("click", ".cityBtn", showWeather)

function showWeather () {
    var cityWeather = $(this).attr("data-city");
    $("#city-list").empty();
    getWeather(cityWeather, apiKey);
    $(".forecast").empty();
    getForecast(cityWeather, apiKey);
};

// Input and save city names
function getCityList() {
    var inputCities = JSON.parse(localStorage.getItem("cities"));
    console.log(inputCities);
    if (inputCities !== null) {
        cityList = inputCities;
    }
    createCityList();
    if (cityList) {
        var currentCity = cityList[cityList.length -1]
        getWeather(currentCity, apiKey);
        getForecast(currentCity, apiKey);
    }
};
getCityList();

// Get data from API
function getWeather(currentCity) {
    var apiUrl = dailyWeatherUrl + currentCity + "&" + apiKey + "&" + unit;
    fetch(apiUrl)
    .then(function(res) {
        if (res.ok) {
            return res.json()
            .then(function(res) {
                $("#cityname").html(res.name);
                var iconUrl = "http://openweathermap.org/img/wn/" + res.weather[0].icon + "@2x.png";
                $("#weather-icon").attr("src", iconUrl);
                $("#temperature").html(res.main.temp + " \u00B0F");
                $("#humidity").html(res.main.humidity) + " %";
                $("#windspeed").html(res.wind.speed + " MPH");

                var lat = res.coord.lat;
                var lon = res.coord.lon;
                getForecast(lat, lon);
            });
        }
    });
};

function getForecast(lat, lon) {
    var apiUrl = dailyForecastUrl + "lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly" + "&" + apiKey + "&" + unit;
    fetch(apiUrl)
    .then(function (res) {
        return res.json();
    })
    .then(function (res) {
        for (var i = 1; i < 6; i++) {
            
        }
    })
}
