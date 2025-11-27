// game.js — lógica de sala / juego (juego.html)
(function(){
  document.addEventListener('DOMContentLoaded', async () => {
    // mostrar room title y roles
    const roomTitle = document.getElementById('roomTitle');
    const roleBadge = document.getElementById('roleBadge');
    const logEl = document.getElementById('log');

    // loader show/hide
    waitForResourcesThenShow();

    function log(msg){
      const p = document.createElement('div');
      p.textContent = (new Date()).toLocaleTimeString() + ' — ' + msg;
      logEl.prepend(p);
      console.log(msg);
    }

    // recuperar sala (si se inició desde local.html o ia.html)
    const sala = window.__sala || {modo:'local', jugadores:[{id:1,nombre:'Jugador',rol:'fugitivo'}]};
    window.__sala = sala; // aseguramos
    roomTitle.textContent = 'VITRASA CHASE — ' + (sala.modo || 'Partida');
    roleBadge.textContent = 'Roles: ' + sala.jugadores.map(j=> j.nombre + ' ('+j.rol+')').join(' • ');

    // cargar paradas (try fetch paradas.json, si no, usar fallback)
    let paradas = await safeFetchJson('/paradas.json');
    if (!paradas) {
      // fallback mínimo (ejemplo)
      paradas = {
        "6940": {nombre:"Praza de América (ejemplo)", coords:[42.2172, -8.7391]},
        "6620": {nombre:"Rúa de Policarpo Sanz, 40 (ejemplo)", coords:[42.2401, -8.7203]}
      };
      log('Usando paradas de fallback');
    }
    window.__paradas = paradas;

    // seleccionar parada aleatoria (clave)
    const keys = Object.keys(paradas);
    const randomStopId = keys[Math.floor(Math.random()*keys.length)];
    showParada(randomStopId);

    // simulación: crear lista de buses para esa parada
    function simulateBusesForStop(stopId){
      // probabilidad de que haya un bus "ahora"
      const buses = [];
      const nowProb = Math.random() < 0.35;
      for (let i=0;i<3;i++){
        const eta = nowProb && i===0 ? 'ahora' : ((i+1)*3) + ' min';
        buses.push({line: sampleLineName(), number: 6150 + i, eta, type: i===2 ? 'refuerzo' : 'normal'});
      }
      return buses;
    }

    function sampleLineName(){
      const ex = ['C1','L10','L11','N1','4A','5B','27','L9B'];
      return ex[Math.floor(Math.random()*ex.length)];
    }

    function renderBusList(buses){
      const container = document.getElementById('busList');
      container.innerHTML = '<h4>Autobuses próximos</h4>';
      buses.forEach(b=>{
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<strong>${b.line} — ${b.number}</strong> · ${b.eta} ${b.type==='refuerzo'?'<em>refuerzo</em>':''}
                         <div style="margin-top:8px;">
                           ${b.eta === 'ahora' ? '<button class="btn small boardNow" data-line="'+b.line+'" data-number="'+b.number+'">🛑 Coger</button>' : ''}
                         </div>`;
        container.appendChild(div);
      });

      // attach events to boardNow
      document.querySelectorAll('.boardNow').forEach(btn=>{
        btn.addEventListener('click', (ev)=>{
          const line = btn.dataset.line;
          const number = btn.dataset.number;
          log('Pulsado Coger — linea ' + line + ' #' + number);
          // Acción: abrir bus.html en un iframe o ventana y notificar boarding
          openBusWindow({line, number});
        });
      });
    }

    // mostrar parada
    function showParada(stopId){
      const p = paradas[stopId] || {nombre:'Parada ' + stopId};
      document.getElementById('paradaInfo').innerHTML = `<strong>${p.nombre}</strong> · ID: ${stopId}`;
      // render map placeholder
      renderMap(stopId);
      // simular buses
      const buses = simulateBusesForStop(stopId);
      renderBusList(buses);
    }

    function renderMap(stopId){
      const mp = document.getElementById('mapPlaceholder');
      const p = paradas[stopId] || {nombre:'Parada '+stopId};
      const players = sala.jugadores || [];
      mp.innerHTML = `<strong>Mapa (simulado)</strong>
        <div>Parada: ${p.nombre}</div>
        <div>Jugadores en la parada: ${players.map(x=>x.nombre+' ('+(x.rol||'--')+')').join(', ')}</div>`;
    }

    // timbre: marcar variable global y notificar buses si es necesario
    document.getElementById('timbreBtn').addEventListener('click', ()=> {
      window.__willRequestStop = true;
      log('Timbre pulsado — solicitar bajada en la próxima parada (flag marcado)');
      // enviar mensaje a iframe bus si existe
      const busFrame = document.getElementById('busFrame');
      if (busFrame && busFrame.contentWindow) {
        busFrame.contentWindow.postMessage({type:'request_stop', playerId: sala.jugadores[0]?.id || null}, '*');
      }
    });

    // abrir bus en nueva ventana (simulación simple)
    function openBusWindow({line, number}){
      const w = window.open('bus.html?bus='+number, 'bus_'+number, 'width=520,height=520');
      // después de abrir, cuando esté listo, enviar mensaje "board"
      const onMessage = (ev) => {
        if (ev.data && ev.data.type === 'register_bus' && ev.data.bus === String(number)) {
          // bus registered; enviar boarding
          log('Bus registrado, enviando boarding.');
          ev.source.postMessage({type:'board', player: sala.jugadores[0] || {nombre:'Jugador'}}, '*');
        } else if (ev.data && ev.data.type === 'boarded') {
          log('Respuesta del bus: boarded, capacidad restante: ' + ev.data.capacityLeft);
        } else if (ev.data && ev.data.type === 'confirm_stop') {
          log('Bus confirma petición de parada recibida.');
        } else if (ev.data && ev.data.type === 'left_bus') {
          log('Usuario ha salido del bus (evento recibido). Actualizando parada...');
          // tras bajada, mostrar nueva parada aleatoria
          const keys = Object.keys(paradas);
          const newStop = keys[Math.floor(Math.random()*keys.length)];
          showParada(newStop);
        }
      };
      window.addEventListener('message', onMessage, {once:false});
      // Envío posterior desde sala al bus: el bus.html escucha mensajes y responderá
    }

    // exit button
    document.getElementById('exitBtn').addEventListener('click', ()=> location.href = 'index.html');

    // Nota: también podrías abrir bus.html dentro de un iframe #busFrame para comunicación directa.
    log('Sala inicializada. Parada seleccionada aleatoria: mostrada.');
  }); // DOMContentLoaded end
})();
