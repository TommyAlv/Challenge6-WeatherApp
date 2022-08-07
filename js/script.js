// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
const apikey = '9c14403d9a3568a285bddd5f2f7e5e08';

fetchForecast = function (lat, lon) {
    let fetchURL = 'https://api.openweathermap.org/data/2.5/onecall?lat='
        + lat
        + '&lon='
        + lon
        + '&exclude=hourly,minutely'
        + '&units=imperial'
        + '&appid='
        + apikey;


    fetch(fetchURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data.daily[0])
                    const { uvi } = data.current;
                    document.querySelector('.uvi').innerText = 'UV Index ' + uvi;
                    if (uvi <= 2) {
                        $('.uvi').addClass('tag is-success').removeClass('is-warning is-danger');
                    }
                    else if (uvi < 6) {
                        $('.uvi').addClass('tag is-warning').removeClass('is-success is-danger');
                    } 
                    else if (uvi > 6) {
                        $('.uvi').addClass('tag is-danger').removeClass('is-sucess is-warning');
                    }

                    const { daily } = data
                    fiveDayForecast(daily);
                })
            }
            else {
                throw new Error(response.statusText);
            }
        });
};

fiveDayForecast = function (data) {
    for (let i = 1; i < 6; i++) {

        const date = moment.utc(data[i].dt * 1000).format('MMM, D, YYYY');
        const icon = data[i].weather[0].icon;
        
        const divColumn = $('<div>').addClass('column is-one-fifth day');
        const edate = $('<p>').text(date);
        const eicon = $('<img>').attr('src', 'https://openweathermap.org/img/wn/' + icon + '@2x.png');
        const ewind = $('<p>').text('Wind Speed: ' + data[i].wind_speed + ' mph');
        const etemp = $('<p>').text('Temp: ' + data[i].temp.day + '°F');
        const ehumidity = $('<p>').text('Humidity: ' + data[i].humidity + '%');


        divColumn.append(edate, eicon, ewind, etemp, ehumidity);
        $('.weather-fiveday').append(divColumn);

    }
};

let weather = {
    apikey: '9c14403d9a3568a285bddd5f2f7e5e08',
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q="
            + city
            + "&units=imperial&appid="
            + this.apikey
        )
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { country } = data.sys;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        const { lat } = data.coord;
        const { lon } = data.coord;
        document.querySelector('.city').innerText = 'Weather In ' + name;
        document.querySelector('.icon').src = 'https://openweathermap.org/img/wn/' + icon + '@2x.png';
        document.querySelector('.description').innerText = description;
        document.querySelector('.temp').innerText = temp + '°F';
        document.querySelector('.humidity').innerText = 'Humidity: ' + humidity + '%';
        document.querySelector('.wind').innerText = 'Wind Speed: ' + speed + ' mph';

        fetchForecast(lat, lon);

    },
    search: function () {
        this.fetchWeather(document.querySelector('.search-bar').value);
    }
};



document.querySelector('.search button').addEventListener('click', function () {
    weather.search();
});

document.querySelector('.search-bar').addEventListener('keyup', function (event) {
    if (event.key == 'Enter') {
        weather.search();
    }
});

weather.fetchWeather('Salt Lake City');