// Romance TV — 20 películas y series de romance favoritas.

import { getConfig } from "./env.js";
import { FAVORITES, fetchDetails } from "./api.js";

const statusArea = document.getElementById("status-area");
const grid = document.getElementById("results-grid");
const modalOverlay = document.getElementById("modal-overlay");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");

async function posterUrl(path) {
  if (!path) return null;
  const config = await getConfig();
  return config.IMAGE_BASE + path;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function getYear(date) {
  return date ? date.slice(0, 4) : "Sin fecha";
}

function shortOverview(text) {
  if (!text) return "Sin descripción disponible.";
  return text.length > 140 ? text.slice(0, 140).trim() + "…" : text;
}

async function cardData(item) {
  return {
    title: escapeHtml(item.title || item.name),
    poster: await posterUrl(item.poster_path),
    year: getYear(item.release_date || item.first_air_date),
  };
}

function setStatus(type, message) {
  if (!type) {
    statusArea.innerHTML = "";
    return;
  }
  const icon = type === "loading" ? '<span class="spinner"></span>' : "";
  statusArea.innerHTML = `<div class="status-message ${type}">${icon}<span>${message}</span></div>`;
}

async function createCard(item) {
  const card = document.createElement("article");
  card.className = "card";

  const { title, poster, year } = await cardData(item);

  card.innerHTML = `
    <div class="card-poster-wrap">
      ${poster ? `<img src="${poster}" alt="${title}" loading="lazy">` : `<div class="no-poster">🎬</div>`}
      ${item.vote_average ? `<div class="card-rating">★ ${item.vote_average.toFixed(1)}</div>` : ""}
    </div>
    <div class="card-body">
      <div class="card-title">${title}</div>
      <div class="card-year">${year}</div>
    </div>`;

  card.addEventListener("click", () => openDetails(item));
  return card;
}

async function openDetails(item) {
  const { title, poster, year } = await cardData(item);

  modalOverlay.hidden = false;
  modalContent.innerHTML = `
    ${poster ? `<img class="modal-poster" src="${poster}" alt="${title}">` : ""}
    <h2>${title}</h2>
    <p class="modal-meta">${year}${item.vote_average ? " · ★ " + item.vote_average.toFixed(1) : ""}</p>
    <p class="modal-overview">${escapeHtml(shortOverview(item.overview))}</p>`;
}

modalClose.addEventListener("click", () => (modalOverlay.hidden = true));
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) modalOverlay.hidden = true;
});

async function loadFavorites() {
  setStatus("loading", "Cargando tus favoritas...");
  grid.innerHTML = "";

  try {
    const items = await Promise.all(FAVORITES.map((fav) => fetchDetails(fav)));

    setStatus(null);
    for (const item of items) {
      grid.appendChild(await createCard(item));
    }
  } catch (error) {
    setStatus("error", "⚠️ " + error.message);
  }
}

loadFavorites();
