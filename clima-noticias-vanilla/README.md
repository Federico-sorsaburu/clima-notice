
# Dashboard de Clima y Noticias (Vanilla JS)

Proyecto 100% **JavaScript + HTML + CSS** (sin frameworks) para tu portafolio.

## Features
- Búsqueda de ciudades con autocompletado (Open‑Meteo Geocoding).
- Clima actual + próximos días (Open‑Meteo, sin API key).
- Noticias relacionadas (The Guardian API con `api-key=test` para demo).
- Favoritos persistidos en `localStorage`.
- Auto‑refresh configurable (cada X minutos).
- Manejo de errores con mensajes visibles y reintentos (exponenciales).
- Estructura modular con ES Modules.

## Cómo correrlo
1. Abri `index.html` con Live Server (VS Code) o un servidor estático simple.
   - Ejemplo con Python: `python -m http.server 5500` y abrir http://localhost:5500
2. En `./src/api/news.js` podés cambiar la fuente de noticias por otra API si querés español (GNews, Mediastack, Newsdata), agregando tu API key.
3. Ajustá el intervalo de refresco en `src/app.js` (const `AUTO_REFRESH_MINUTES`).

## APIs usadas
- **Open‑Meteo Geocoding**: https://geocoding-api.open-meteo.com
- **Open‑Meteo Forecast**: https://api.open-meteo.com
- **The Guardian Content API** (demo): https://content.guardianapis.com (usa `api-key=test`)

> Nota: `api-key=test` de The Guardian sirve para pruebas con límites. Registrate gratis para una key propia si lo vas a publicar.

## Estructura
```
/clima-noticias-vanilla
  ├── index.html
  ├── src/
  │   ├── app.js
  │   ├── ui.js
  │   ├── storage.js
  │   └── api/
  │       ├── openMeteo.js
  │       └── news.js
  └── styles.css
```

## Tareas sugeridas para el portafolio
- [ ] Agregar modo oscuro (prefers-color-scheme).
- [ ] i18n (es/en) para UI.
- [ ] Tests de utilidades con Vitest (opcional).
- [ ] Accesibilidad (role, aria-*).
- [ ] Skeleton loaders y shimmer.
- [ ] Worker para cache (PWA).
