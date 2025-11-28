// sala.js — lógica principal del juego

window.sala = {
  jugadores: [],
  modo:"local",
  vista:"parada",
  paradaActual:null,
  busActual:null,
  pedirBajada:false
};


/* CAMBIAR VISTA */
window.cargarVista = async function(tipo, datos={}){
  const cont = document.getElementById("vista");
  if (!cont) return;

  if (tipo === "parada"){
    sala.vista = "parada";
    sala.paradaActual = datos;

    cont.innerHTML = `
      <div class="card">
        <h2>🅿 Parada ${datos.id}</h2>
        <p>${datos.nombre}</p>

        <div id="busList"></div>

        <div class="walk-box">
          <strong>🚶 Caminar</strong>
          <p>Ejemplo: paradas cercanas:</p>
          <button class="btn" onclick="caminarA('001')">→ Parada 001</button>
          <button class="btn" onclick="caminarA('002')">→ Parada 002</button>
        </div>
      </div>
    `;

    renderBusesParada();

  } else if (tipo === "bus"){

    sala.vista = "bus";
    sala.busActual = datos;
    sala.pedirBajada = false;

    cont.innerHTML = `
      <div class="card">
        <h2>🚌 Bus ${datos.linea} — ${datos.num}</h2>
        <p>Tipo: ${datos.tipo}</p>

        <div id="proxima"></div>

        <button class="timbre-btn" onclick="tocarTimbre()">🔔 Timbrar</button>
      </div>
    `;

    simularBus();

  }
};

/* PARADAS CERCANAS (placeholder) */
window.caminarA = function(id){
  let nueva = {
    id,
    nombre:"Parada "+id
  };
  cargarVista("parada", nueva);
};

/* TOCAR TIMBRE */
window.tocarTimbre = function(){
  sala.pedirBajada = true;
  playClip("https://raw.githubusercontent.com/lucasmaneirodelatm-dot/vitrasachase/refs/heads/main/timbre.mp3");
};

/* SIMULAR BUSES */
window.renderBusesParada = function(){
  const o = document.getElementById("busList");
  if (!o) return;

  let buses = [
    { linea:"L10", num:8425, eta:"3 min", tipo:"normal" },
    { linea:"C1", num:6002, eta:"ahora", tipo:"normal" },
    { linea:"L11", num:2310, eta:"8 min", tipo:"refuerzo" }
  ];

  o.innerHTML = ``;

  buses.forEach(b=>{
    const div = document.createElement("div");
    div.className="parada-box";
    div.innerHTML = `
      <strong>${b.linea} (${b.num})</strong> — ${b.eta}
      ${b.eta==="ahora" ? `<br><button class="btn" onclick="subirBus(${b.num}, '${b.linea}')">Coger bus</button>` : "" }
    `;
    o.appendChild(div);
  });
};

window.subirBus = function(num, linea){
  cargarVista("bus", {num, linea, tipo:"normal"});
};

/* SIMULAR BUS */
window.simularBus = function(){
  const el = document.getElementById("proxima");
  if (!el) return;

  let n = 0;
  let interval = setInterval(()=>{

    if (sala.pedirBajada){
      clearInterval(interval);
      cargarVista("parada", {id:"X"+Math.floor(Math.random()*999), nombre:"Parada aleatoria"});
      return;
    }

    n++;
    el.innerHTML = `<p>Próxima parada: ${n}</p>`;

    if (n >= 3){
      clearInterval(interval);
      cargarVista("parada", {id:"F"+Math.floor(Math.random()*999), nombre:"Fin de trayecto"});
    }

  }, 3000);
};
