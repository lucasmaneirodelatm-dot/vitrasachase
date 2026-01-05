// ==============================
// VITRASA CHASE - GAME CLIENT
// ==============================

const socket = io();

let gameState = {
    role: null,
    parada: null,
    bus: null,
    worldTime: 0,
    paradas: {},
    buses: []
};

// ==============================
// DOM
// ==============================

const loader = document.getElementById("loader");
const game = document.getElementById("game");

const worldTimeEl = document.getElementById("worldTime");
const roleEl = document.getElementById("role");
const stateEl = document.getElementById("state");

// ==============================
// INIT
// ==============================

window.addEventListener("load", () => {
    setTimeout(() => {
        loader.classList.add("hidden");
        game.classList.remove("hidden");
    }, 1000);
});

// ==============================
// SOCKET EVENTS
// ==============================

socket.on("gameStart", data => {
    gameState.role = data.role;
    gameState.worldTime = data.worldTime;
    updateUI();
});

socket.on("worldUpdate", world => {
    gameState.worldTime = world.time;
    gameState.paradas = world.paradas;
    gameState.buses = world.buses;
    updateWorld();
});

socket.on("gameOver", data => {
    stateEl.textContent = "FIN: " + data.winner;
});

// ==============================
// UI UPDATE
// ==============================

function updateUI() {
    roleEl.textContent = "Rol: " + gameState.role;
}

function updateWorld() {
    worldTimeEl.textContent = formatTime(gameState.worldTime);
}

// ==============================
// ACTIONS
// ==============================

function move(paradaId) {
    socket.emit("moveToParada", paradaId);
}

function takeBus(busId) {
    socket.emit("takeBus", busId);
}

function leaveBus() {
    socket.emit("leaveBus");
}

// ==============================
// HELPERS
// ==============================

function formatTime(t) {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

// ==============================
// LOCAL MODE BINDINGS
// ==============================

document.getElementById("moveA").onclick = () => fakeMove("A");
document.getElementById("moveB").onclick = () => fakeMove("B");

function fakeMove(player) {
    console.log("Mover jugador", player);
}

// ==============================
// PLACEHOLDER LOGIC
// ==============================

function renderParada(panelId, paradaId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
}

// ==============================
// FUTURE EXTENSIONS
// ==============================
// IA hooks
// Online sync
// Prediction
// Replay
