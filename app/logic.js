const socket = io();

socket.on("worldUpdate", data => {
    const frame = document.getElementById("visor");
    if (frame)
        frame.contentWindow.postMessage({ type: "worldUpdate", data }, "*");
});

// Mensajes desde páginas internas
window.addEventListener("message", ev => {
    if (ev.data.type === "timbreBus"){
        socket.emit("timbre", { bus: ev.data.bus });
    }
});
