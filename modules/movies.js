'use strict';

const axios = require('axios');

async function getMovies(request, response, next) {
    try {
        
    } catch (error) {
        response.status(500).send(error.message);
        next(error);
    }
}