// datos.js
// ================================
//  HOJAS DE RUTA Y HORARIOS FIJOS
// ================================

// HORA VIRTUAL: los HTML la irán incrementando automáticamente
let reloj = 0; // en minutos virtuales desde el inicio

// BUSES DEFINIDOS
const BUSES = {
  "BUS1": {
    id: "BUS1",
    linea: "C1",
    ruta: ["6620", "20198", "14264", "14121", "8820", "20194"], // paradas en orden
    frecuencia: 10, // minutos
    inicio: 0 // empieza a las 00:00 virtuales
  },
  "BUS2": {
    id: "BUS2",
    linea: "L11",
    ruta: ["5000", "5001", "5002", "5003"],
    frecuencia: 12,
    inicio: 3
  }
};

// ========================================
// CÁLCULO DE EN QUÉ PARADA ESTÁ UN BUS
// ========================================
function paradaActual(bus, minuto){
  const ciclo = Math.floor((minuto - bus.inicio) / bus.frecuencia);
  if (ciclo < 0) return null;
  const pos = ciclo % bus.ruta.length;
  return bus.ruta[pos];
}

// ========================================
// TIEMPO QUE FALTA PARA QUE UN BUS PASE
// ========================================
function eta(bus, paradaId, minuto){
  const idx = bus.ruta.indexOf(paradaId);
  if (idx === -1) return null;

  // buscamos el siguiente momento en que bus está ahí
  for (let t=minuto; t<minuto+2000; t++){
    if (paradaActual(bus, t) === paradaId)
      return t - minuto;
  }
  return null;
}
