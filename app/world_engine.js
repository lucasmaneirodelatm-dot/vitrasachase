module.exports = function(io){
    const buses = {};
    const notificaciones = [];
    let hora = 6 * 60; // 06:00

    function enviarGlobal(){
        io.emit("worldUpdate", { hora, buses, notificaciones });
        notificaciones.length = 0;
    }

    function addNotif(txt){
        notificaciones.push({ texto: txt, time: Date.now() });
    }

    setInterval(() => {
        hora++;

        if (hora === 7 * 60) 
            addNotif("Laborables");

        if (hora === 21 * 60 + 30)
            addNotif("Sábados");

        if (hora === 22 * 60)
            addNotif("");

        enviarGlobal();

        if (hora >= 24 * 60) hora = 0;
    }, 1000);

    return { buses };
};
