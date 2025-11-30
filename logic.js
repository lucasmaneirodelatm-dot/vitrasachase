document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const ld = document.getElementById("loader");
        const mn = document.getElementById("main");
        if (ld) ld.style.display = "none";
        if (mn) mn.classList.remove("hidden");
    }, 500);
});

// Iniciar local
const sl = document.getElementById("startLocal");
if (sl) sl.onclick = () => {
    const j1 = document.getElementById("j1").value || "Jugador 1";
    const j2 = document.getElementById("j2").value || "Jugador 2";

    localStorage.setItem("sala", JSON.stringify({
        modo: "local",
        j1, j2
    }));

    location.href = "sala.html";
};

// Iniciar IA
const sia = document.getElementById("startIA");
if (sia) sia.onclick = () => {
    const nombre = document.getElementById("ia_name").value || "Jugador";
    const rol = document.getElementById("ia_role").value;
    const nivel = document.getElementById("ia_level").value;

    localStorage.setItem("sala", JSON.stringify({
        modo: "ia",
        nombre, rol, nivel
    }));

    location.href = "sala.html";
};

// Sala
if (location.pathname.endsWith("sala.html")) {
    const socket = io();

    const frame = document.getElementById("frame");

    socket.on("worldUpdate", buses => {
        frame.contentWindow.postMessage({ type: "world_update", buses }, "*");
    });

    socket.on("bajar", data => {
        frame.src = "parada.html";
    });

    window.addEventListener("message", ev => {
        if (ev.data.type === "coger") {
            frame.src = "bus.html";
        }

        if (ev.data.type === "timbre") {
            socket.emit("timbre", { busId: "C1-1" });
        }
    });
}
