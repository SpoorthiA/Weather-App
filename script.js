
const weatherApi = {
    key: '5174a4c980abc22f0dc589db984742cf',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
};

const searchInputBox = document.getElementById('input-box');
const buttonPress = document.getElementById('btn');

searchInputBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getWeatherReport(searchInputBox.value);
    }
});

buttonPress.addEventListener('click', () => {
    getWeatherReport(searchInputBox.value);
});

function getWeatherReport(city) {
    if (!city.trim()) {
        swal("Empty Input", "Please enter a city name", "error");
        return;
    }

    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                swal("City Not Found", "Please check the city name", "warning");
            } else {
                showWeatherReport(data);
            }
        })
        .catch(() => {
            swal("Error", "Unable to fetch weather data", "error");
        });
}

function showWeatherReport(weather) {
    const weatherBody = document.getElementById('weather-body');
    weatherBody.style.display = 'block';

    const todayDate = new Date();
    weatherBody.innerHTML = `
        <div class="location-details">
            <div class="city">${weather.name}, ${weather.sys.country}</div>
            <div class="date">${formatDate(todayDate)}</div>
        </div>
        <div class="weather-status">
            <div class="temp">${Math.round(weather.main.temp)}&deg;C</div>
            <div class="weather">${weather.weather[0].main} <i class="${getWeatherIcon(weather.weather[0].main)}"></i></div>
            <div class="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max)</div>
            <div class="details">Feels like: ${weather.main.feels_like}&deg;C | Humidity: ${weather.main.humidity}%</div>
        </div>
    `;
    setBackground(weather.weather[0].main);
    resetInput();
}

function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `${date.getDate()} ${months[date.getMonth()]} (${days[date.getDay()]}) , ${date.getFullYear()}`;
}

function getWeatherIcon(weather) {
    const icons = {
        Rain: 'fas fa-cloud-showers-heavy',
        Clouds: 'fas fa-cloud',
        Clear: 'fas fa-sun',
        Snow: 'fas fa-snowflake',
        Thunderstorm: 'fas fa-bolt',
        Drizzle: 'fas fa-cloud-rain',
        Mist: 'fas fa-smog',
        Haze: 'fas fa-smog',
        Fog: 'fas fa-smog',
        Smoke: 'fas fa-smog'
    };
    return icons[weather] || 'fas fa-cloud-sun';
}

function setBackground(weather) {
    const backgrounds = {
        Clouds: 'url(../clouds.webp)',
        Rain: 'url(../rain.avif)',
        Clear: 'url(../clear.jpg)',
        Snow: 'url(../snow.avif)',
        Thunderstorm: 'url(../thunder.jpg)',
        Drizzle: 'url(../drizzle.jpeg)',
        Mist: 'url(../mist.jpg)',
        Haze: 'url(../mist.jpg)',
        Fog: 'url(../mist.jpg)',
        Smoke: 'url(../mist.jpg)'
    };

    document.body.style.backgroundImage = backgrounds[weather] || 'url(../images/bg.jpg)';
}

function resetInput() {
    searchInputBox.value = '';
}
