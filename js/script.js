// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

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
displayWeather: function(data) {
        const { name } = data;
        const { country } = data.sys;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector('.city').innerText = 'Weather In ' + name;
        document.querySelector('.icon').src = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';
        document.querySelector('.description').innerText = description;
        document.querySelector('.temp').innerText = temp + '°F';
        document.querySelector('.humidity').innerText = 'Humidity: ' + humidity + '%';
        document.querySelector('.wind').innerText = 'Wind Speed: ' + speed + 'mph';
},
search: function() {
    this.fetchWeather(document.querySelector('.search-bar').value);
}
};

let fiveDay = {
    apikey: '9c14403d9a3568a285bddd5f2f7e5e08',
    fetchFiveDay: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/forecast?q="
        + city
        + "&appid="
        + this.apikey
    )
        .then((response) => response.json())
            .then((data) => this.displayFiveDay(data));
    },
    displayFiveDay: function(data) {
        console.log(data);
        const { dt_txt } = data.list[0];
        console.log(dt_txt);
        document.querySelector('.day-one-date').innerText = dt_txt;
        
    }
}



document.querySelector('.search button').addEventListener('click', function () {
    weather.search();
    fiveDay.fetchFiveDay();
});

document.querySelector('.search-bar').addEventListener('keyup', function (event) {
    if (event.key == 'Enter') {
        weather.search();
        fiveDay.fetchFiveDay();
    }
});

weather.fetchWeather('American Fork');
fiveDay.fetchFiveDay('American Fork');