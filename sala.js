/* ---------------------------
   MOTOR CENTRAL DE LA SALA
---------------------------- */

const iframe = document.getElementById("frame");
const LOADER = document.getElementById("loader");

function mostrarLoader() { LOADER.style.display = "flex"; }
function ocultarLoader() { LOADER.style.display = "none"; }

/* Estado global */
window.SALA = {
  modo: "local",
  jugadores: [
    { nombre:"Jugador 1", rol:"fugitivo" },
    { nombre:"Jugador 2", rol:"perseguidor" }
  ],
  reloj: Date.now(),   
  paradaActual: null,
  andandoA: null
};

/* ---------------------------
   ENVIAR EVENTO A UNA VISTA
---------------------------- */
function sendToView(evento){
  iframe.contentWindow.postMessage(evento, "*");
}

/* ---------------------------
   CAMBIAR A VISTA PARADA
---------------------------- */
function cargarParada(id){
  mostrarLoader();
  SALA.paradaActual = id;

  iframe.src = "parada.html";

  iframe.onload = () => {
    ocultarLoader();
    sendToView({
      tipo:"INIT_PARADA",
      data:{
        id,
        nombre:"Parada " + id,
        buses: generarBusesDemo(id),
        jugadores: SALA.jugadores
      }
    });
  };
}

/* ---------------------------
   CAMBIAR A VISTA BUS
---------------------------- */
function cargarBus(busId, linea){
  mostrarLoader();

  iframe.src = "bus.html";

  iframe.onload = () => {
    ocultarLoader();

    sendToView({
      tipo:"INIT_BUS",
      data:{
        busId,
        linea,
        jugadores:SALA.jugadores
      }
    });
  };
}

/* ---------------------------
   BUS DEMO (simulación)
---------------------------- */
function generarBusesDemo(id){
  return [
    { id:6001, linea:"L11", eta:"3 min" },
    { id:6002, linea:"C1", eta:"8 min" },
    { id:6003, linea:"27", eta:"ahora" }
  ];
}

/* ---------------------------
   RECEPCIÓN DE MENSAJES
---------------------------- */
window.addEventListener("message", e => {
  const { tipo, data } = e.data;

  // --- Parada pide coger bus ---
  if (tipo === "COGER_BUS") {
    cargarBus(data.busId, data.linea);
  }

  // --- Jugador pulsó timbre ---
  if (tipo === "TIMBRE") {
    sendToView({ tipo:"CONFIRM_TIMBRE" });
  }

  // --- Bus indica que se debe bajar ---
  if (tipo === "BAJAR_EN_PROXIMA") {
    cargarParada(data.parada);
  }

  // --- Caminar a otra parada ---
  if (tipo === "CAMINAR_A") {
    SALA.andandoA = data.destino;

    sendToView({ tipo:"CAMINANDO" });

    setTimeout(()=>{
      cargarParada(data.destino);
    }, 2000); // 2 segundos de demo, tú luego cambias tiempos reales
  }
});

/* ---------------------------
   INICIO AUTOMÁTICO
---------------------------- */
cargarParada(6620);
