
export function debounce(fn, wait=300){
  let t;
  return (...args)=>{
    clearTimeout(t);
    t = setTimeout(()=>fn(...args), wait);
  };
}

export function toast(msg, type='info'){
  console[type==='error'?'error':'log'](msg);
  const el = document.createElement('div');
  el.textContent = msg;
  el.className = 'toast';
  Object.assign(el.style, {
    position:'fixed', bottom:'14px', right:'14px', padding:'10px 12px',
    borderRadius:'10px', background:type==='error'?'#ff7a7a':'#7cc0ff',
    color:'#061024', fontWeight:'700', zIndex:9999
  });
  document.body.appendChild(el);
  setTimeout(()=> el.remove(), 2500);
}

export function setCityTitle(text){
  document.getElementById('city-title').textContent = text;
}

export function setLoading(loading){
  const current = document.getElementById('current');
  const news = document.getElementById('news');
  if(loading){
    current.innerHTML = '<div class="kv"><div class="k">Cargando...</div><div class="v">⏳</div></div>';
    news.innerHTML = '<li>Cargando noticias...</li>';
  }
}

export function showSuggestions(items, onPick){
  const ul = document.getElementById('suggestions');
  ul.innerHTML = '';
  if(!items?.results?.length) return;
  const li = document.createElement('li');
  items.results.slice(0,5).forEach(city=>{
    const btn = document.createElement('button');
    btn.textContent = `${city.name}, ${city.country_code} ${city.admin1?'- '+city.admin1:''}`;
    btn.addEventListener('click', ()=> onPick(city));
    li.appendChild(btn);
  });
  ul.appendChild(li);
}

export function clearSuggestions(){
  document.getElementById('suggestions').innerHTML = '';
}

export function kv(k,v){
  return `<div class="kv"><div class="k">${k}</div><div class="v">${v}</div></div>`;
}

export function renderCurrent(data){
  const box = document.getElementById('current');
  const c = data.current_weather;
  const daily = data.daily;
  box.innerHTML = [
    kv('Temp', `${Math.round(c.temperature)}°C`),
    kv('Viento', `${Math.round(c.windspeed)} km/h`),
    kv('Máx hoy', `${Math.round(daily.temperature_2m_max[0])}°C`),
    kv('Mín hoy', `${Math.round(daily.temperature_2m_min[0])}°C`),
    kv('Prob. lluvia', `${daily.precipitation_probability_max[0] ?? '-'}%`),
  ].join('');
}

export function renderForecast(data){
  const box = document.getElementById('forecast');
  const dates = data.daily.time;
  box.innerHTML = dates.slice(0,5).map((d,i)=>{
    const max = Math.round(data.daily.temperature_2m_max[i]);
    const min = Math.round(data.daily.temperature_2m_min[i]);
    const p = data.daily.precipitation_probability_max[i] ?? '-';
    return `<div class="day">
      <div>${new Date(d).toLocaleDateString()}</div>
      <div style="font-size:20px;font-weight:700">${max}° / ${min}°</div>
      <div style="color:#9fb0d0">Lluvia: ${p}%</div>
    </div>`;
  }).join('');
}

export function renderNews(items){
  const ul = document.getElementById('news');
  if(!items?.length){ ul.innerHTML = '<li>No hay noticias.</li>'; return; }
  ul.innerHTML = items.slice(0,8).map(n=>`
    <li>
      <a href="${n.url}" target="_blank" rel="noopener">${n.title}</a>
      <div class="source">${n.source} • ${new Date(n.publishedAt).toLocaleString()}</div>
    </li>`).join('');
}

export function renderFavorites(favs, onSelect, onRemove){
  const ul = document.getElementById('favorites');
  ul.innerHTML = '';
  favs.forEach(c=>{
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = `${c.name}, ${c.country_code}`;
    span.addEventListener('click', ()=> onSelect(c));
    const btn = document.createElement('button');
    btn.textContent = 'Quitar';
    btn.addEventListener('click', ()=>{ onRemove(c); renderFavorites(favs, onSelect, onRemove); });
    li.appendChild(span); li.appendChild(btn); ul.appendChild(li);
  });
}

export function updateFavButton(isFav, onClick){
  const btn = document.getElementById('btn-add-fav');
  btn.textContent = isFav ? '★' : '☆';
  if(onClick){
    btn.onclick = onClick;
  }
}
