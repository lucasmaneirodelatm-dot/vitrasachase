// Motor del mundo Vitrasa Chase (tiempo real)
module.exports = function (io) {

  // Estado dinámico del mundo
  const buses = {
    "C1-1": { line: "C1", currentStop: 6940, nextStop: 20198, eta: 30 },
    "L11-1": { line: "L11", currentStop: 6620, nextStop: 14264, eta: 90 }
  };

  const paradas = {
    "20": { name: "Praza América" },
    "20198": { name: "Policarpo Sanz 26" },
    "6620": { name: "Policarpo Sanz 40" },
    "14264": { name: "Urzáiz - Príncipe" }
  };

  console.log("🌍 Motor del mundo iniciado");

  // Se ejecuta cada 1 segundo
  setInterval(() => {

    Object.keys(buses).forEach(id => {
      const b = buses[id];

      // Contar hacia abajo la ETA
      b.eta -= 1;

      if (b.eta <= 0) {
        // Bus llegó a la parada
        b.currentStop = b.nextStop;

        // Elegir nueva parada siguiente (ruta circular simulada)
        const paradasOrden = Object.keys(paradas);
        const pos = paradasOrden.indexOf(String(b.currentStop));
        const siguienteIndex = (pos + 1) % paradasOrden.length;

        b.nextStop = paradasOrden[siguienteIndex];
        b.eta = Math.floor(Math.random() * 50) + 20; // 20–70 segundos
      }
    });

    // ENVIAR A TODAS LAS SALAS
    io.emit("worldUpdate", { buses });

  }, 1000);

  return { buses, paradas };
};
