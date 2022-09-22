var today = moment();
$("#moment").text(today.format("MMM Do, YYYY"));

var searchBtn = document.getElementById("btn");
var cityList = [];
//double check apiKey
var apiKey = "c93eb734109bf395fcdfb7502a3f31f2";

function setCityList() {
    localStorage.setItem("cities", JSON.stringify(cityList));
}

function createCityList() {
    $(".city-list").empty();
    cityList.forEach(function(city) {
        $(".city-List").prepend($(`<button class="cityBtn" data-city="${city}">${city}</button>`));
    })
}
console.log($(".city-List"));

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
}

function getWeather(currentCity, apiKey) {
    var currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&units=metric&appid=${apiKey}`; 
    var cityLat;
    var cityLong;

    $.ajax({
        url: currentUrl,
        method: "GET"
    }).then(function (data) {
        console.log(data);
        $("#cityName").html(data.name);
        $("#temperature").html(data.main.temp + " \u00B0F");
        $("#humidity").html(data.main.humidity + " %");
        $("windspeed").html(data.wind.speed + " kph");
        cityLat = data.coord.lat;
        cityLong = data.coord.lon;
        getUVI(apiKey, cityLat, cityLong);
    })
}

function getUVI(apiKey, cityLat, cityLong) {
    var uviUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityLat}&lon=${cityLong}&appid=${apiKey}`;

    $.ajax({
        url: uviUrl,
        method: "GET"
    })
    .then(function(data) {
        $("#cityName").append(`<p>UV Index: <span class="badge badge-warning p-2">${data.value}</span></p>`);
    })
}

function getForecast (currentCity, apiKey) {
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&units=metric&appid=${apiKey}`;

    $.ajax({
        url: forecastUrl,
        method: "GET"
    })
    .then(function (data) {
        for (var i = 0; i < data.list.length; i++) {
            if (data.list[i].dt_txt.search("18:00:00") != -1) {
                var forecastDate = data.list[i];
                $(".card-group").append(
                    `<div class="card-body col-md-2 m-4">
                    <h5 class="card-title">${new Date(1000 * forecastDate.dt).getUTCDate()}/${(new Date(1000 * forecastDate.dt).getUTCMonth()) + 1}/${(new Date(1000 * forecastDate.dt).getUTCMonth()) + 1}/${new Date(1000 * forecastDate.dt).getUTCFullYear()}</h5>
                    <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">>
                    <p class="card-text">Temp: ${forecastDate.main.temp} &degC</p>
                    <p class="card-text"> ${forecastDate.main.humidity} %</p>
                  </div>`
                );
            }
        }
    })
}