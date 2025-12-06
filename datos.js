// datos.js
// ================================
//  HOJAS DE RUTA Y HORARIOS FIJOS
// ================================

// HORA VIRTUAL: los HTML la irán incrementando automáticamente
let reloj = 0; // en minutos virtuales desde el inicio

// BUSES DEFINIDOS
const BUSES = {
  "BUS6200": {
    id: "BUS200",
    linea: "24",
    ruta: ["20057", "430", "6860", "14121", "20198", "6620", "14264", "8820", "8840", "7000", "8610", "5810", "5820", "710", "910", "2930", "2870", "2880", "2910", "6740", "14385", "14386", "14387", "2920", "840", "5800", "5830", "20022", "20023", "8750", "8770", "5540", "20091", "20057"], // paradas en orden
    frecuencia: 10, // minutos
    inicio: 0 // empieza a las 00:00 virtuales
  },
  "BUS6210": {
    id: "BUS210",
    linea: "L11",
    ruta: ["00"],
    frecuencia: 12,
    inicio: 3
  },
  "BUS6225": {
    id: "BUS225",
    linea: "c3",
    ruta: ["00"],
    frecuencia: 12,
    inicio: 3
  },
  "BUS6235": {
    id: "BUS235",
    linea: "L15a",
    ruta: ["00"],
    frecuencia: 12,
    inicio: 3
  },
  "BUS6800": {
    id: "BUS800",
    linea: "L4A",
    ruta: ["00"],
    frecuencia: 12,
    inicio: 3
  },
  "BUS6823": {
    id: "BUS823",
    linea: "L12B",
    ruta: ["00"],
    frecuencia: 12,
    inicio: 3
  },
  "BUS6950": {
    id: "BUS950",
    linea: "C1",
    ruta: ["6930", "3250", "6970", "14892", "8460", "8480", "8450", "8470", "14173", "1150", "14333", "20194", "14121", "20198", "6620", "14264", "8820", "5610", "5670", "14135", "2440", "2450", "2430", "14475", "6530", "14169", "6930"],
    frecuencia: 10,
    inicio: 10
  },
   "BUS6952": {
    id: "BUS952",
    linea: "C1",
    ruta: ["6930", "3250", "6970", "14892", "8460", "8480", "8450", "8470", "14173", "1150", "14333", "20194", "14121", "20198", "6620", "14264", "8820", "5610", "5670", "14135", "2440", "2450", "2430", "14475", "6530", "14169", "6930"],
    frecuencia: 10,
    inicio: 7
  },
   "BUS6954": {
    id: "BUS954",
    linea: "C1",
    ruta: ["6930", "3250", "6970", "14892", "8460", "8480", "8450", "8470", "14173", "1150", "14333", "20194", "14121", "20198", "6620", "14264", "8820", "5610", "5670", "14135", "2440", "2450", "2430", "14475", "6530", "14169", "6930"],
    frecuencia: 10,
    inicio: 4
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
