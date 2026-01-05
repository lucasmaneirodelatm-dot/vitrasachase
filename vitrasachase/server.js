// ===============================
// VITRASA CHASE - SERVER
// ===============================

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

// ===============================
// CONFIGURACIÓN BÁSICA
// ===============================

const PORT = 3000;
const TICK_RATE = 1000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// ===============================
// CARGA DE DATOS
// ===============================

function loadJSON(file) {
    return JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", file), "utf8")
    );
}

const PARADAS = loadJSON("paradas.json");
const LINEAS = loadJSON("lineas.json");
const BUSES_BASE = loadJSON("buses.json");
const HORARIOS = loadJSON("horarios.json");

// ===============================
// ESTADO GLOBAL DEL MUNDO
// ===============================

let worldTime = 0;

let buses = [];
let rooms = {};

// ===============================
// UTILIDADES
// ===============================

function generateId() {
    return Math.random().toString(36).substring(2, 10);
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// ===============================
// CREACIÓN DE BUSES
// ===============================

function spawnInitialBuses() {
    buses = [];

    LINEAS.forEach(linea => {
        const freq = linea.frecuencia || 10;
        const count = Math.max(1, Math.floor(60 / freq));

        for (let i = 0; i < count; i++) {
            buses.push({
                id: generateId(),
                linea: linea.id,
                paradaIndex: i % linea.paradas.length,
                progreso: 0,
                retraso: Math.floor(Math.random() * 120),
                pasajeros: 0
            });
        }
    });
}

// ===============================
// AVANCE DEL MUNDO
// ===============================

function tickWorld() {
    worldTime++;

    buses.forEach(bus => {
        bus.progreso++;

        if (bus.progreso >= 60 + bus.retraso) {
            bus.progreso = 0;
            bus.retraso = Math.floor(Math.random() * 90);
            bus.paradaIndex++;

            const linea = LINEAS.find(l => l.id === bus.linea);
            if (bus.paradaIndex >= linea.paradas.length) {
                bus.paradaIndex = 0;
            }

            bus.pasajeros += Math.floor(Math.random() * 3);
            if (bus.pasajeros > 60) bus.pasajeros = 60;
        }
    });

    Object.values(rooms).forEach(room => {
        checkVictory(room);
    });
}

// ===============================
// SALAS
// ===============================

function createRoom(mode) {
    const id = generateId();
    rooms[id] = {
        id,
        mode,
        players: {},
        started: false,
        startTime: worldTime
    };
    return rooms[id];
}

// ===============================
// JUGADORES
// ===============================

function addPlayer(room, socket, role) {
    room.players[socket.id] = {
        id: socket.id,
        role,
        parada: randomParada(),
        bus: null,
        alive: true
    };
}

function randomParada() {
    return PARADAS[Math.floor(Math.random() * PARADAS.length)].id;
}

// ===============================
// REGLAS DE VICTORIA
// ===============================

function checkVictory(room) {
    const players = Object.values(room.players);
    if (players.length < 2) return;

    const fug = players.find(p => p.role === "fugitivo");
    const per = players.find(p => p.role === "perseguidor");

    if (!fug || !per) return;

    if (fug.parada === per.parada && fug.bus === per.bus) {
        io.to(room.id).emit("gameOver", {
            winner: "perseguidor"
        });
        delete rooms[room.id];
        return;
    }

    if (worldTime - room.startTime >= 300) {
        io.to(room.id).emit("gameOver", {
            winner: "fugitivo"
        });
        delete rooms[room.id];
    }
}

// ===============================
// SOCKET.IO
// ===============================

io.on("connection", socket => {

    socket.on("createRoom", mode => {
        const room = createRoom(mode);
        socket.join(room.id);
        addPlayer(room, socket, "fugitivo");
        socket.emit("roomCreated", room.id);
    });

    socket.on("joinRoom", roomId => {
        const room = rooms[roomId];
        if (!room) return;

        socket.join(room.id);
        addPlayer(room, socket, "perseguidor");
        room.started = true;

        io.to(room.id).emit("gameStart", {
            players: room.players,
            worldTime
        });
    });

    socket.on("moveToParada", paradaId => {
        Object.values(rooms).forEach(room => {
            if (room.players[socket.id]) {
                room.players[socket.id].parada = paradaId;
                room.players[socket.id].bus = null;
            }
        });
    });

    socket.on("takeBus", busId => {
        Object.values(rooms).forEach(room => {
            const player = room.players[socket.id];
            if (!player) return;

            const bus = buses.find(b => b.id === busId);
            if (!bus) return;

            player.bus = busId;
            player.parada = null;
            bus.pasajeros++;
        });
    });

    socket.on("disconnect", () => {
        Object.values(rooms).forEach(room => {
            if (room.players[socket.id]) {
                delete room.players[socket.id];
            }
        });
    });
});

// ===============================
// ARRANQUE
// ===============================

spawnInitialBuses();
setInterval(tickWorld, TICK_RATE);

server.listen(PORT, () => {
    console.log("VITRASA CHASE activo en puerto", PORT);
});
