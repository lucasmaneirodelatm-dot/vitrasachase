// logic.js - carga recursos, gestiona audio y simulador de llegadas
// Coloca este archivo en la misma carpeta que index.html y bus.html

/* CONFIG: audios.json URL (edítala si la mueves) */
const AUDIOS_JSON = 'audios.json';

/* Asset manager */
const ASSETS = {
  images: [
    // logos/loader (ya en index.html/img tags) pero por si quieres pre-cache:
    'https://raw.githubusercontent.com/lucasmaneirodelatm-dot/vitrasachase/refs/heads/main/Logo-principal.png',
    'https://raw.githubusercontent.com/lucasmaneirodelatm-dot/vitrasachase/refs/heads/main/logo_vitrasa.png'
  ],
  audios: [] // se cargan desde audios.json
};

let audioCatalog = {}; // map stopId -> url
let audioCache = {}; // Audio objects

// Preload images & audios (audios load after audios.json)
async function preloadAll() {
  // preload images
  await Promise.all(ASSETS.images.map(src => new Promise((res) => {
    const img = new Image();
    img.onload = res; img.onerror = res; img.src = src;
  })));

  // fetch audios.json
  try {
    const r = await fetch(AUDIOS_JSON + '?_=' + Date.now());
    if (r.ok) {
      const j = await r.json();
      audioCatalog = j;
      // preload common locutions (if present)
      const toPreload = [];
      if (j.locucion_proxima_parada) toPreload.push(j.locucion_proxima_parada);
      if (j.proxima_parada_text) toPreload.push(j.proxima_parada_text);
      // also preload stop audios (optional: we load lazily to save bandwidth)
      toPreload.forEach(url => {
        const a = new Audio(url);
        a.preload = 'auto';
        audioCache[url] = a;
      });
    }
  } catch(e){
    console.warn('No se ha podido cargar audios.json (está OK si aún no lo has subido).', e);
  }

  // signal ready to UI
  if (typeof window.assetsReady === 'function') window.assetsReady();
}

/* Public: play universal locución (e.g., "Próxima parada") */
async function playLocucion(filenameOrUrl) {
  // filenameOrUrl may be a raw URL or key in audioCatalog
  let url = filenameOrUrl;
  if (!/^(https?:)?\/\//.test(url) && audioCatalog[filenameOrUrl]) url = audioCatalog[filenameOrUrl];
  if (!url) return;
  try {
    let a = audioCache[url];
    if (!a) { a = new Audio(url); audioCache[url] = a; }
    await a.play().catch(()=>{ /* play blocked by browser until user gesture */ });
  } catch(e) { console.warn('Audio play failed', e); }
}

/* Public: play stop audio by stop id (if available) */
async function playStopAudio(stopId) {
  if (!audioCatalog || !audioCatalog.stops) return;
  const url = audioCatalog.stops[stopId];
  if (!url) return;
  try {
    let a = audioCache[url];
    if (!a) { a = new Audio(url); audioCache[url] = a; }
    await a.play().catch(()=>{ /* may be blocked */ });
  } catch(e){ console.warn('stop audio failed', e); }
}

/* Simulador de llegadas (muestra "1 min", "2 min", "ahora") */
/* - onArrivalChange(status) en la página recibirá los cambios. */
function simulateArrivals(stopId) {
  // Basic deterministic timeline for demo:
  const timeline = [
    {label: '5 min', isNow: false, t: 2000},
    {label: '2 min', isNow: false, t: 4000},
    {label: '1 min', isNow: false, t: 4000},
    {label: 'ahora', isNow: true, t: 0} // now stays until user action
  ];

  let i = 0;
  const step = () => {
    const s = timeline[Math.min(i, timeline.length-1)];
    if (typeof window.onArrivalChange === 'function') window.onArrivalChange(s);
    // if it's 'ahora' stop the automatic loop
    if (s.isNow) return;
    const delay = s.t || 3000;
    i++;
    setTimeout(step, delay);
  };
  step();
}

/* Helper to start local game: naviga a bus.html con params */
function startLocalGame(e) {
  e.preventDefault();
  const j1 = document.getElementById('local_j1').value.trim();
  const j2 = document.getElementById('local_j2').value.trim();
  if (!j1 || !j2) { alert('Pon nombre para los dos jugadores'); return false; }
  // no preguntar rol; en bus se elegirán posiciones
  const url = `bus.html?mode=local&j1=${encodeURIComponent(j1)}&j2=${encodeURIComponent(j2)}&role=fugitivo`;
  location.href = url;
  return false;
}

/* Helper to start IA game */
function startIAGame(e) {
  e.preventDefault();
  const role = document.getElementById('ia_role').value;
  const level = document.getElementById('ia_level').value;
  const name = document.getElementById('ia_name').value.trim();
  if (!name) { alert('Pon tu nombre'); return false; }
  // IA takes opposite role
  const url = `bus.html?mode=ia&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&level=${encodeURIComponent(level)}`;
  location.href = url;
  return false;
}

/* Public bindings */
window.startLocalGame = startLocalGame;
window.startIAGame = startIAGame;
window.playLocucion = playLocucion;
window.playStopAudio = playStopAudio;
window.simulateArrivals = simulateArrivals;

// launch preload
preloadAll();
