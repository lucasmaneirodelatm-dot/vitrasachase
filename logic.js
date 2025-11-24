/* logic.js
   Lógica compartida para VITRASA CHASE (local / IA / parada / bus)
   EDITA las URLs de datos si las sirves desde otro sitio.
*/

// ----- Rutas a tus JSON (cámbialas solo si las guardas en otro sitio) -----
const PARADAS_URL = 'https://raw.githubusercontent.com/lucasmaneirodelatm-dot/vitrasachase/refs/heads/main/paradas.json';   // <-- ruta local subida por ti
const LINEAS_URL  = 'https://raw.githubusercontent.com/lucasmaneirodelatm-dot/vitrasachase/refs/heads/main/lineas.json';
const BUSES_URL   = 'https://raw.githubusercontent.com/lucasmaneirodelatm-dot/vitrasachase/refs/heads/mainbuses.json';

// ---------- Utilities ----------
function qs(name) {
  name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}

async function loadJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn("No se pudo cargar JSON", url, e);
    return null;
  }
}

function formatLinesArray(arr) {
  if (!arr) return '';
  return arr.join(', ');
}

// Simula un "ahora" / próximos tiempos: si la entrada contiene 'proximas' o 'tiempos' usa eso.
// Aquí convertimos cualquier valor "ahora" (string) para mostrar botón Coger.
function nextArrivalLabel(t) {
  if (t == null) return '—';
  if (typeof t === 'string' && t.toLowerCase() === 'ahora') return 'ahora';
  if (!isNaN(Number(t))) {
    const n = Number(t);
    if (n <= 0) return 'ahora';
    return `${n} min`;
  }
  return String(t);
}

// Guarda/lee estado de la partida (sessionStorage)
const GameState = {
  get(key) { return sessionStorage.getItem(key); },
  set(key, val) { sessionStorage.setItem(key, String(val)); },
  setObj(key, obj) { sessionStorage.setItem(key, JSON.stringify(obj)); },
  getObj(key) { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : null; },
  clear() { sessionStorage.clear(); }
};

// Localiza parada en la lista por código (string o número)
function findStopByCode(paradas, code) {
  if (!paradas) return null;
  return paradas.find(p => String(p.codigo || p.id) === String(code) || String(p.code) === String(code));
}

// Simula la llegada de buses (básico, expandible)
// Devuelve una lista de "arribos" con {linea, inMin, tag}
// Si la parada tiene un campo "proximas" lo usa, si no crea simulación.
function computeArrivalsForStop(stop, lineas) {
  const out = [];
  if (!stop) return out;

  // If stop has "proximas" array use it (expected: [{linea:"C1", tiempo:"ahora"},...])
  if (Array.isArray(stop.proximas) && stop.proximas.length) {
    for (const p of stop.proximas) {
      out.push({ linea: p.linea || '??', tiempo: p.tiempo || '—', raw: p });
    }
    return out;
  }

  // If stop has "lineas", create dummy arrivals (for demo)
  const lines = stop.lineas || stop.lines || [];
  const seed = (Number(String(stop.codigo).slice(-2)) || Math.floor(Math.random()*90));
  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const linea = lines[i];
    // generate pseudo-random minutes (so UI will vary)
    const m = ((seed + i*7) % 12) * 2;
    const tiempo = m === 0 ? 'ahora' : m;
    out.push({ linea, tiempo });
  }
  return out;
}

// Mostrar mapa pequeño: intentamos usar coordenadas si existen
function buildMapHTML(stop) {
  // Prefer lat/lon fields: lat, lon, latitude, longitude, coords
  let lat = stop && (stop.lat || stop.latitude || (stop.coords && stop.coords[0]));
  let lon = stop && (stop.lon || stop.longitude || (stop.coords && stop.coords[1]));
  if (!lat || !lon) {
    // placeholder small map / no coords
    return `<div style="padding:10px;background:#efefef;color:#111;border-radius:8px;">Ubicación no disponible</div>`;
  }
  lat = Number(lat); lon = Number(lon);
  // Insert a simple static map via openstreetmap embed (works if online).
  // If deployment blocks external frames, reemplazar por imagen o por Leaflet local.
  const iframe = `<iframe
    src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01}%2C${lat-0.01}%2C${lon+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lon}"
    style="border:1px solid #ccc;border-radius:8px;width:100%;height:240px;"></iframe>
    <div style="font-size:12px;margin-top:6px;color:#ccc;">Lat:${lat.toFixed(5)} Lon:${lon.toFixed(5)}</div>`;
  return iframe;
}

// ---------------- Export minimal API for pages ----------------
export {
  qs, loadJSON, PARADAS_URL, LINEAS_URL, BUSES_URL,
  GameState, findStopByCode, computeArrivalsForStop, nextArrivalLabel,
  buildMapHTML, formatLinesArray
};
