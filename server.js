'use strict'

const express = require('express');
require('dotenv').config();
const cors = require('cors');
let data = require('./data/weather.json');
const axios = require('axios');
const WEATHER_API_KEY = '3c2b11e96b204a6dbc16ce459fca4715';

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=> console.log(`We are running on ${PORT}!`));



app.get('/', (request, response) => {
    response.status(200).send('Welcome to my server!');
});


app.get('/weather', async (request, response, next) => {
    console.log.apply(request.query);
    try {
        let lat = request.query.lat;
        let lon = request.query.lon;
        let searchQuery = request.query.searchQuery;
        let weatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}&units=I&days=3`;

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
});

class Forecast {
    constructor(cityObj) {
        this.date = cityObj.valid_date;
        this.description = cityObj.weather.description;
        this.icon = cityObj.weather.icon;
    }
}

app.get('*',(request, response) => {
    response.status(404).send('Sorry, page not found.');
});



app.use((error, request, response, next) => {
    console.log(error.message);
    response.status(500).send(error.message);
});