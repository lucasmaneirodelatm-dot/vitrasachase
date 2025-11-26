cat > logic.js <<'EOF'
/* FIX DEFINITIVO LOADER */
document.addEventListener("DOMContentLoaded", () => {
  const interval = setInterval(() => {
    // Aquí puedes añadir más comprobaciones si quieres
    hideLoaderShowMain();  // <— muestra el main y oculta loader SIEMPRE
    clearInterval(interval);
  }, 150); // espera pequeño para asegurar que DOM está listo
});
/*
  logic.js
  - loader: permanece hasta que recursos mínimos cargan (imágenes + audios si existen)
  - funciones para: inicar sala local, iniciar contra IA, seleccionar parada aleatoria, mostrar lista de buses, "ahora" => botón Coger
  - comportamiento simplificado y expandible
*/

const DEFAULT_PARADAS = [
 {
  "20": { "nombre": "Rúa do Abade de Juan de Bastos(fronte Asociación Veciños)", "coords": [42.187231, -8.741008] },
  "40": { "nombre": "- Rúa do Abade Juan de Bastos (cruce Baixada da Moo)", "coords": [42.191297, -8.731706] },
  "50": { "nombre": "- Rúa do Abade Juan de Bastos, 24", "coords": [42.187978, -8.737403] },
  "70": { "nombre": "- Rúa da Lagoa (cruce Camiño do Casmarcelo)", "coords": [42.201243, -8.703025] },
  "80": { "nombre": "- Rúa da Lagoa, 46", "coords": [42.201192, -8.703497] },
  "90": { "nombre": "- Aeroporto de Peinador", "coords": [42.225891, -8.633242] },
  "100": { "nombre": "- Avda. do Alcalde Lavadores, 125", "coords": [42.218988, -8.696379] },
  "110": { "nombre": "- Avda. do Alcalde Lavadores, 171", "coords": [42.215542, -8.697041] },
  "120": { "nombre": "- Avda. do Alcalde Lavadores, 8", "coords": [42.223074, -8.701765] },
  "130": { "nombre": "- Avda. do Alcalde Lavadores, 102", "coords": [42.218758, -8.696760] },
  "140": { "nombre": "- Avda. do Alcalde Lavadores, 29", "coords": [42.223533, -8.699710] },
  "150": { "nombre": "- Avda. do Alcalde Lavadores, 48", "coords": [42.222697, -8.697682] },
  "160": { "nombre": "- Avda. do Alcalde Lavadores, 67", "coords": [42.222866, -8.697647] },
  "170": { "nombre": "- Avda. do Alcalde Lavadores, 152", "coords": [42.215254, -8.697283] },
  "180": { "nombre": "- Estrada de Valadares, 451", "coords": [42.165894, -8.720551] },
  "190": { "nombre": "- Rúa de Ángel de Lema, 58", "coords": [42.250485, -8.685685] },
  "195": { "nombre": "- Rúa de Ángel de Lema, 247", "coords": [42.256697, -8.677912] },
  "200": { "nombre": "- Rúa de Ángel de Lema, 100", "coords": [42.252502, -8.683413] },
  "210": { "nombre": "- Rúa de Ángel de Lema, 140", "coords": [42.255835, -8.678907] },
  "220": { "nombre": "- Rúa de Ángel de Lema, 163", "coords": [42.256635, -8.677858] },
  "230": { "nombre": "- Rúa de Ángel de Lema, 14", "coords": [42.248017, -8.691476] },
  "240": { "nombre": "- Rúa de Ángel de Lema, 19", "coords": [42.248120, -8.691521] },
  "250": { "nombre": "- Rúa de Ángel de Lema, 221", "coords": [42.255343, -8.679875] },
  "260": { "nombre": "- Rúa de Ángel de Lema, 91", "coords": [42.250262, -8.686058] },
  "270": { "nombre": "- Rúa de Desiderio Pernas Arquitecto, 1", "coords": [42.192981, -8.800328] },
  "280": { "nombre": "- Rúa do Arquitecto Antonio Cominges, 38", "coords": [42.189497, -8.808519] },
  "290": { "nombre": "- Rúa do Arquitecto Gómez Román, 37", "coords": [42.189978, -8.804603] },
  "310": { "nombre": "- Rúa do Arquitecto Antonio Cominges, 4", "coords": [42.190873, -8.804010] },
  "320": { "nombre": "- Rúa do Arquitecto Antonio Cominges, 70", "coords": [42.189209, -8.812172] },
  "330": { "nombre": "- Rúa do Arquitecto Antonio Cominges, 90", "coords": [42.187244, -8.813385] },
  "340": { "nombre": "- Rúa de Aragón, 116", "coords": [42.238716, -8.701644] },
  "350": { "nombre": "- Rúa de Aragón, 162", "coords": [42.240571, -8.700617] },
  "360": { "nombre": "- Rúa de Aragón, 193", "coords": [42.240188, -8.701268] },
  "370": { "nombre": "- Rúa de Aragón, 212", "coords": [42.241834, -8.698994] },
  "380": { "nombre": "- Rúa de Aragón, 221", "coords": [42.242058, -8.699249] },
  "390": { "nombre": "- Rúa de Aragón, 26", "coords": [42.233017, -8.702832] },
  "400": { "nombre": "- Rúa de Aragón, 91", "coords": [42.234321, -8.702556] },
  "410": { "nombre": "- Rúa de Aragón, 82", "coords": [42.235179, -8.701743] },
  "420": { "nombre": "- Rúa de Aragón, 147", "coords": [42.236307, -8.701531] },
  "430": { "nombre": "- Rúa do Areal (Aduana)", "coords": [42.239387, -8.720398] },
  "530": { "nombre": "- Avda. de Ricardo Mella (Estación Coruxo)", "coords": [42.193691, -8.781882] },
  "540": { "nombre": "- Avda. de Ricardo Mella (fronte 223)", "coords": [42.189539, -8.791080] },
  "560": { "nombre": "- Avda. de Ricardo Mella, 518", "coords": [42.180896, -8.807988] },
  "570": { "nombre": "- Avda. de Ricardo Mella, 250", "coords": [42.194974, -8.776432] },
  "580": { "nombre": "- Avda. de Ricardo Mella, 135", "coords": [42.195831, -8.773983] },
  "600": { "nombre": "- Avda. de Ricardo Mella, 273", "coords": [42.189720, -8.801269] },
  "620": { "nombre": "- Avda. de Ricardo Mella, 165", "coords": [42.193597, -8.781815] },
  "630": { "nombre": "- Avda. de Ricardo Mella, 223", "coords": [42.189416, -8.790865] },
  "650": { "nombre": "- Avda. de Ricardo Mella, 289", "coords": [42.181057, -8.807881] },
  "660": { "nombre": "- Avda. do Alcalde Portanet, 34", "coords": [42.211532, -8.736717] },
  "680": { "nombre": "- Avda. do Aeroporto (Aeroclub)", "coords": [42.228918, -8.634465] },
  "690": { "nombre": "- Avda. do Aeroporto, 656", "coords": [42.233106, -8.643542] },
  "700": { "nombre": "- Avda. do Aeroporto (Colexio)", "coords": [42.228723, -8.633873] },
  "710": { "nombre": "- Rúa de Aragón (Instituto)", "coords": [42.232435, -8.702403] },
  "720": { "nombre": "- Avda. do Aeroporto, 215", "coords": [42.237666, -8.684049] },
  "730": { "nombre": "- Avda. do Aeroporto, 130", "coords": [42.231336, -8.690625] },
  "740": { "nombre": "- Avda. do Aeroporto, 181", "coords": [42.233529, -8.687383] },
  "750": { "nombre": "- Avda. do Aeroporto, 184", "coords": [42.233013, -8.687570] },
  "760": { "nombre": "- Avda. do Aeroporto, 240", "coords": [42.237340, -8.683797] },
  "770": { "nombre": "- Avda. do Aeroporto, 273", "coords": [42.238752, -8.681106] },
  "780": { "nombre": "- Avda. do Aeroporto, 298", "coords": [42.238383, -8.680728] },
  "790": { "nombre": "- Avda. do Aeroporto, 325", "coords": [42.237369, -8.676072] },
  "800": { "nombre": "- Avda. do Aeroporto, 328", "coords": [42.237690, -8.677273] },
  "810": { "nombre": "- Avda. do Aeroporto, 350", "coords": [42.234739, -8.674387] },
  "820": { "nombre": "- Avda. do Aeroporto, 377", "coords": [42.234617, -8.670552] },
  "830": { "nombre": "- Avda. do Aeroporto, 378", "coords": [42.234538, -8.671584] },
  "840": { "nombre": "- Avda. do Aeroporto, 43", "coords": [42.234911, -8.699469] },
  "850": { "nombre": "- Avda. do Aeroporto, 423", "coords": [42.236268, -8.666086] },
  "860": { "nombre": "- Avda. do Aeroporto, 446", "coords": [42.235386, -8.667003] },
  "870": { "nombre": "- Avda. do Aeroporto, 447", "coords": [42.235350, -8.662224] },
  "880": { "nombre": "- Avda. do Aeroporto, 484", "coords": [42.235165, -8.662046] },
  "890": { "nombre": "- Avda. do Aeroporto, 491", "coords": [42.232020, -8.654078] },
  "900": { "nombre": "- Avda. do Aeroporto, 531", "coords": [42.233650, -8.648560] },
  "910": { "nombre": "- Avda. do Aeroporto, 54", "coords": [42.234713, -8.699643] },
  "920": { "nombre": "- Avda. do Aeroporto (cruce Camiño das Cereixeiras)", "coords": [42.233424, -8.643681] },
  "930": { "nombre": "- Avda. do Aeroporto, 570", "coords": [42.231873, -8.654051] },
  "940": { "nombre": "- Avda. do Aeroporto, 605", "coords": [42.230471, -8.638532] },
  "950": { "nombre": "- Avda. do Aeroporto, 614", "coords": [42.233344, -8.648703] },
  "960": { "nombre": "- Avda. do Aeroporto, 686", "coords": [42.230806, -8.638875] },
  "970": { "nombre": "- Avda. do Aeroporto, 91", "coords": [42.232300, -8.693098] },
  "980": { "nombre": "- Avda. da Atlántida, 99", "coords": [42.221265, -8.764220] },
  "990": { "nombre": "- Avda. da Atlántida (fronte 148)", "coords": [42.222514, -8.769529] },
  "1000": { "nombre": "- Avda. da Atlántida, 109", "coords": [42.221279, -8.767329] },
  "1010": { "nombre": "- Avda. da Atlántida, 136", "coords": [42.221600, -8.767827] },
  "1020": { "nombre": "- Avda. da Atlántida, 150", "coords": [42.222601, -8.769418] },
  "1030": { "nombre": "- Avda. da Atlántida, 25", "coords": [42.223138, -8.755173] },
  "1040": { "nombre": "- Avda. da Atlántida, 32", "coords": [42.223084, -8.756345] },
  "1050": { "nombre": "- Avda. da Atlántida, 71", "coords": [42.221745, -8.758648] },
  "1060": { "nombre": "- Avda. da Atlántida, 84", "coords": [42.221779, -8.760457] },
  "1070": { "nombre": "- Avda. da Atlántida, 114", "coords": [42.221128, -8.765373] },
  "1110": { "nombre": "- Praza Ribeira do Berbés", "coords": [42.237362, -8.730046] },
  "1120": { "nombre": "- Avda. de Beiramar (fronte Casa do Mar)", "coords": [42.234147, -8.733873] },
  "1130": { "nombre": "- Avda. de Beiramar (Peiraos auxiliares)", "coords": [42.231311, -8.735587] },
  "1140": { "nombre": "- Avda. de Beiramar (Freire)", "coords": [42.224999, -8.748003] },
  "1150": { "nombre": "- Rúa da Ribeira do Berbés", "coords": [42.237362, -8.730046] },
  "1160": { "nombre": "- Avda. de Beiramar (Sto. Domingo)", "coords": [42.224687, -8.741842] },
  "1200": { "nombre": "Rúa de Cánovas del Castillo, 28", "coords": [42.2358, -8.7189] },
  "8470": { "nombre": "Rúa do Conde de Torrecedeira, 21", "coords": [42.2362, -8.7242] },
  "8450": { "nombre": "Rúa do Conde de Torrecedeira (Parque)", "coords": [42.2350, -8.7261] },
  "6930": { "nombre": "Praza de América, 1", "coords": [42.2172, -8.7391] }
  "6620": { "nombre": "Rúa de Policarpo Sanz, 40", "coords": [42.2401, -8.7203] },
  "20198": { "nombre": "Rúa de Policarpo Sanz, 26", "coords": [42.2389, -8.7201] },
  "14264": { "nombre": "Rúa de Urzáiz - Príncipe", "coords": [42.2377, -8.7195] },
  "14121": { "nombre": "Rúa da Reconquista, 2", "coords": [42.2372, -8.7208] },
  "8820": { "nombre": "Rúa de Urzáiz, 28", "coords": [42.2365, -8.7202] },
  "20194": { "nombre": "Rúa de Cánovas del Castillo, 28", "coords": [42.2358, -8.7189] },
  "8470": { "nombre": "Rúa do Conde de Torrecedeira, 21", "coords": [42.2362, -8.7242] },
  "8450": { "nombre": "Rúa do Conde de Torrecedeira (Parque)", "coords": [42.2350, -8.7261] },
  "6930": { "nombre": "Praza de América, 1", "coords": [42.2172, -8.7391] }
];

function resourcesLoaded() {
  // si quieres agregar lógicas de carga de audio/imagenes, hazlo aquí.
  return true;
}

function hideLoaderShowMain() {
  document.querySelectorAll('.loader').forEach(l=>l.classList.add('hidden'));
  document.querySelectorAll('#main').forEach(m=>m.classList.remove('hidden'));
}

function showLoader() {
  document.querySelectorAll('.loader').forEach(l=>l.classList.remove('hidden'));
  document.querySelectorAll('#main').forEach(m=>m.classList.add('hidden'));
}

/* Inicialización común para cada página */
document.addEventListener('DOMContentLoaded', ()=> {
  // Esperar a que recursos estén "listos"
  if (resourcesLoaded()) {
    // quitar loader en cuanto DOM listo y recursos ok
    setTimeout(hideLoaderShowMain, 100); // sin texto ni porcentaje
  }

  // Index: no tiene forms aquí; local/ia tienen botones con ids
  const startLocal = document.getElementById('startLocal');
  if (startLocal) {
    startLocal.onclick = () => {
      const p1 = document.getElementById('p1').value || 'Fugitivo';
      const p2 = document.getElementById('p2').value || 'Perseguidor';
      startRoomLocal({players:[{name:p1,role:'fugitivo'},{name:p2,role:'perseguidor'}]});
    };
  }

  const startIA = document.getElementById('startIA');
  if (startIA) {
    startIA.onclick = () => {
      const name = document.getElementById('ia_name').value || 'Jugador';
      const role = document.getElementById('ia_role').value || 'fugitivo';
      const level = document.getElementById('ia_level').value || 'normal';
      startRoomIA({player:{name,role}, iaLevel:level});
    };
  }

  // Back / exit handlers (mostrados en local/ia views)
  document.querySelectorAll('#back, #exit').forEach(btn=>{
    if(btn) btn.onclick = ()=> window.location.href = 'index.html';
  });

  // botones dentro de game.html (cuando se usa)
  const timbreBtn = document.getElementById('timbreBtn');
  if (timbreBtn) {
    timbreBtn.onclick = ()=> {
      log('Timbre pulsado: solicitar bajada en próxima parada');
      // marca para bajar; la lógica del bus comprobará y provocará "bajar"
      window.__willRequestStop = true;
    };
  }

  const cogerBtn = document.getElementById('cogerBtn');
  if (cogerBtn) {
    cogerBtn.onclick = ()=> {
      log('Has cogido el bus. Cargando... (se muestra loader breve)');
      showLoader();
      setTimeout(()=> {
        hideLoaderShowMain();
        log('Estás dentro del bus. Cuando timbres, se activará bajada.');
        // dentro del bus: simulamos avance
        simulateBusRide();
      }, 800);
    };
  }
});

/* Utilities */
function log(txt) {
  const el = document.getElementById('log');
  if (el) {
    const p = document.createElement('div'); p.textContent = (new Date()).toLocaleTimeString() + ' — ' + txt;
    el.prepend(p);
  } else console.log(txt);
}

/* Sala local */
function startRoomLocal({players}) {
  // guardamos basic roles
  window.__room = {mode:'local', players};
  window.location.href = 'game.html';
}

/* Sala IA */
function startRoomIA({player, iaLevel}) {
  window.__room = {mode:'ia', players:[player, {name:'IA', role: player.role === 'fugitivo' ? 'perseguidor' : 'fugitivo', ai:true, level:iaLevel}]};
  window.location.href = 'game.html';
}

/* Cuando game.html está abierto, inicializamos la sala */
if (location.pathname.endsWith('game.html')) {
  document.addEventListener('DOMContentLoaded', ()=> {
    // cargar paradas (si existe paradas.json, lo intentamos)
    fetch('paradas.json').then(r=>{
      if (!r.ok) throw new Error('no paradas.json');
      return r.json();
    }).catch(()=> {
      return DEFAULT_PARADAS;
    }).then(paradas=>{
      window.__paradas = paradas;
      initGameRoom();
    });
  });
}

function initGameRoom() {
  const title = document.getElementById('title');
  if (window.__room && window.__room.players) {
    title.textContent = 'VITRASA CHASE — ' + (window.__room.mode || 'Partida');
    document.getElementById('roomTitle')?.textContent = title.textContent;
  }

  // selecciona parada aleatoria
  const parada = pickRandom(window.__paradas);
  showParada(parada);

  // crear lista de buses (simulada)
  const simulated = simulateBusesForParada(parada);
  renderBusList(simulated);

  // mostrar mapa placeholder con players si existen
  renderMap(parada);
}

function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function showParada(parada) {
  const p = document.getElementById('paradaInfo');
  if (!p) return;
  p.innerHTML = `<h3>Parada: ${parada.id} — ${parada.name}</h3>`;
}

function simulateBusesForParada(parada) {
  // genera 3 buses de ejemplo; uno puede estar "ahora"
  const nowIndex = Math.random() < 0.4 ? 0 : 1; // 40% probabilidad que haya uno "ahora"
  const buses = [];
  for (let i=0;i<3;i++){
    const eta = i===nowIndex ? 'ahora' : ( (i+1)*3 ) + ' min';
    buses.push({line: sampleLineName(), number: 6000 + i, eta, type: i===2 ? 'refuerzo' : 'normal'});
  }
  return buses;
}

function sampleLineName() {
  const ex = ['C1','L10','L11','N1','4A','5B','27'];
  return ex[Math.floor(Math.random()*ex.length)];
}

function renderBusList(buses){
  const container = document.getElementById('busList');
  if (!container) return;
  container.innerHTML = '<h4>Buses próximos</h4>';
  buses.forEach(b=>{
    const d = document.createElement('div'); d.className='bus';
    d.innerHTML = `<strong>${b.line} (${b.number})</strong> — ${b.eta} ${b.type==='refuerzo'?'<em>refuerzo</em>':''}`;
    container.appendChild(d);
    if (b.eta === 'ahora') {
      // mostrar botón coger
      const coger = document.getElementById('cogerBtn');
      if (coger) coger.classList.remove('hidden');
    }
  });
}

function renderMap(parada){
  const mp = document.getElementById('mapPlaceholder');
  if (!mp) return;
  const players = (window.__room && window.__room.players) ? window.__room.players : [{name:'Jugador'}];
  mp.innerHTML = `<strong>Mapa</strong><div>Parada seleccionada: ${parada.name}</div><div>Jugadores en la parada: ${players.map(p=>p.name+' ('+(p.role||'--')+')').join(', ')}</div>`;
}

/* Simulación simple de viaje en bus */
function simulateBusRide(){
  log('Bus en marcha — simulación de paradas: 3 paradas en 9s (demo)');
  let stop=0;
  const iv = setInterval(()=>{
    stop++;
    log('Próxima parada nº '+stop);
    // si el jugador pidió timbre
    if (window.__willRequestStop) {
      log('Has solicitado bajar — te bajas en esta parada.');
      window.__willRequestStop = false;
      clearInterval(iv);
      // mostrar parada a la que ha bajado
      const p = pickRandom(window.__paradas);
      showParada(p);
      renderMap(p);
      return;
    }
    if (stop>=3) {
      log('Fin del trayecto simulado.');
      clearInterval(iv);
    }
  }, 3000);
}
EOF
