
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

function withTimeout(ms, { signal } = {}){
  const ctrl = new AbortController();
  const t = setTimeout(()=> ctrl.abort(), ms);
  const linked = signal ? new AbortController() : null;
  if(signal){
    signal.addEventListener('abort', ()=> ctrl.abort());
  }
  return { signal: ctrl.signal, cancel: ()=> clearTimeout(t) };
}

export async function searchCity(q){
  const url = new URL(GEOCODE_URL);
  url.searchParams.set('name', q);
  url.searchParams.set('count', '10');
  url.searchParams.set('language', 'es');
  url.searchParams.set('format', 'json');
  const { signal, cancel } = withTimeout(8000);
  try{
    const res = await fetch(url, { signal });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }finally{
    cancel();
  }
}

export async function getForecast(lat, lon, { signal } = {}){
  const url = new URL(FORECAST_URL);
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('current_weather', 'true');
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_probability_max');
  url.searchParams.set('timezone', 'auto');
  const { signal: s2, cancel } = withTimeout(8000, { signal });
  try{
    const res = await fetch(url, { signal: s2 });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }finally{
    cancel();
  }
}
