// =========================================
// VITRASA CHASE - ARTIFICIAL INTELLIGENCE
// =========================================

// IA basada en reglas, no predictiva omnisciente.
// Decide usando información pública del mundo.
// Compatible con fugitivo y perseguidor.

// =========================================
// CONFIGURACIÓN
// =========================================

const MAX_MEMORY = 5;
const DANGER_RADIUS = 2;
const PATIENCE_LIMIT = 10;
const BUS_WAIT_THRESHOLD = 5;

// =========================================
// MEMORIA INTERNA
// =========================================

const memories = {};

// =========================================
// UTILIDADES
// =========================================

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function distance(aIndex, bIndex, total) {
    const d = Math.abs(aIndex - bIndex);
    return Math.min(d, total - d);
}

// =========================================
// MEMORIA DE IA
// =========================================

function initMemory(playerId) {
    memories[playerId] = {
        visitedParadas: [],
        lastDecision: null,
        patience: 0
    };
}

function remember(playerId, paradaId) {
    const mem = memories[playerId];
    if (!mem) return;

    mem.visitedParadas.push(paradaId);
    if (mem.visitedParadas.length > MAX_MEMORY) {
        mem.visitedParadas.shift();
    }
}

// =========================================
// DECISIÓN PRINCIPAL
// =========================================

function decide(player, role, worldState, rules) {
    if (!memories[player.id]) initMemory(player.id);

    if (role === "fugitivo") {
        return decideFugitivo(player, worldState);
    }

    if (role === "perseguidor") {
        return decidePerseguidor(player, worldState);
    }

    return null;
}

// =========================================
// IA FUGITIVO
// =========================================

function decideFugitivo(player, worldState) {
    const mem = memories[player.id];
    const paradas = worldState.paradas;
    const buses = worldState.buses;

    if (player.bus) {
        return maybeLeaveBus(player, worldState);
    }

    const danger = detectDanger(player, worldState);
    if (danger) {
        const escape = findEscapeParada(player, paradas);
        if (escape) {
            remember(player.id, escape);
            return { action: "move", parada: escape };
        }
    }

    const bus = chooseSafeBus(player, buses, paradas);
    if (bus) {
        return { action: "takeBus", bus: bus.id };
    }

    mem.patience++;
    if (mem.patience > PATIENCE_LIMIT) {
        const next = randomConnectedParada(player, paradas);
        mem.patience = 0;
        if (next) {
            remember(player.id, next);
            return { action: "move", parada: next };
        }
    }

    return { action: "wait" };
}

// =========================================
// IA PERSEGUIDOR
// =========================================

function decidePerseguidor(player, worldState) {
    const mem = memories[player.id];
    const paradas = worldState.paradas;
    const buses = worldState.buses;

    if (player.bus) {
        return maybeLeaveBus(player, worldState);
    }

    const target = estimateFugitivo(worldState);
    if (target) {
        const next = chaseParada(player, target, paradas);
        if (next) {
            remember(player.id, next);
            return { action: "move", parada: next };
        }
    }

    const bus = chooseAggressiveBus(player, buses, paradas);
    if (bus) {
        return { action: "takeBus", bus: bus.id };
    }

    return { action: "wait" };
}

// =========================================
// COMPORTAMIENTOS COMUNES
// =========================================

function maybeLeaveBus(player, worldState) {
    const buses = worldState.buses;
    const bus = buses.find(b => b.id === player.bus);
    if (!bus) return { action: "leaveBus" };

    if (bus.timeToNext <= BUS_WAIT_THRESHOLD) {
        return { action: "wait" };
    }

    return { action: "leaveBus" };
}

// =========================================
// DETECCIÓN DE PELIGRO
// =========================================

function detectDanger(player, worldState) {
    const players = worldState.players || [];
    const perseguidor = players.find(p => p.role === "perseguidor");
    if (!perseguidor) return false;

    if (player.parada && perseguidor.parada) {
        return player.parada === perseguidor.parada;
    }

    return false;
}

// =========================================
// ESCAPE
// =========================================

function findEscapeParada(player, paradas) {
    const current = paradas[player.parada];
    if (!current) return null;

    const options = current.lineas
        .flatMap(l => l.paradas)
        .filter(p => p !== player.parada);

    return random(options);
}

// =========================================
// ELECCIÓN DE BUS (FUGITIVO)
// =========================================

function chooseSafeBus(player, buses, paradas) {
    const parada = paradas[player.parada];
    if (!parada) return null;

    const arriving = parada.busesProximos
        .filter(b => b.tiempo <= BUS_WAIT_THRESHOLD);

    if (arriving.length === 0) return null;

    return random(arriving);
}

// =========================================
// ELECCIÓN DE BUS (PERSEGUIDOR)
// =========================================

function chooseAggressiveBus(player, buses, paradas) {
    const parada = paradas[player.parada];
    if (!parada) return null;

    const arriving = parada.busesProximos
        .filter(b => b.tiempo <= BUS_WAIT_THRESHOLD);

    if (arriving.length === 0) return null;

    return random(arriving);
}

// =========================================
// PERSECUCIÓN
// =========================================

function estimateFugitivo(worldState) {
    const players = worldState.players || [];
    return players.find(p => p.role === "fugitivo");
}

function chaseParada(player, target, paradas) {
    if (!player.parada || !target.parada) return null;

    const current = paradas[player.parada];
    if (!current) return null;

    const options = current.lineas
        .flatMap(l => l.paradas)
        .filter(p => p !== player.parada);

    return random(options);
}

// =========================================
// MOVIMIENTO ALEATORIO
// =========================================

function randomConnectedParada(player, paradas) {
    const current = paradas[player.parada];
    if (!current) return null;

    const options = current.lineas
        .flatMap(l => l.paradas)
        .filter(p => p !== player.parada);

    if (options.length === 0) return null;
    return random(options);
}

// =========================================
// RESET
// =========================================

function resetAI(playerId) {
    delete memories[playerId];
}

// =========================================
// EXPORTS
// =========================================

module.exports = {
    decide,
    resetAI
};
// =========================================
// VITRASA CHASE - ARTIFICIAL INTELLIGENCE
// =========================================

// IA basada en reglas, no predictiva omnisciente.
// Decide usando información pública del mundo.
// Compatible con fugitivo y perseguidor.

// =========================================
// CONFIGURACIÓN
// =========================================

const MAX_MEMORY = 5;
const DANGER_RADIUS = 2;
const PATIENCE_LIMIT = 10;
const BUS_WAIT_THRESHOLD = 5;

// =========================================
// MEMORIA INTERNA
// =========================================

const memories = {};

// =========================================
// UTILIDADES
// =========================================

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function distance(aIndex, bIndex, total) {
    const d = Math.abs(aIndex - bIndex);
    return Math.min(d, total - d);
}

// =========================================
// MEMORIA DE IA
// =========================================

function initMemory(playerId) {
    memories[playerId] = {
        visitedParadas: [],
        lastDecision: null,
        patience: 0
    };
}

function remember(playerId, paradaId) {
    const mem = memories[playerId];
    if (!mem) return;

    mem.visitedParadas.push(paradaId);
    if (mem.visitedParadas.length > MAX_MEMORY) {
        mem.visitedParadas.shift();
    }
}

// =========================================
// DECISIÓN PRINCIPAL
// =========================================

function decide(player, role, worldState, rules) {
    if (!memories[player.id]) initMemory(player.id);

    if (role === "fugitivo") {
        return decideFugitivo(player, worldState);
    }

    if (role === "perseguidor") {
        return decidePerseguidor(player, worldState);
    }

    return null;
}

// =========================================
// IA FUGITIVO
// =========================================

function decideFugitivo(player, worldState) {
    const mem = memories[player.id];
    const paradas = worldState.paradas;
    const buses = worldState.buses;

    if (player.bus) {
        return maybeLeaveBus(player, worldState);
    }

    const danger = detectDanger(player, worldState);
    if (danger) {
        const escape = findEscapeParada(player, paradas);
        if (escape) {
            remember(player.id, escape);
            return { action: "move", parada: escape };
        }
    }

    const bus = chooseSafeBus(player, buses, paradas);
    if (bus) {
        return { action: "takeBus", bus: bus.id };
    }

    mem.patience++;
    if (mem.patience > PATIENCE_LIMIT) {
        const next = randomConnectedParada(player, paradas);
        mem.patience = 0;
        if (next) {
            remember(player.id, next);
            return { action: "move", parada: next };
        }
    }

    return { action: "wait" };
}

// =========================================
// IA PERSEGUIDOR
// =========================================

function decidePerseguidor(player, worldState) {
    const mem = memories[player.id];
    const paradas = worldState.paradas;
    const buses = worldState.buses;

    if (player.bus) {
        return maybeLeaveBus(player, worldState);
    }

    const target = estimateFugitivo(worldState);
    if (target) {
        const next = chaseParada(player, target, paradas);
        if (next) {
            remember(player.id, next);
            return { action: "move", parada: next };
        }
    }

    const bus = chooseAggressiveBus(player, buses, paradas);
    if (bus) {
        return { action: "takeBus", bus: bus.id };
    }

    return { action: "wait" };
}

// =========================================
// COMPORTAMIENTOS COMUNES
// =========================================

function maybeLeaveBus(player, worldState) {
    const buses = worldState.buses;
    const bus = buses.find(b => b.id === player.bus);
    if (!bus) return { action: "leaveBus" };

    if (bus.timeToNext <= BUS_WAIT_THRESHOLD) {
        return { action: "wait" };
    }

    return { action: "leaveBus" };
}

// =========================================
// DETECCIÓN DE PELIGRO
// =========================================

function detectDanger(player, worldState) {
    const players = worldState.players || [];
    const perseguidor = players.find(p => p.role === "perseguidor");
    if (!perseguidor) return false;

    if (player.parada && perseguidor.parada) {
        return player.parada === perseguidor.parada;
    }

    return false;
}

// =========================================
// ESCAPE
// =========================================

function findEscapeParada(player, paradas) {
    const current = paradas[player.parada];
    if (!current) return null;

    const options = current.lineas
        .flatMap(l => l.paradas)
        .filter(p => p !== player.parada);

    return random(options);
}

// =========================================
// ELECCIÓN DE BUS (FUGITIVO)
// =========================================

function chooseSafeBus(player, buses, paradas) {
    const parada = paradas[player.parada];
    if (!parada) return null;

    const arriving = parada.busesProximos
        .filter(b => b.tiempo <= BUS_WAIT_THRESHOLD);

    if (arriving.length === 0) return null;

    return random(arriving);
}

// =========================================
// ELECCIÓN DE BUS (PERSEGUIDOR)
// =========================================

function chooseAggressiveBus(player, buses, paradas) {
    const parada = paradas[player.parada];
    if (!parada) return null;

    const arriving = parada.busesProximos
        .filter(b => b.tiempo <= BUS_WAIT_THRESHOLD);

    if (arriving.length === 0) return null;

    return random(arriving);
}

// =========================================
// PERSECUCIÓN
// =========================================

function estimateFugitivo(worldState) {
    const players = worldState.players || [];
    return players.find(p => p.role === "fugitivo");
}

function chaseParada(player, target, paradas) {
    if (!player.parada || !target.parada) return null;

    const current = paradas[player.parada];
    if (!current) return null;

    const options = current.lineas
        .flatMap(l => l.paradas)
        .filter(p => p !== player.parada);

    return random(options);
}

// =========================================
// MOVIMIENTO ALEATORIO
// =========================================

function randomConnectedParada(player, paradas) {
    const current = paradas[player.parada];
    if (!current) return null;

    const options = current.lineas
        .flatMap(l => l.paradas)
        .filter(p => p !== player.parada);

    if (options.length === 0) return null;
    return random(options);
}

// =========================================
// RESET
// =========================================

function resetAI(playerId) {
    delete memories[playerId];
}

// =========================================
// EXPORTS
// =========================================

module.exports = {
    decide,
    resetAI
};
