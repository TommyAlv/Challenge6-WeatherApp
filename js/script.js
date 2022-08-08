// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
const apikey = '9c14403d9a3568a285bddd5f2f7e5e08';

let recentSearches = [];


let saveSearch = function (city) {
    if (!recentSearches.includes(city)) {
        recentSearches.push(city);
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
}

let clearlocalStorage = function () {
    localStorage.removeItem('recentSearches');
    populateArray();
};

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

clearFiveDay = function () {
    $('.weather-fiveday').empty();
};

fiveDayForecast = function (data) {
    clearFiveDay();

    for (let i = 1; i < 6; i++) {

        const date = moment.utc(data[i].dt * 1000).format('MMM, D, YYYY');
        const icon = data[i].weather[0].icon;

        const divColumn = $('<div>').addClass('column is-one-fifth day has-text-centered card');
        const edate = $('<p>').text(date);
        const eicon = $('<img>').attr('src', 'https://openweathermap.org/img/wn/' + icon + '.png');
        const ewind = $('<p>').text('Wind Speed: ' + data[i].wind_speed + ' mph');
        const etemp = $('<p>').text('Temp: ' + data[i].temp.day + '°F');
        const ehumidity = $('<p>').text('Humidity: ' + data[i].humidity + '%');


        divColumn.append(edate, eicon, ewind, etemp, ehumidity);
        $('.weather-fiveday').append(divColumn);

    }
};

populateArray = function () {
    recentSearches = JSON.parse(localStorage.getItem('recentSearches'));
    if (!recentSearches) {
        recentSearches = []
    }
    generateRecentSearches(recentSearches);

};

generateRecentSearches = function (data) {
    $('.recent-searches').empty();
    for (let i = data.length-1; i >= 0; i--) {

        const recentButton = $('<button>').addClass('recent-search-button is-fullwidth is-centered button mt-2').attr('city', data[i]).text(data[i]);

        $('.recent-searches').append(recentButton);
    }
};

let weather = {
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q="
            + city
            + "&units=imperial&appid="
            + apikey
        )
            .then((response) => {
                if(response.ok) {
                    response.json().then((data) => {
                        saveSearch(city);
                        populateArray();
                        this.displayWeather(data)
                    });
                }
                else {
                    alert('City Not Found, Please Try Again')
                }
            })
            // .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        const { lat } = data.coord;
        const { lon } = data.coord;
        document.querySelector('.city').innerText = 'Weather In ' + name;
        document.querySelector('.weathericon').src = 'https://openweathermap.org/img/wn/' + icon + '@2x.png';
        document.querySelector('.description').innerText = description;
        document.querySelector('.temp').innerText = temp + '°F';
        document.querySelector('.humidity').innerText = 'Humidity: ' + humidity + '%';
        document.querySelector('.wind').innerText = 'Wind Speed: ' + speed + ' mph';

        fetchForecast(lat, lon);

    },
    search: function (city) {

        this.fetchWeather(city);
    }
};


populateArray();

document.querySelector('#clear-recent').addEventListener('click', clearlocalStorage);

document.querySelector('.recent-searches').addEventListener('click', function (event) {
    let city = event.target.getAttribute('city');
    weather.search(city);
    populateArray();

});

document.querySelector('.search button').addEventListener('click', function () {
    let searchValue = document.querySelector('.search-bar').value
    weather.search(searchValue);
    populateArray();
});

document.querySelector('.search-bar').addEventListener('keyup', function (event) {
    if (event.key == 'Enter') {
        let searchValue = document.querySelector('.search-bar').value
        weather.search(searchValue);
        populateArray();
    }
});

weather.fetchWeather('Salt Lake City');