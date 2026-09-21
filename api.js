// Todo lo que habla con la API de TMDB vive aquí.

const ACCESS_TOKEN ="eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMDg4OWNhMWJjZWE0MDZlOTQ2NmVmM2E1Yjc1ZDcwNiIsIm5iZiI6MTc4OTkzNDE1NS4yNDQsInN1YiI6IjZhYjAzYTRiMWVjYzk3ZDcwNmU2NGFjZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.w8qxxKpB2HTj27cIu1EgdfjT1lfuJyg-4LwFkoy-LjA";
const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const LANGUAGE = "es-ES";
const ROMANCE_GENRE_ID = 10749;

async function tmdbFetch(path, params = {}) {

  const url = new URL(BASE_URL + path);
  url.search = new URLSearchParams({ language: LANGUAGE, ...params });

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + ACCESS_TOKEN,
    },
  });

  if (!response.ok) {
    if (response.status === 401)
      throw new Error("Access token inválido. Revisá api.js.");

    throw new Error("Error de la API (" + response.status + ").");
  }

  const data = await response.json();
  
  return data;
}


export async function fetchRomanceMovies() {
  const data = await tmdbFetch("/discover/movie", {
    with_genres: ROMANCE_GENRE_ID,
    sort_by: "popularity.desc",
  });

  return data.results;
}
