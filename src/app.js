
import * as OM from './api/openMeteo.js';
import * as NEWS from './api/news.js';
import * as UI from './ui.js';
import { loadFavorites, saveFavorite, removeFavorite, isFavorite } from './storage.js';

const AUTO_REFRESH_MINUTES = 15;

let currentCity = null;
let refreshTimer = null;
let abortActive = null;

function setAutoRefresh(mins){
  clearInterval(refreshTimer);
  if(Number(mins) > 0){
    refreshTimer = setInterval(async () => {
      if(currentCity){
        await loadCity(currentCity);
      }
    }, Number(mins) * 60 * 1000);
  }
}

async function searchHandler(e){
  const q = e.target.value.trim();
  if(q.length < 2){ UI.clearSuggestions(); return; }
  try{
    const results = await OM.searchCity(q);
    UI.showSuggestions(results, async (city) => {
      document.getElementById('search').value = `${city.name}, ${city.country_code}`;
      UI.clearSuggestions();
      await loadCity(city);
    });
  }catch(err){
    UI.toast(`Error buscando ciudad: ${err.message}`,'error');
  }
}

async function loadCity(city){
  currentCity = city;
  UI.setCityTitle(`${city.name}, ${city.country_code}`);
  UI.setLoading(true);

  // cancelar request anterior
  if(abortActive) abortActive.abort();
  abortActive = new AbortController();
  const signal = abortActive.signal;

  try{
    const [weather, news] = await Promise.all([
      OM.getForecast(city.latitude, city.longitude, { signal }),
      NEWS.fetchNews(`${city.name} weather OR climate`, { signal })
    ]);
    UI.renderCurrent(weather);
    UI.renderForecast(weather);
    UI.renderNews(news);
    UI.updateFavButton(isFavorite(city), async () => {
      if(isFavorite(city)){ removeFavorite(city); }
      else{ saveFavorite(city); }
      UI.renderFavorites(loadFavorites(), loadCity, removeFavorite);
      UI.updateFavButton(isFavorite(city));
    });
  }catch(err){
    if(err.name !== 'AbortError'){
      UI.toast(`No se pudo cargar datos: ${err.message}`,'error');
    }
  }finally{
    UI.setLoading(false);
  }
}

function init(){
  const search = document.getElementById('search');
  const btnFav = document.getElementById('btn-add-fav');
  const selRefresh = document.getElementById('refresh-mins');

  // favs iniciales
  UI.renderFavorites(loadFavorites(), loadCity, removeFavorite);

  // eventos
  search.addEventListener('input', UI.debounce(searchHandler, 250));
  document.addEventListener('click', (e)=>{
    if(!document.getElementById('suggestions').contains(e.target)){
      UI.clearSuggestions();
    }
  });

  btnFav.addEventListener('click', async () => {
    if(!currentCity) return;
    if(isFavorite(currentCity)){ removeFavorite(currentCity); }
    else{ saveFavorite(currentCity); }
    UI.renderFavorites(loadFavorites(), loadCity, removeFavorite);
    UI.updateFavButton(isFavorite(currentCity));
  });

  selRefresh.addEventListener('change', (e)=> setAutoRefresh(e.target.value));
  selRefresh.value = String(AUTO_REFRESH_MINUTES);
  setAutoRefresh(AUTO_REFRESH_MINUTES);

  // default: Buenos Aires
  loadCity({ name:'Buenos Aires', country_code:'AR', latitude:-34.61, longitude:-58.38 });
}

init();
