'use strict';

const axios = require('axios');

let cache = require('./cache');

async function getWeather(request, response, next) {
    try {
        let lat = request.query.lat;
        let lon = request.query.lon;
        let weatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}&units=I&days=7`;

        const key = `${lat},${lon}--Weather`;

        if (cache[key] && (Date.now() - cache[key].timestamp) < 100000) {
            console.log('Cache was hit!', cache);
      
            response.status(200).send(cache[key].data);
      
          } else {
            console.log('No item in cache');
            let axiosData = await axios.get(weatherURL);
            let weatherData = axiosData.data;
            if (weatherData) {
                let weatherForecast = weatherData.data.map(date => new Forecast(date));
                cache[key] = {
                    timestamp: Date.now(),
                    data: weatherForecast
                }
                response.status(200).send(weatherForecast);
    
            } else {
                response.status(404).send('No information on that city');
            }
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