// world_engine.js
module.exports = function(io) {

    // PARADAS DE EJEMPLO (tú luego las rellenas)
    const PARADAS = ["1000", "1001", "1002", "1003", "1004"];

    // BUS DE EJEMPLO
    const buses = {
        "BUS1": {
            id: "BUS1",
            linea: "L11",
            eta: 20,
            next: PARADAS[0],
            posIndex: 0
        }
    };

    function avanzarBus(bus){
        bus.eta--;
        if (bus.eta <= 0){
            bus.posIndex = (bus.posIndex + 1) % PARADAS.length;
            bus.next = PARADAS[bus.posIndex];
            bus.eta = 20; // tiempo de prueba
        }
    }

    setInterval(() => {
        Object.values(buses).forEach(bus => avanzarBus(bus));

        io.emit("worldUpdate", {
            hora: Date.now(),
            buses
        });

    }, 1000);

    io.on("connection", socket => {

        socket.on("timbre", data => {
            const bus = buses[data.bus];
            if (!bus) return;

            // La sala decide la parada tras timbrar
            const destino = bus.next;

            io.emit("descenso", {
                bus: data.bus,
                parada: destino
            });
        });

        socket.on("askBus", data => {
            const bus = buses[data.bus];
            socket.emit("busInfo", bus || null);
        });
    });
};
