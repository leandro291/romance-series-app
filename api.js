// Todo lo que habla con la API de TMDB vive aquí.

import { getConfig } from "./env.js";

async function tmdbFetch(path) {
  const config = await getConfig();
  const url = new URL(config.BASE_URL + path);
  url.searchParams.set("language", config.LANGUAGE);

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + config.ACCESS_TOKEN,
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("Access token inválido. Revisá .env.");
    throw new Error("Error de la API (" + response.status + ").");
  }

  return response.json();
}

// Las 20 películas y series de romance favoritas (id + tipo de TMDB).
export const FAVORITES = [
  { id: 194766, type: "tv" }, // The Summer I Turned Pretty
  { id: 110070, type: "tv" }, // Horimiya
  { id: 195670, type: "tv" }, // XO, Kitty
  { id: 68854, type: "tv" }, // Kimi ni Todoke
  { id: 91239, type: "tv" }, // Bridgerton
  { id: 124834, type: "tv" }, // Heartstopper
  { id: 100883, type: "tv" }, // Never Have I Ever
  { id: 199001, type: "tv" }, // My Life with the Walter Boys
  { id: 154825, type: "tv" }, // Business Proposal
  { id: 85991, type: "tv" }, // Fruits Basket
  { id: 82596, type: "tv" }, // Emily in Paris
  { id: 88324, type: "tv" }, // Virgin River
  { id: 597, type: "movie" }, // Titanic
  { id: 11036, type: "movie" }, // The Notebook
  { id: 466282, type: "movie" }, // To All the Boys I've Loved Before
  { id: 313369, type: "movie" }, // La La Land
  { id: 4348, type: "movie" }, // Pride & Prejudice
  { id: 372058, type: "movie" }, // Your Name
  { id: 4951, type: "movie" }, // 10 Things I Hate About You
  { id: 455207, type: "movie" }, // Crazy Rich Asians
];

export function fetchDetails(item) {
  return tmdbFetch("/" + item.type + "/" + item.id);
}
