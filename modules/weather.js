'use strict';

const axios = require('axios');

async function getWeather(request, response, next) {
    try {
        let lat = request.query.lat;
        let lon = request.query.lon;
        // let searchQuery = request.query.searchQuery;
        let weatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}&units=I&days=3`;

        let axiosData = await axios.get(weatherURL);
        let weatherData = axiosData.data;
        
        if (weatherData) {
            let weatherForecast = weatherData.data.map(date => new Forecast(date));
            response.status(200).send(weatherForecast);

        } else {
            response.status(404).send('No information on that city');
        }
        
    } catch (error) {
        response.status(500).send(error.message);
        next(error);
    } 
}

class Forecast {
    constructor(cityObj) {
        this.date = cityObj.valid_date;
        this.description = cityObj.weather.description;
        this.icon = cityObj.weather.icon;
    }
}

module.exports = getWeather;