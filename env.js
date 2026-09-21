// Lee y parsea .env (no es válido para `import`, hace falta fetch + parseo).
// Requiere server HTTP (no abrir index.html con file://, fetch lo bloquea por CORS).

let configPromise;

async function fetchEnv() {
  const response = await fetch("./.env");
  const text = await response.text();
  const env = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    env[key] = rest.join("=");
  }
  return env;
}

async function loadConfig() {
  const env = await fetchEnv();
  return {
    ACCESS_TOKEN: env.TMDB_ACCESS_TOKEN,
    BASE_URL: env.TMDB_BASE_URL,
    IMAGE_BASE: env.TMDB_IMAGE_BASE,
    LANGUAGE: env.TMDB_LANGUAGE,
  };
}

export function getConfig() {
  if (!configPromise) configPromise = loadConfig();
  return configPromise;
}
