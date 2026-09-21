# Romance TV 💌

Aplicación web simple (HTML, CSS, JS puro) que consume la API de **TMDB (The Movie Database)**
para mostrar hasta 20 películas de romance populares.

## Funcionalidades

- **Catálogo de 20 películas**: una sola página, sin paginación (endpoint `discover/movie`, género romance).
- **Detalle resumido**: al tocar una película se pide su info con `fetch` + `async/await` y se muestra un resumen corto en un modal.
- **Favoritos**: guarda películas con un clic en el ♡; se persisten en `localStorage` del navegador.
- **Manejo de errores y estados de carga**: spinner mientras carga, mensajes claros si la API falla o no hay resultados.
- **Diseño responsive**: funciona en escritorio y móvil.

## Cómo obtener tu API key de TMDB (gratis)

1. Crea una cuenta en https://www.themoviedb.org/signup
2. Ve a **Configuración → API**: https://www.themoviedb.org/settings/api
3. Solicita una API key tipo **Developer** (marca "uso personal / estudiante").
4. Copia el **"API Read Access Token"** (el token largo que empieza con `eyJ...`, NO la "API Key" corta de 32 caracteres).
5. Pégalo en el archivo `config.js`:

```js
const TMDB_CONFIG = {
  ACCESS_TOKEN: "PEGA_AQUI_TU_API_READ_ACCESS_TOKEN",
  ...
};
```

## Cómo correr el proyecto

No necesita instalación ni backend, pero como el JS usa módulos (`import`/`export`),
hace falta un servidor local (los navegadores bloquean módulos abiertos directamente
con doble clic, protocolo `file://`):

```bash
# Opción 1: con Python
python3 -m http.server 8000

# Opción 2: con la extensión "Live Server" de VS Code
```

Luego visita `http://localhost:8000`.

## Estructura del proyecto

```
romance-series-app/
├── index.html    # estructura de la página
├── style.css     # estilos (tema romance, responsive)
├── config.js     # configuración de la API key de TMDB (exporta TMDB_CONFIG)
├── api.js        # consumos a la API de TMDB (fetch al catálogo)
├── script.js     # lógica de la interfaz: render, favoritos, eventos
└── README.md
```

## Para la presentación

Puntos clave que puedes destacar:

- **Consumo de API REST** con `fetch()` y `async/await`.
- **Manejo de estados**: carga (loading), error, vacío y éxito.
- **Persistencia en el cliente** con `localStorage` (favoritos sobreviven al recargar la página).
- **Componentización manual**: las tarjetas de películas se generan dinámicamente con JS (`createCard`).
- Créditos a TMDB como fuente de datos (requisito de sus términos de uso).

## Nota

Este producto usa la API de TMDB pero no está avalado ni certificado por TMDB.
