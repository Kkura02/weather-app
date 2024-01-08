const key = '9022d83292b1244fc1c5ede7d7d42dd5';

async function search() {
    const phrase = document.querySelector('input[type="text"]').value;
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${key}`)
    const data = await response.json();
    const ul = document.querySelector('form ul');
    ul.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        const { name, lat, lon, country } = data[i];
        // console.log(item);
        ul.innerHTML += `<li 
            data-lat="${lat}" 
            data-lon="${lon}" 
            data-name="${name}"
            data-country="${country}">
                ${name},
                <span>${country}</span>
            </li>`
    }
}

const debouncedSearch = _.debounce(() => {
    search();
}, 600)

async function showWeather(lat, lon, name, country) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`)
    const data = await response.json();
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = Math.round(data.main.humidity);
    const wind = Math.round(data.wind.speed);
    const icon = data.weather[0].icon;
    const weatherDescription = data.weather[0].description;
    console.log({ temp, feelsLike, humidity, wind, icon });
    console.log(data);
    document.getElementById('city').innerHTML = name + ` <span>${country}</span>`;
    document.getElementById('degrees').innerHTML = temp + '&deg;C';
    document.getElementById('windValue').innerHTML = wind + '<span>km/h</span>';
    document.getElementById('feelslikeValue').innerHTML = feelsLike + '<span>&deg;C</span>';
    document.getElementById('humidityValue').innerHTML = humidity + '<span>%</span>';
    document.getElementById('icon').src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    document.getElementById('weatherDescription').innerHTML = weatherDescription;
    document.querySelector('form').style.display = 'none';
    document.getElementById('weather').style.display = 'flex';
}

// Change City
document.querySelector('button#change').addEventListener('click', () => {
    document.querySelector('#weather').style.display = 'none';
    document.querySelector('form').style.display = 'flex';
});

// Type a city
document.querySelector('input[type="text"]').addEventListener('keyup', debouncedSearch)


// Click a city
document.body.addEventListener('click', e => {
    const li = e.target;
    const { lat, lon, name, country } = li.dataset;
    localStorage.setItem('lat', lat)
    localStorage.setItem('lon', lon)
    localStorage.setItem('name', name)
    localStorage.setItem('country', country)
    if (!lat) {
        return;
    }

    showWeather(lat, lon, name, country)
});

// Prevent submit on form
document.querySelector('form').addEventListener('submit', e => { e.preventDefault() });

document.body.onload = () => {
    if (localStorage.getItem('lat')) {
        const lat = localStorage.getItem('lat');
        const lon = localStorage.getItem('lon');
        const name = localStorage.getItem('name');
        const country = localStorage.getItem('country');
        showWeather(lat, lon, name, country)
    }
}