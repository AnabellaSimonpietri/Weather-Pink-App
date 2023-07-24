window.addEventListener('load', getCurrentPosition);

let currentDate = document.querySelector('#currentData');
let now = new Date();

function formatDate(now) {
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  let day = days[now.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function showWeather(response) {
  console.log(response.data.wind.speed);
  let temperature = Math.round(response.data.main.temp);
  celsiusTemperature = response.data.main.temp;
  let city = response.data.name;
  let cloud = response.data.weather[0].main;
  let h4 = document.querySelector('#currentCity');
  let icon = response.data.weather[0].icon;
  let wind = response.data.wind.speed;
  h4.innerHTML = `${city}`;
  let cloudy = document.querySelector('#cloud');
  cloudy.innerHTML = `${cloud}`;
  let temp = document.querySelector('#temperature');
  let windy = document.querySelector('#wind');
  windy.innerHTML = ` ${wind} km/h`;
  temp.innerHTML = `${temperature}`;
  let iconElement = document.querySelector('#icon');
  iconElement.setAttribute(
    'src',
    `https://openweathermap.org/img/wn/${icon}@2x.png`
  );

  // Obtener el pronóstico para los próximos días
  let apiKey = '5af46b7c735c00e84f63fde5be627fa5';
  let apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiURL).then(function (response) {
    let forecastData = response.data.list;
    let daysOfWeek = ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Recorre los datos del pronóstico para cada día y muestra la temperatura e icono
    for (let i = 0; i < daysOfWeek.length; i++) {
      let dayForecast = forecastData[i * 8];

      let dayTemperatureElement = document.querySelector(
        `#temperature-${daysOfWeek[i].toLowerCase()}`
      );
      let dayIconElement = document.querySelector(
        `#icon-${daysOfWeek[i].toLowerCase()}`
      );

      if (dayForecast) {
        let dayTemperature = Math.round(dayForecast.main.temp);
        dayTemperatureElement.innerHTML = `${dayTemperature}°C`;

        let dayIcon = dayForecast.weather[0].icon;
        let iconUrl = `https://openweathermap.org/img/wn/${dayIcon}@2x.png`;
        dayIconElement.setAttribute('src', iconUrl);
        dayIconElement.setAttribute('alt', dayForecast.weather[0].description);
      } else {
        dayTemperatureElement.innerHTML = 'N/A';
        dayIconElement.setAttribute('src', '');
        dayIconElement.setAttribute('alt', '');
      }
    }
  });
}

function showArgentinaWeather() {
  let apiKey = '5af46b7c735c00e84f63fde5be627fa5';
  let city = 'Argentina'; // Ciudad para obtener el clima de Argentina
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiURL).then(showWeather);
}

currentDate.innerHTML = formatDate(now);

let apiKey = '5af46b7c735c00e84f63fde5be627fa5';
let clearInputIcon = document.querySelector('#clear-input');
let searchInput = document.querySelector('#search-text-input');

clearInputIcon.addEventListener('click', function () {
  searchInput.value = '';
});

searchInput.addEventListener('input', function () {
  if (searchInput.value === '') {
    clearInputIcon.style.opacity = 0;
    clearInputIcon.style.pointerEvents = 'none';
  } else {
    clearInputIcon.style.opacity = 1;
    clearInputIcon.style.pointerEvents = 'all';
  }
});

let form = document.querySelector('#search-form');
function searchWeather(event) {
  event.preventDefault();
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${apiKey}&units=metric`;
  axios.get(apiURL).then(showWeather);
}
form.addEventListener('submit', searchWeather);

function currentCity(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      axios.get(apiUrl).then(showWeather);
    },
    function (error) {
      // Si no se puede obtener la ubicación, muestra el clima de Argentina
      showArgentinaWeather();
    }
  );
}

let button = document.querySelector('#current-city');
button.addEventListener('click', getCurrentPosition);

function temperatureC(event) {
  event.preventDefault();
  let link = document.querySelector('#temperature');
  let tempC = Math.round(celsiusTemperature);
  link.innerHTML = `${tempC}`;
}
function temperatureF(event) {
  event.preventDefault();
  let tempF = Math.round((celsiusTemperature * 9) / 5 + 32);
  let fahrengeit = document.querySelector('#temperature');
  fahrengeit.innerHTML = `${tempF}`;
}

let celsiusTemperature = null;

let celsium = document.querySelector('#celsium');
celsium.addEventListener('click', temperatureC);
let fahrenheite = document.querySelector('#fahrenheit');
fahrenheite.addEventListener('click', temperatureF);
