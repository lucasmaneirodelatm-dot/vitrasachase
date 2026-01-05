// ======================================
// VITRASA CHASE - SOCKET CLIENT LAYER
// ======================================

const socket = io();

const SocketAPI = {

    roomId: null,
    role: null,

    init() {
        this.bindCore();
    },

    bindCore() {
        socket.on("connect", () => {
            console.log("Conectado al servidor");
        });

        socket.on("disconnect", () => {
            console.log("Desconectado del servidor");
        });

        socket.on("gameStart", data => {
            this.role = data.role;
            if (window.onGameStart) {
                window.onGameStart(data);
            }
        });

        socket.on("worldUpdate", world => {
            if (window.onWorldUpdate) {
                window.onWorldUpdate(world);
            }
        });

        socket.on("gameOver", result => {
            if (window.onGameOver) {
                window.onGameOver(result);
            }
        });
    },

    createRoom(mode) {
        socket.emit("createRoom", mode);
    },

    joinRoom(roomId) {
        this.roomId = roomId;
        socket.emit("joinRoom", roomId);
    },

    moveToParada(paradaId) {
        socket.emit("moveToParada", paradaId);
    },

    takeBus(busId) {
        socket.emit("takeBus", busId);
    },

    leaveBus() {
        socket.emit("leaveBus");
    },

    syncLocal(fakeWorld) {
        if (window.onWorldUpdate) {
            window.onWorldUpdate(fakeWorld);
        }
    }
};

// =============================
// LOCAL MODE SIMULATION
// =============================

const LocalSimulator = {

    time: 0,
    interval: null,

    start() {
        this.interval = setInterval(() => {
            this.time++;
            this.tick();
        }, 1000);
    },

    tick() {
        const fakeWorld = {
            time: this.time,
            buses: [],
            paradas: {}
        };
        SocketAPI.syncLocal(fakeWorld);
    },

    stop() {
        clearInterval(this.interval);
    }
};

// =============================
// AUTO INIT
// =============================

SocketAPI.init();

window.SocketAPI = SocketAPI;
window.LocalSimulator = LocalSimulator;
