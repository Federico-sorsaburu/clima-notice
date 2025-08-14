
const KEY = 'cn_favorites_v1';

export function loadFavorites(){
  try{ return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch{ return []; }
}
function cityKey(c){ return `${c.name}|${c.country_code}|${c.latitude}|${c.longitude}`; }

export function saveFavorite(city){
  const favs = loadFavorites();
  const exists = favs.find(f => cityKey(f) === cityKey(city));
  if(!exists){
    favs.push(city);
    localStorage.setItem(KEY, JSON.stringify(favs));
  }
}

export function removeFavorite(city){
  const favs = loadFavorites().filter(f => f.name !== city.name || f.latitude !== city.latitude || f.longitude !== city.longitude);
  localStorage.setItem(KEY, JSON.stringify(favs));
}

export function isFavorite(city){
  return !!loadFavorites().find(f => f.name === city.name && f.latitude === city.latitude && f.longitude === city.longitude);
}
