// =========================================
// VITRASA CHASE - WORLD SIMULATION
// =========================================

const fs = require("fs");
const path = require("path");

// =========================================
// CARGA DE DATOS
// =========================================

function loadJSON(file) {
    return JSON.parse(
        fs.readFileSync(path.join(__dirname, "..", "data", file), "utf8")
    );
}

const PARADAS = loadJSON("paradas.json");
const LINEAS = loadJSON("lineas.json");
const BUSES_BASE = loadJSON("buses.json");
const HORARIOS = loadJSON("horarios.json");

// =========================================
// CONFIGURACIÓN GLOBAL
// =========================================

const TICK_SECONDS = 1;
const BUS_STOP_TIME = 20;
const BASE_DELAY = 30;
const MAX_PASSENGERS = 60;
const REFUERZO_THRESHOLD = 45;

// =========================================
// ESTADO DEL MUNDO
// =========================================

let worldTime = 0;
let dayType = "LABORABLE";

let buses = [];
let paradas = {};
let lineas = {};
let activeReinforcements = [];

// =========================================
// INICIALIZACIÓN
// =========================================

function initWorld() {
    worldTime = 0;
    buses = [];
    paradas = {};
    lineas = {};
    activeReinforcements = [];

    PARADAS.forEach(p => {
        paradas[p.id] = {
            id: p.id,
            nombre: p.nombre || "",
            lineas: p.lineas || [],
            cola: 0,
            busesProximos: []
        };
    });

    LINEAS.forEach(l => {
        lineas[l.id] = {
            id: l.id,
            paradas: l.paradas,
            frecuencia: l.frecuencia,
            duracion: l.duracion
        };
    });

    spawnInitialBuses();
}

// =========================================
// CREACIÓN DE BUSES
// =========================================

function spawnInitialBuses() {
    LINEAS.forEach(linea => {
        const freq = linea.frecuencia || 10;
        const count = Math.max(1, Math.floor(60 / freq));

        for (let i = 0; i < count; i++) {
            buses.push(createBus(linea.id, i));
        }
    });
}

function createBus(lineaId, offset) {
    return {
        id: generateId(),
        linea: lineaId,
        paradaIndex: offset % lineas[lineaId].paradas.length,
        timeToNext: BUS_STOP_TIME,
        delay: randomDelay(),
        pasajeros: Math.floor(Math.random() * 10),
        activo: true,
        refuerzo: false
    };
}

// =========================================
// TICK DEL MUNDO
// =========================================

function tick() {
    worldTime += TICK_SECONDS;

    buses.forEach(bus => {
        advanceBus(bus);
    });

    updateParadas();
    evaluateReinforcements();
}

// =========================================
// AVANCE DE BUSES
// =========================================

function advanceBus(bus) {
    if (!bus.activo) return;

    bus.timeToNext -= TICK_SECONDS;

    if (bus.timeToNext > 0) return;

    bus.paradaIndex++;
    const linea = lineas[bus.linea];

    if (bus.paradaIndex >= linea.paradas.length) {
        bus.paradaIndex = 0;
    }

    const paradaId = linea.paradas[bus.paradaIndex];
    const parada = paradas[paradaId];

    processPassengers(bus, parada);

    bus.timeToNext = BUS_STOP_TIME + bus.delay;
    bus.delay = randomDelay();
}

// =========================================
// PASAJEROS
// =========================================

function processPassengers(bus, parada) {
    const bajan = Math.floor(Math.random() * 5);
    bus.pasajeros -= bajan;
    if (bus.pasajeros < 0) bus.pasajeros = 0;

    const suben = Math.min(
        parada.cola,
        MAX_PASSENGERS - bus.pasajeros
    );

    bus.pasajeros += suben;
    parada.cola -= suben;

    if (parada.cola < 0) parada.cola = 0;
}

// =========================================
// ACTUALIZACIÓN DE PARADAS
// =========================================

function updateParadas() {
    Object.values(paradas).forEach(p => {
        p.busesProximos = [];
    });

    buses.forEach(bus => {
        if (!bus.activo) return;

        const linea = lineas[bus.linea];
        const paradaId = linea.paradas[bus.paradaIndex];
        const parada = paradas[paradaId];

        parada.busesProximos.push({
            busId: bus.id,
            linea: bus.linea,
            tiempo: bus.timeToNext
        });
    });

    Object.values(paradas).forEach(p => {
        p.cola += Math.floor(Math.random() * 3);
    });
}

// =========================================
// REFUERZOS R*
// =========================================

function evaluateReinforcements() {
    Object.values(paradas).forEach(p => {
        if (p.cola >= REFUERZO_THRESHOLD) {
            triggerReinforcement(p);
        }
    });
}

function triggerReinforcement(parada) {
    const lineaId = parada.lineas[0];
    if (!lineaId) return;

    const existing = activeReinforcements.find(
        r => r.parada === parada.id && r.linea === lineaId
    );
    if (existing) return;

    const bus = createBus(lineaId, 0);
    bus.refuerzo = true;
    buses.push(bus);

    activeReinforcements.push({
        parada: parada.id,
        linea: lineaId,
        busId: bus.id
    });
}

// =========================================
// HORARIOS
// =========================================

function setDayType(type) {
    if (!HORARIOS[type]) return
