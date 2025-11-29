/*  datos.js  
 *  Archivo ÚNICO con toda la base de datos del juego:
 *  - paradas
 *  - buses
 *  - líneas
 *  - audios
 *  - reglas del mundo
 *  - configuraciones
 *  - opciones del mapa
 */

///////////////////////////////
// 🅿 PARADAS (ejemplo)
///////////////////////////////
const PARADAS = {
  "6620": {
    id:"6620",
    nombre:"Rúa de Policarpo Sanz, 40",
    coords:[42.2401,-8.7203],
    cercanas:["20198","14264"]
  },
  "20198":{
    id:"20198",
    nombre:"Rúa de Policarpo Sanz, 26",
    coords:[42.2389,-8.7201],
    cercanas:["6620","14264"]
  },
  "14264":{
    id:"14264",
    nombre:"Rúa de Urzáiz - Príncipe",
    coords:[42.2377,-8.7195],
    cercanas:["20198","8820"]
  },

  /* … aquí pegas TODAS tus paradas … */
};


///////////////////////////////
// 🚌 BUSES (ejemplo plantilla)
///////////////////////////////
const BUSES = {
  "6001": {
    id:"6001",
    modelo:"Solaris Urbino 12",
    capacidad:37,
    linea:"C1",
    color:"#0077cc",
    audioVehiculo:"audio/bus-solaris.mp3"
  },

  "6002": {
    id:"6002",
    modelo:"Mercedes Citaro",
    capacidad:29,
    linea:"C1",
    color:"#0055aa",
    audioVehiculo:"audio/bus-citaro.mp3"
  }

  /* … pegas los 300+ reales … */
};


///////////////////////////////
// 📘 LÍNEAS (ejemplo real)
///////////////////////////////
const LINEAS = {
  "C1": {
    id:"C1",
    nombre:"Circular Centro",
    tipo:"diurno",
    frecuencia:{
      laborables: 12,
      sabados: 15,
      festivos: 20,
      nocturno: null
    },
    paradas:["6620","20198","14264","14121","8820","20194"]
  },

  "L10":{
    id:"L10",
    nombre:"Sáians / Teis",
    tipo:"diurno",
    frecuencia:{
      laborables: 15,
      sabados: 20,
      festivos: 25,
      nocturno: null
    },
    paradas:["…"]
  }

  /* … pegas todas … */
};


///////////////////////////////
// 🔉 AUDIOS DEL JUEGO
///////////////////////////////
const AUDIOS = {

  // universales
  proxima:"https://raw.githubusercontent.com/.../proxima.mp3",
  locucion:"https://raw.githubusercontent.com/.../locucion.mp3",
  timbre:"https://raw.githubusercontent.com/.../timbre.mp3",

  // líneas (ejemplo)
  lineas:{
    C1:"https://raw.githubusercontent.com/.../C1.mp3",
    L10:"https://raw.githubusercontent.com/.../L10.mp3",
    L11:"https://raw.githubusercontent.com/.../L11.mp3"
  },

  // paradas (a medida que grabes)
  paradas:{
    "6620":"https://raw.githubusercontent.com/.../6620.mp3",
    "20198":"https://raw.githubusercontent.com/.../20198.mp3"
  }
};


///////////////////////////////
// ⚙ CONFIGURACIÓN DEL MUNDO
///////////////////////////////
const CONFIG = {

  horario:{
    // TODAS LAS PARTIDAS TIENEN EL MISMO
    tipo:"laborables",   // "sabados", "festivos", "nocturno"
  },

  refuerzos:{
    activarDesdePasajeros:35,
    prefijo:"R"  // todas las líneas que empiezan por R
  },

  modoLectivo:{
    activo:true,
    lineasLectivas:["U1","U2"]
  },

  PSA:{
    // Stellantis activa/desactiva PSA
    stellantisActiva:true,
    lineas:["PSA1","PSA4"]
  }

};


///////////////////////////////
// 🧭 MAPA DEL JUEGO
///////////////////////////////
const MAPA = {
  velocidadJugador:1.2,     // m/s
  distanciaAndarMax:0.5,    // km
  mostrarRutas:true
};


///////////////////////////////
// 📌 FUNCIONES ÚTILES
///////////////////////////////
function getParada(id){ return PARADAS[id] || null; }
function getBus(id){ return BUSES[id] || null; }
function getLinea(id){ return LINEAS[id] || null; }
function getAudioLinea(id){ return AUDIOS.lineas[id] || null; }
function getAudioParada(id){ return AUDIOS.paradas[id] || null; }

