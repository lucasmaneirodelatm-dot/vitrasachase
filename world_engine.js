module.exports = function (io) {
    const paradas = ["6940", "20198", "6620", "14264"];

    const buses = {
        "C1-1": { id: "C1-1", linea: "C1", current: "6940", next: "20198", eta: 20, timbre: false },
        "L11-1": { id: "L11-1", linea: "L11", current: "6620", next: "14264", eta: 30, timbre: false }
    };

    console.log("🌍 Motor del mundo cargado");

    setInterval(() => {
        Object.values(buses).forEach(b => {
            b.eta--;

            if (b.eta <= 0) {
                b.current = b.next;

                const i = paradas.indexOf(b.current);
                b.next = paradas[(i + 1) % paradas.length];

                b.eta = Math.floor(Math.random() * 40) + 15;

                if (b.timbre) {
                    b.timbre = false;
                    io.emit("bajar", { bus: b.id, parada: b.current });
                }
            }
        });

        io.emit("worldUpdate", buses);
    }, 1000);

    return { buses, paradas };
};
