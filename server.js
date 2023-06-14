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

        searchCheck = () => {
            if(data.find(searchQuery)) {
                let myResponse = data.find(searchQuery);
                response.status(200).send(myResponse);
            } else {
                response.status(404).send('No data for that city sorry');
            }
        } 

    } catch (error) {
        next(error)
    }

});


app.get('*',(request, response) => {
    response.status(404).send('Sorry, page not found.');
});



app.use((error, request, response, next) => {
    console.log(error.message);
    response.status(500).send(error.message);
});