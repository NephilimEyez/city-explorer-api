'use strict'

const express = require('express');
require('dotenv').config();
const cors = require('cors');
let data = require('./data/weather.json')

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=> console.log(`We are running on ${PORT}!`));



app.get('/', (request, response) => {
    response.status(200).send('Welcome to my server!');
});


app.get('/weather', (request, response, next) => {
    console.log.apply(request.query);
    try {
        let lat = request.query.lat;
        let lon = request.query.lon;
        let searchQuery = request.query.searchQuery;

        let searchCheck = data.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase());
        
        if (searchCheck) {
            let weatherForecast = searchCheck.data.map(date => new Forecast(date));

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
    }
}

app.get('*',(request, response) => {
    response.status(404).send('Sorry, page not found.');
});



app.use((error, request, response, next) => {
    console.log(error.message);
    response.status(500).send(error.message);
});