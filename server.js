'use strict'

const express = require('express');
require('dotenv').config();
const cors = require('cors');
let data = require('./data/weather.json');
const axios = require('axios');

const getWeather = require('./modules/weather');
const getMovies = require ('./modules/movies');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=> console.log(`We are running on ${PORT}!`));



app.get('/', (request, response) => {
    response.status(200).send('Welcome to my server!');
});


app.get('/weather', getWeather);

app.get('/movie', getMovies); 



app.get('*',(request, response) => {
    response.status(404).send('Sorry, page not found.');
});



app.use((error, request, response, next) => {
    console.log(error.message);
    response.status(500).send(error.message);
});