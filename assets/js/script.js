var today = moment();
$("#moment").text(today.format("MMM Do, YYYY"));

var searchBtn = document.getElementById("btn");

var cityListArr = [];
var numberOfCity = 9;
var dailyWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var dailyForecastUrl = "https://api.openweathermap.org/data/2.5/onecall?";


var userForm = $("#user-form");
var cityListLi = $("#cityListLi");
//double check apiKey
var apiKey = "appid=b619612a6c7ee0713562184c662f0a3e";

// Click on Search button
$("#btn").on("click", function(event) {
    event.preventDefault();
    var currentCity = $("#city").val().trim();
    console.log(currentCity);
    var cityName = saveCity(currentCity);
    getWeather(currentCity);
    if (cityName == 1) {
        cityNameBtn(currentCity);
    }
});
$(":button.list-group-item-action").on("click", function(event) {
    BtnClickHandler(event);
});

// create city List buttons
function createBtn(btnText) {
    var btn = $("<button>")
    .text(btnText)
    .addClass("list-group-item")
    .attr("type", "submit");
return btn;
};

function getCityList() {
    cityListArr = JSON.parse(localStorage.getItem("cityWeather"));
    if (cityListArr == null) {
        cityListArr = [];
    }
    for (var i = 0; i < cityListArr.length; i++) {
        var cityBtn = createBtn(cityListArr[i]);
        cityListLi.append(cityBtn);
        }
};
getCityList();

function cityNameBtn(currentCity) {
    var cityList = JSON.parse(localStorage.getItem("cityWeather"));
    if (cityList.length == 1) {
        var nameBtn = createBtn(currentCity);
        cityListLi.prepend(nameBtn);
    } else {
        for (var i = 0; i < cityList.length; i++) {
            if (currentCity.toLowerCase() == cityList[i].toLowerCase()) {
                return;
            }
        }
      if (cityListLi[0].childElementCount < numberOfCity) {
        var nameBtn = createBtn(currentCity);
      } else {
        cityListLi[0].removeChild(cityListLi[0].lastChild);
        var nameBtn = createBtn(currentCity);
      }
      cityListLi.prepend(nameBtn);
      $(":button.list-group-item").on("click", function(event) {
        BtnClickHandler(event); 
      });
    }
};

function BtnClickHandler(event) {
    event.preventDefault();
    var currentCity = event.target.textContent.trim();
    getWeather(currentCity);
};


// Save city to localstorage
function saveCity(currentCity) {
    var inputCity = 0;
    cityListArr = JSON.parse(localStorage.getItem("cityWeather"));
    if (cityListArr == null) {
        cityListArr = [];
        cityListArr.unshift(currentCity);
    } else {
        for (var i = 0; i < cityListArr.length; i++) {
            if (currentCity.toLowerCase() == cityListArr[i].toLowerCase()) {
                return inputCity;
            }
        }
            if (cityListArr.length < numberOfCity) {
                cityListArr.unshift(currentCity);
            } else {
                cityListArr.pop();
                cityListArr.unshift(currentCity);
            }
    }
    localStorage.setItem("cityWeather", JSON.stringify(cityListArr));
    inputCity = 1;
    return inputCity; 
};

// Get data from API
function getWeather(currentCity) {
    var apiUrl = dailyWeatherUrl + currentCity + "&" + apiKey;
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
            $("#humidy" + i).html(humidity + " %");
        }
    });
};
