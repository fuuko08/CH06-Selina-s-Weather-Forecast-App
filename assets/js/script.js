var today = moment();
$("#moment").text(today.format("MMM Do, YYYY"));

var dailyWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var dailyForecastUrl = "https://api.openweathermap.org/data/2.5/onecall?";

var apiKey = "appid=b619612a6c7ee0713562184c662f0a3e";

// Click on Search button
$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var currentCity = $("#searchCity").val().trim();
    $("#searchCity").val("");
    getWeather(currentCity);
});

$("#searchBtn").keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) {
      getWeather(currentCity);
    }
  });

//Get localstorage 
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
}

//Create the searched City List
for (let i = 0; i < searchHistory.length; i++) {
    createCityList(searchHistory[i]);
}

function createCityList(text) {
    var cityList = $("<li>").addClass("list-group-item").text(text);
    $("#searchHistory").append(cityList);
}

//Click on searched City
$("#searchHistory").on("click", "li", function(event) {
    event.preventDefault();
    getWeather($(this).text());
});

//Click on clear button to clear localstorage
$("#clearBtn").on("click", function() {
    localStorage.clear();
})

//Get data from API
function getWeather(currentCity) {
    var apiUrl = dailyWeatherUrl + currentCity + "&" + apiKey;
    fetch(apiUrl)
    .then(function(res) {
        if (res.ok) {
            return res.json()
            .then(function(res) {
            //save localstorage
                if (searchHistory.indexOf(currentCity) === -1) {
                    searchHistory.push(currentCity);
                    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
                    createCityList(currentCity);
                }
           
                $("#cityname").html(res.name);
                var iconUrl = "http://openweathermap.org/img/wn/" + res.weather[0].icon + "@2x.png";
                $("#weather-icon").attr("src", iconUrl);
                $("#temperature").html("Temperature: " + res.main.temp + " \u00B0F");
                $("#humidity").html("Humidity: " + res.main.humidity) + " %";
                $("#windspeed").html("Windspeed: " + res.wind.speed + " MPH");

                var lat = res.coord.lat;
                var lon = res.coord.lon;
                getForecast(lat, lon);
            });
        }
    });
};

function getForecast(lat, lon) {
    var apiUrl = dailyForecastUrl + "lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly" + "&" + apiKey;
    fetch(apiUrl)
    .then(function (res) {
        return res.json();
    })
    .then(function (res) {
        for (var i = 1; i < 6; i++) {
            var currentDate = res.daily[i].dt;
            var date = moment.unix(currentDate).format("MM/DD/YY");
            $("#date" + i).html(date);
            var weatherIconUrl = "http://openweathermap.org/img/wn/" + res.daily[i].weather[0].icon + "@2x.png";
            $("#iconday" + i).attr("src", weatherIconUrl);
            var temp = res.daily[i].temp.day + " \u00B0F";
            $("#temp" + i).html(temp);
            var humidity = res.daily[i].humidity;
            $("#humidity" + i).html(humidity + " %");
        }
    });
};
