import { useEffect, useState } from 'react';
import { CloudSun, Navigation, RefreshCw, ExternalLink, TrainFront, Car } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const weatherLabel = (code) => ({0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Rime fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',80:'Rain showers',81:'Rain showers',82:'Heavy showers',95:'Thunderstorm',96:'Thunderstorm + hail',99:'Thunderstorm + hail'}[code] || 'Current conditions');

export default function LiveTravelPanel({ destination }) {
  const [live, setLive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get(`/live/destination/${destination._id}`); setLive(data.data); }
    catch { setLive(null); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [destination._id]);

  async function getRoute() {
    if (!navigator.geolocation) return toast.error('Location is not supported by this browser.');
    setRouteLoading(true);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const { data } = await api.get(`/live/route/${destination._id}`, { params: { fromLat: coords.latitude, fromLng: coords.longitude, mode: 'driving' } });
        setRoute(data.data.route);
      } catch (e) { toast.error(e.response?.data?.message || 'Could not calculate route.'); }
      finally { setRouteLoading(false); }
    }, () => { toast.error('Location permission is needed for live route ETA.'); setRouteLoading(false); }, { enableHighAccuracy: false, timeout: 8000 });
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${destination.name}, ${destination.state}`)}`;
  return <div className="card p-5">
    <div className="flex items-center justify-between gap-3">
      <h3 className="flex items-center gap-2 font-semibold"><CloudSun size={17} className="text-saffron-500"/> Live travel data</h3>
      <button type="button" onClick={load} disabled={loading} className="btn-ghost !p-2" title="Refresh live data"><RefreshCw size={15} className={loading ? 'animate-spin' : ''}/></button>
    </div>
    {live?.nearbyPlaces?.places?.length > 0 && <div className="mt-4"><p className="text-xs font-semibold uppercase tracking-wide opacity-60">Nearby live map places</p><div className="mt-2 flex flex-wrap gap-2">{live.nearbyPlaces.places.slice(0,5).map(p => <span key={`${p.name}-${p.lat}`} className="chip !px-2 !py-1 capitalize">{p.name}</span>)}</div></div>}
    {live?.weather ? <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
      <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5"><p className="text-xs opacity-60">Now</p><p className="mt-1 font-semibold">{Math.round(live.weather.current.temperature_2m)}°C</p><p className="text-xs opacity-60">{weatherLabel(live.weather.current.weather_code)}</p></div>
      <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5"><p className="text-xs opacity-60">Feels like</p><p className="mt-1 font-semibold">{Math.round(live.weather.current.apparent_temperature)}°C</p><p className="text-xs opacity-60">Wind {Math.round(live.weather.current.wind_speed_10m)} km/h</p></div>
    </div> : <p className="mt-3 text-sm opacity-60">Live weather is temporarily unavailable. Seasonal guidance above is still available.</p>}
    <div className="mt-4 flex flex-wrap gap-2">
      <button type="button" onClick={getRoute} disabled={routeLoading} className="btn-secondary"><Navigation size={15}/>{routeLoading ? 'Calculating…' : 'Live route from me'}</button>
      <a className="btn-ghost" href={mapsUrl} target="_blank" rel="noreferrer"><ExternalLink size={15}/> Maps</a>
    </div>
    {route && <div className="mt-3 flex items-center gap-3 rounded-xl bg-jade-50 p-3 text-sm dark:bg-jade-500/10"><Car size={16}/><span><strong>{route.distanceKm} km</strong> · approx. <strong>{route.durationMinutes} min</strong> driving</span></div>}
    <p className="mt-3 text-[11px] opacity-50">Live weather: Open-Meteo · map places: OpenStreetMap/Overpass · routing: OSRM. Travel times are estimates, not guarantees.</p>
  </div>;
}
