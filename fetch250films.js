const fs = require('fs');
const axios = require('axios');

const API_BASE_URL = 'https://kinopoiskapiunofficial.tech';
const REQUEST_DELAY = 200; // in milliseconds
const FILM_ENDPOINT = '/api/v2.2/films/top';
const TOTAL_PAGES = 13;
const OUTPUT_FILE_PATH = './top250.json';

const API_HEADERS = {
  headers: {
    'X-API-KEY': '0cdceb70-6d1b-4fa7-a3a9-a43284cdbae7',
    'Content-Type': 'application/json',
  },
};

function constructURL(endpoint, baseURL, pageNum) {
  const url = new URL(endpoint, baseURL);
  url.searchParams.append('page', `${pageNum}`);
  return url;
}

function pauseExecution(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function saveToFile(data) {
  const formattedData = JSON.stringify(data, null, 4);
  fs.writeFile(OUTPUT_FILE_PATH, formattedData, (err) => {
    if (err) {
      console.error(`Failed to write to ${OUTPUT_FILE_PATH}: ${err.message}`);
    }
  });
}

async function fetchTop250Films() {
  const filmsList = [];
  console.log('Fetching film data, please wait...');

  try {
    for (let page = 1; page <= TOTAL_PAGES; page++) {
      const response = await axios.get(
        constructURL(FILM_ENDPOINT, API_BASE_URL, page),
        API_HEADERS
      );
      filmsList.push(...response.data.films);
      await pauseExecution(REQUEST_DELAY); // avoid hitting rate limits
    }
  } catch (error) {
    console.error(
      `Error: ${error.status ?? ''}\n${
        error.response?.data?.message ?? error.message
      }`
    );
  }

  const transformedFilms = transformFilmData(filmsList);
  saveToFile(transformedFilms);
}

function transformFilmData(films) {
  return films.map((film, index) => ({
    id: film.filmId,
    title: film.nameEn ?? film.nameRu,
    rating: film.rating,
    year: Number(film.year),
    budget: generateRandomBudget(),
    gross: generateRandomBudget(),
    poster: film.posterUrl,
    position: index + 1,
  }));
}

function generateRandomBudget() {
  return Math.floor(Math.random() * 10_000_000);
}

fetchTop250Films();
