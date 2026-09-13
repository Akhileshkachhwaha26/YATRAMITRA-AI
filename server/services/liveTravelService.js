const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map();

async function fetchJson(url, options = {}) {
  const res = await fetch(url, { ...options, signal: AbortSignal.timeout(7000) });
  if (!res.ok) throw new Error(`Live data provider returned ${res.status}`);
  return res.json();
}

function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit || Date.now() - hit.at > CACHE_TTL_MS) return null;
  return hit.data;
}
function cacheSet(key, data) { cache.set(key, { at: Date.now(), data }); }

async function getWeather({ latitude, longitude }) {
  const key = `weather:${latitude}:${longitude}`;
  const cached = cacheGet(key); if (cached) return cached;
  const data = await fetchJson(`https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&forecast_days=3&timezone=auto`);
  const result = { source: 'Open-Meteo', fetchedAt: new Date().toISOString(), current: data.current, daily: data.daily, timezone: data.timezone };
  cacheSet(key, result); return result;
}

async function getNearbyPlaces({ latitude, longitude }) {
  const key = `places:${latitude}:${longitude}`;
  const cached = cacheGet(key); if (cached) return cached;
  const q = `[out:json][timeout:5];(nwr(around:5000,${latitude},${longitude})[tourism];nwr(around:5000,${latitude},${longitude})[historic];);out center tags 12;`;
  const res = await fetch('https://overpass-api.de/api/interpreter', { method:'POST', headers:{'Content-Type':'text/plain'}, body:q, signal:AbortSignal.timeout(7000) });
  if (!res.ok) throw new Error(`Overpass returned ${res.status}`);
  const data = await res.json();
  const places = (data.elements || []).map(e => ({ name:e.tags?.name, type:e.tags?.tourism || e.tags?.historic || 'place', lat:e.lat ?? e.center?.lat, lon:e.lon ?? e.center?.lon })).filter(x => x.name && Number.isFinite(x.lat) && Number.isFinite(x.lon)).slice(0,8);
  const result = { source:'OpenStreetMap / Overpass', fetchedAt:new Date().toISOString(), places }; cacheSet(key,result); return result;
}

async function getRoute({ fromLat, fromLng, toLat, toLng, mode = 'driving' }) {
  const profile = mode === 'walking' ? 'foot' : mode === 'cycling' ? 'bike' : 'car';
  const key = `route:${profile}:${fromLat}:${fromLng}:${toLat}:${toLng}`;
  const cached = cacheGet(key); if (cached) return cached;
  const url = `https://router.project-osrm.org/route/v1/${profile}/${encodeURIComponent(fromLng)},${encodeURIComponent(fromLat)};${encodeURIComponent(toLng)},${encodeURIComponent(toLat)}?overview=false&steps=false`;
  const data = await fetchJson(url);
  if (!data.routes?.[0]) throw new Error('No route found');
  const route = data.routes[0];
  const result = { source: 'OSRM', mode, distanceKm: Math.round(route.distance / 100) / 10, durationMinutes: Math.round(route.duration / 60), fetchedAt: new Date().toISOString() };
  cacheSet(key, result); return result;
}

module.exports = { getWeather, getRoute, getNearbyPlaces };
