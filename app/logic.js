// logic.js
const socket = io();

// pasa el estado del mundo al iframe visible
socket.on("worldUpdate", data => {
    const visor = document.getElementById("visor");
    if (visor) visor.contentWindow.postMessage({ type: "worldUpdate", data }, "*");
});

// si la sala recibe que alguien timbra → redirige a parada.html
socket.on("descenso", data => {
    const visor = document.getElementById("visor");
    if (visor) {
        visor.src = "pages/parada.html?parada=" + data.parada;
    }
});

// mensajes desde las páginas internas
window.addEventListener("message", ev => {

    if (ev.data.type === "timbreBus"){
        socket.emit("timbre", { bus: ev.data.bus });
    }

    if (ev.data.type === "askBus"){
        socket.emit("askBus", { bus: ev.data.bus });
    }
});
