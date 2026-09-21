// Lee y parsea .env (no es válido para `import`, hace falta fetch + parseo).

let configPromise;

async function fetchEnv() {
  const text = await fetch("./.env").then((r) => r.text());
  const env = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    env[key] = rest.join("=");
  }
  return env;
}

export function getConfig() {
  if (!configPromise) {
    configPromise = fetchEnv().then((env) => ({
      API_KEY: env.TMDB_API_KEY,
      BASE_URL: env.TMDB_BASE_URL,
      IMAGE_BASE: env.TMDB_IMAGE_BASE,
      LANGUAGE: env.TMDB_LANGUAGE,
    }));
  }
  return configPromise;
}
