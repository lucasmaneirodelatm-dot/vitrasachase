// Sala global
let SALA = {
  modo:null,
  jugadores:[],
  ia:null,
  estado:"parada",
  paradaActual:null,
  busActual:null
};

document.addEventListener("DOMContentLoaded", () => {

  if(window.__salaLocal){
    SALA = window.__salaLocal;
  }
  if(window.__salaIA){
    SALA = window.__salaIA;
  }

  initSala();
});

function initSala(){
  document.getElementById("roomTitle").textContent =
    `Sala — ${SALA.modo === "local" ? "Juego Local" : "Contra IA"}`;

  cargarParadaAleatoria();
}

function cargarParadaAleatoria(){
  const ids = Object.keys(PARADAS);
  const parada = PARADAS[randomItem(ids)];

  SALA.paradaActual = parada;
  SALA.estado = "parada";

  mostrarParada();
}

function mostrarParada(){
  const p = SALA.paradaActual;

  document.getElementById("paradaInfo").innerHTML =
    `<h3>Parada ${p.id}</h3><p>${p.nombre}</p>`;

  // Caminar
  let html = "";
  p.cercanas.forEach(c=>{
    const pa = PARADAS[c];
    html += `<button class="btn small" onclick="irAPie('${c}')">🚶 ${pa.nombre}</button>`;
  });
  document.getElementById("paradasCercanas").innerHTML = html;

  // Buses
  const buses = simularBuses(p);
  renderBuses(buses);

  // Bloques visibles/invisibles
  document.getElementById("paradaBlock").classList.remove("hidden");
  document.getElementById("busBlock").classList.add("hidden");
}

function renderBuses(lista){
  const div = document.getElementById("busList");
  div.innerHTML = "";

  lista.forEach(b=>{
    const el = document.createElement("div");
    el.className = "busRow";
    el.innerHTML = `
      <strong>${b.linea}</strong> (${b.numero}) — ${b.eta}
    `;
    div.appendChild(el);

    if(b.eta === "ahora"){
      const btn = document.getElementById("cogerBtn");
      btn.classList.remove("hidden");
      btn.onclick = ()=> cogerBus(b);
    }
  });
}

function simularBuses(){
  const out = [];

  const names = Object.keys(LINEAS);
  let now = Math.random() < 0.5;

  for(let i=0;i<3;i++){
    out.push({
      numero:6000+i,
      linea:randomItem(names),
      eta: i===0 && now ? "ahora" : (3+i*2)+" min"
    });
  }
  return out;
}

function cogerBus(b){
  SALA.estado="bus";
  SALA.busActual=b;
  mostrarBus();
}

function mostrarBus(){
  const b = SALA.busActual;

  document.getElementById("busTitle").textContent =
    `Bus ${b.numero} — Línea ${b.linea}`;

  document.getElementById("busInfo").textContent =
    `Próxima parada en 6 segundos…`;

  document.getElementById("paradaBlock").classList.add("hidden");
  document.getElementById("busBlock").classList.remove("hidden");

  setTimeout(()=>{
    bajarEnParadaAleatoria();
  },6000);
}

function bajarEnParadaAleatoria(){
  SALA.busActual=null;
  cargarParadaAleatoria();
}

function irAPie(id){
  SALA.paradaActual = PARADAS[id];
  mostrarParada();
}
