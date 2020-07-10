window.addEventListener('load', () => {
    let long;
    let lat;
    const dbackgroundImage = document.querySelector('.container1');
    const searchbarText = document.querySelector('#search-bar-text');
    const searchIcon = document.querySelector('.search-icon');
    const currentTemp = document.querySelector('.current-temp-number');
    const fahTemp = document.querySelector('.fah');
    const celTemp = document.querySelector('.cel');
    const nameOfPlace = document.querySelector('.name-of-place-full');
    const iconImage = document.querySelector('.icon-image');
    const iconDescription = document.querySelector('.icon-description');
    const maxTempNumber = document.querySelector('.max-temp-number');
    const minTempNumber = document.querySelector('.min-temp-number');
    const feelsLikeNumber = document.querySelector('.feels-like-number');
    const windSpeedNumber = document.querySelector('.wind-speed-number');
    const windSpeedText = document.querySelector('.wind-speed-text');

    const humidityNumber = document.querySelector('.humidity-number');
    const visibilityNumber = document.querySelector('.visibility-number');
    const messageSection = document.querySelector('.message');
    const messageText = document.querySelector('.message-text');




    // The api used
    let apiID = `575324418d03a4a82d9b0e5727371f84`;
    let api1 = `http://api.openweathermap.org/data/2.5/weather?appid=${apiID}`;

    let userCity = '';
    //getting the latitude and longitude value from the user's browser/device
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            //adding the latitude and longitude value to the base api
            let latUrl = api1 + `&lat=${lat}&lon=${long}`;
            console.log(api1);
            //running the api using latitude and the longitude value
            runWeather(latUrl);
        });
    }

    //if the server does not let the local host run the api  use   
    // const proxy = "https://cors-anywhere.herokuapp.com/"; 

    //take the city name from search box and run the api with that city
    function setPlaceName() {
        //store what is typed in the search bar in userCity
        userCity = searchbarText.value;
        //adding the city name to the base api
        cityUrl = api1 + `&q=${userCity}`;
        //if the search bar is empty, remove no-message class
        if (userCity == '') {
            messageSection.classList.remove('no-message');
        }
        //else add it back
        else {
            messageSection.classList.add('no-message');
        }
        //run the api using city name
        runWeather(cityUrl);
        searchbarText.value = '';
    }
    //when keyboard is used
    function enterPlaceName(inputKey) {
        //if the user hits enter key
        if (inputKey.keyCode == 13) {
            setPlaceName();

        }
    }
    searchbarText.addEventListener('keypress', enterPlaceName);
    searchIcon.addEventListener('click', setPlaceName);

    //use the appropriate api and  
    function runWeather(weatherUrl) {
        //one call  exclude minutely
        fetch(weatherUrl)
            .then(response => { //This gets the response only after it is fetched from the api
                return response.json(); //This makes is a json file
            })
            .then(data => {

                console.log(data);
                const { temp, temp_max, temp_min, feels_like, humidity } = data.main;
                const { country } = data.sys;
                const { speed } = data.wind;
                const { description, icon } = data.weather[0];

                currentTemp.textContent = temp;
                feelsLikeNumber.textContent = feels_like;
                //windspeed in mph
                windSpeedNumber.textContent = Math.floor(speed * 2.23694);
                windSpeedText.textContent = "Wind-speed (mph)"

                humidityNumber.textContent = humidity + "%";
                nameOfPlace.textContent = "in " + data.name + ", " + country;

                //convert visibility in meters to miles
                visibilityNumber.textContent = Math.floor(data.visibility * 0.000621371) + "mi";

                maxTempNumber.textContent = temp_max;
                minTempNumber.textContent = temp_min;
                iconDescription.textContent = description;

                // set date
                // let newdate = new Date();
                // currentDate.textContent = newdate.toDateString();

                //converting kelvin to celsius
                let celsius = temp - 273.15;
                let celsius_min = temp_min - 273.15;
                let celsius_max = temp_min - 273.15;
                let celsius_feelsLike = feels_like - 272.15;

                //converting kelvin to fahrenheit
                let fahrenheit = (celsius) * (9 / 5) + (32);
                let fahrenheit_min = (celsius_min) * (9 / 5) + (32);
                let fahrenheit_max = (celsius_max) * (9 / 5) + (32);
                let fahrenheit_feelsLike = (celsius_feelsLike) * (9 / 5) + (32);

                //Make the default as fahrenheit
                currentTemp.textContent = Math.floor(fahrenheit);
                minTempNumber.textContent = Math.floor(fahrenheit_min);
                maxTempNumber.textContent = Math.floor(fahrenheit_max);
                feelsLikeNumber.textContent = Math.floor(fahrenheit_feelsLike);

                //convert to fahrenheit and mph on click
                fahTemp.addEventListener('click', () => {
                    fahTemp.classList.add("active-degree");
                    celTemp.classList.remove("active-degree");
                    currentTemp.textContent = Math.floor(fahrenheit);
                    minTempNumber.textContent = Math.floor(fahrenheit_min);
                    maxTempNumber.textContent = Math.floor(fahrenheit_max);
                    feelsLikeNumber.textContent = Math.floor(fahrenheit_feelsLike);
                    windSpeedNumber.textContent = Math.floor(speed * 2.23694);
                    windSpeedText.textContent = "Wind-speed (mph)"
                    visibilityNumber.textContent = Math.floor(data.visibility * 0.000621371) + "mi";


                });
                //convert to celsius and km/hr on click
                celTemp.addEventListener('click', () => {
                    celTemp.classList.add("active-degree");
                    fahTemp.classList.remove('active-degree');
                    currentTemp.textContent = Math.floor(celsius);
                    minTempNumber.textContent = Math.floor(celsius_min);
                    maxTempNumber.textContent = Math.floor(celsius_max);
                    feelsLikeNumber.textContent = Math.floor(celsius_feelsLike);
                    windSpeedNumber.textContent = Math.floor(speed * 3.6);
                    windSpeedText.textContent = "Wind-speed (km/hr)"
                    visibilityNumber.textContent = Math.floor(data.visibility * 0.001) + "km";
                });

                //Store id of the weather icon in newIcons
                const newIcons = icon;
                //call the function
                setIcons();
                setBackgroundImage();

                function setBackgroundImage() {
                    if (newIcons == '01d') {
                        dbackgroundImage.style.backgroundImage = "url('./images/clear-day.jpg')";
                    } else if (newIcons == '01n') {
                        dbackgroundImage.style.backgroundImage = "url('./images/clear-night.jpg')";
                    } else if (newIcons == '02d') {
                        dbackgroundImage.style.backgroundImage = "url('./images/little-cloudy-day.jpg')";
                    } else if (newIcons == '02n') {
                        dbackgroundImage.style.backgroundImage = "url('./images/little-cloudy-night.jpg')";
                    } else if (newIcons == '03d' || newIcons == '04d') {
                        dbackgroundImage.style.backgroundImage = "url('./images/dark-cloudy-day.jpg')";
                    } else if (newIcons == '03n' || newIcons == '04n') {
                        dbackgroundImage.style.backgroundImage = "url('./images/dark-cloudy-night.jpg')";
                    } else if (newIcons == '09d') {
                        dbackgroundImage.style.backgroundImage = "url('./images/rainy-day.jpg')";
                    } else if (newIcons == '09n') {
                        dbackgroundImage.style.backgroundImage = "url('./images/rainy-night.jpg')";
                    } else if (newIcons == '10d') {
                        dbackgroundImage.style.backgroundImage = "url('./images/light-rain-day.jpg')";
                    } else if (newIcons == '10n') {
                        dbackgroundImage.style.backgroundImage = "url('./images/light-rain-night.jpg')";
                    } else if (newIcons == '11d') {
                        dbackgroundImage.style.backgroundImage = "url('./images/thunder-day.jpg')";
                    } else if (newIcons == '11n') {
                        dbackgroundImage.style.backgroundImage = "url('./images/thunder-night.jpg')";
                    } else if (newIcons == '13d') {
                        dbackgroundImage.style.backgroundImage = "url('./images/snow-day.jpg')";
                    } else if (newIcons == '13n') {
                        dbackgroundImage.style.backgroundImage = "url('./images/snow-night.jpg')";
                    } else if (newIcons == '50d') {
                        dbackgroundImage.style.backgroundImage = "url('./images/hazy-day.jpg')";
                    } else if (newIcons == '50n') {
                        dbackgroundImage.style.backgroundImage = "url('./images/hazy-night.jpg')";
                    }
                };

                function setIcons() {
                    //change the image according to the id stored in newIcons
                    iconImage.innerHTML = ` <img src="./icons-for-openweather/production/fill/openweathermap/${newIcons}.svg">`;
                }
            });
    }
});