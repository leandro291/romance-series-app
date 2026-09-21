// Lee y parsea .env (no es válido para `import`, hace falta fetch + parseo).

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
    API_KEY: env.TMDB_API_KEY,
    BASE_URL: env.TMDB_BASE_URL,
    IMAGE_BASE: env.TMDB_IMAGE_BASE,
    LANGUAGE: env.TMDB_LANGUAGE,
  };
}

export function getConfig() {
  if (!configPromise) configPromise = loadConfig();
  return configPromise;
}
