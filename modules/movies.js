'use strict';

const axios = require('axios');

async function getMovies(request, response, next) {
    try {

        let searchQuery = request.query.searchQuery;
        let movieURL = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&api_key=${process.env.MOVIE_API_KEY}&include_adult=false&language=en-US&page=1`;

        let axiosData = await axios.get(movieURL);
        let movieData = axiosData.data;

        if (movieData) {

            let movieRoll = movieData.results.map(film => new Movie(film));
            response.status(200).send(movieRoll);
        } else {
            response.status(404).send('No movies for that city.')
        }
    } catch (error) {
        response.status(500).send(error.message);
        next(error);
    }
}

class Movie {
    constructor(movieObj) {
        this.title = movieObj.original_title;
        this.description = movieObj.overview;
        this.poster = movieObj.poster_path;
        this.voteRating = movieObj.vote_average;
    }
}

module.exports = getMovies;