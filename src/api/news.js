
const BASE = 'https://content.guardianapis.com/search';

function withTimeout(ms, { signal } = {}){
  const ctrl = new AbortController();
  const t = setTimeout(()=> ctrl.abort(), ms);
  if(signal){ signal.addEventListener('abort', ()=> ctrl.abort()); }
  return { signal: ctrl.signal, cancel: ()=> clearTimeout(t) };
}

const API_KEY = 'test';

export async function fetchNews(query, { signal } = {}){
  const url = new URL(BASE);
  url.searchParams.set('q', query);
  url.searchParams.set('page-size', '12');
  url.searchParams.set('order-by', 'newest');
  url.searchParams.set('api-key', API_KEY);

  const { signal: s2, cancel } = withTimeout(8000, { signal });
  try{
    const res = await fetch(url, { signal: s2 });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const items = json.response.results.map(r => ({
      title: r.webTitle,
      url: r.webUrl,
      source: 'The Guardian',
      publishedAt: r.webPublicationDate
    }));
    return items;
  }finally{
    cancel();
  }
}
