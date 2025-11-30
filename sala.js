// sala_logic.js
// Sala central: mantiene estado, carga parada/bus en iframe, pasa mensajes entre sala y el iframe.
// Roles: fugitivo / perseguidor — ambos en sessionStorage.vch_room

(function(){
  function log(txt){
    const el = document.getElementById('log');
    const p = document.createElement('div');
    p.textContent = new Date().toLocaleTimeString() + ' — ' + txt;
    el.prepend(p);
    console.log(txt);
  }

  const raw = sessionStorage.getItem('vch_room');
  if(!raw){
    alert('No hay sala activa. Volviendo al menú.');
    window.location.href = 'index.html';
    return;
  }
  const sala = JSON.parse(raw);
  document.getElementById('mode').textContent = sala.modo;
  document.getElementById('players').textContent = sala.jugadores.map(p=>p.nombre + '('+p.rol+')').join(' | ');

  // cargamos paradas.json desde /api/paradas
  async function loadParadas(){
    try {
      const r = await fetch('/api/paradas');
      if(!r.ok) throw new Error('no paradas');
      const data = await r.json();
      // si data es obj id->info convertimos a arreglo
      const arr = Array.isArray(data) ? data : Object.keys(data).map(k => ({id:k, ...data[k]}));
      return arr;
    } catch(e){
      log('No pude cargar paradas.json — usando lista mínima.');
      return [
        {id:'6940', name:'Praza de América (ejemplo)'},
        {id:'6620', name:'R. Policarpo Sanz, 40 (ejemplo)'}
      ];
    }
  }

  let paradasCache = [];
  const frame = document.getElementById('remoteFrame');

  // recibir mensajes del iframe (parada/bus)
  window.addEventListener('message', (ev)=>{
    const d = ev.data || {};
    if(d.type === 'request_bus_caught'){
      log(`Jugador ${d.player||'--'} ha cogido bus ${d.bus||'--'}`);
      // reenviar a iframe confirmación
      frame.contentWindow.postMessage({type:'confirm_boarding', bus:d.bus}, '*');
    }
    if(d.type === 'request_get_parada'){
      // iframe pide datos de parada (id)
      const found = paradasCache.find(p=>p.id === d.id) || paradasCache[0];
      frame.contentWindow.postMessage({type:'parada_data', parada:found}, '*');
    }
    if(d.type === 'log') log('[FRAME] '+d.msg);
  });

  async function init(){
    paradasCache = await loadParadas();
    // boton para elegir parada aleatoria
    document.getElementById('randomParada').addEventListener('click', ()=>{
      const p = paradasCache[Math.floor(Math.random()*paradasCache.length)];
      loadParadaInFrame(p.id);
    });
    document.getElementById('leave').addEventListener('click', ()=> window.location.href='index.html');

    // al abrir la sala vamos a una parada aleatoria
    const p = paradasCache[Math.floor(Math.random()*paradasCache.length)];
    loadParadaInFrame(p.id);
    log('Sala inicializada. Parada ' + (p.name || p.id));
  }

  function loadParadaInFrame(paradaId){
    // cargamos parada_template.html?id=6940 (el iframe lo leerá y pedirá los datos)
    frame.src = `parada_template.html?id=${encodeURIComponent(paradaId)}`;
    log('Cargando parada en iframe: ' + paradaId);
  }

  init();

})();
