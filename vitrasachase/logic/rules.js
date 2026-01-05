// =========================================
// VITRASA CHASE - GAME RULES ENGINE
// =========================================

// Este módulo define TODAS las reglas del juego.
// No tiene dependencias de sockets ni de UI.
// Solo evalúa estados y devuelve resultados.

// =========================================
// CONFIGURACIÓN
// =========================================

const MAX_GAME_TIME = 300; // segundos
const INTERCEPT_DISTANCE = 0; // misma parada o mismo bus
const BUS_INTERCEPT_ENABLED = true;
const PARADA_INTERCEPT_ENABLED = true;

// =========================================
// ESTADOS POSIBLES
// =========================================

const GAME_STATES = {
    WAITING: "waiting",
    RUNNING: "running",
    FINISHED: "finished"
};

const WINNERS = {
    FUGITIVO: "fugitivo",
    PERSEGUIDOR: "perseguidor",
    NONE: null
};

// =========================================
// UTILIDADES BÁSICAS
// =========================================

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function now(worldTime) {
    return worldTime;
}

// =========================================
// CREACIÓN DE ESTADO DE PARTIDA
// =========================================

function createGameState(roomId, worldTime) {
    return {
        roomId,
        state: GAME_STATES.WAITING,
        startTime: worldTime,
        endTime: null,
        winner: WINNERS.NONE,
        reason: null
    };
}

// =========================================
// ARRANQUE DE PARTIDA
// =========================================

function startGame(gameState, worldTime) {
    gameState.state = GAME_STATES.RUNNING;
    gameState.startTime = worldTime;
}

// =========================================
// EVALUACIÓN PRINCIPAL
// =========================================

function evaluateGame(gameState, players, worldTime) {
    if (gameState.state !== GAME_STATES.RUNNING) {
        return gameState;
    }

    if (!players || Object.keys(players).length < 2) {
        return gameState;
    }

    const fug = findPlayerByRole(players, "fugitivo");
    const per = findPlayerByRole(players, "perseguidor");

    if (!fug || !per) {
        return gameState;
    }

    if (checkInterception(fug, per)) {
        finishGame(
            gameState,
            WINNERS.PERSEGUIDOR,
            "interceptado",
            worldTime
        );
        return gameState;
    }

    if (checkTimeVictory(gameState, worldTime)) {
        finishGame(
            gameState,
            WINNERS.FUGITIVO,
            "tiempo_agotado",
            worldTime
        );
        return gameState;
    }

    return gameState;
}

// =========================================
// INTERCEPCIÓN
// =========================================

function checkInterception(fug, per) {
    if (PARADA_INTERCEPT_ENABLED) {
        if (checkParadaInterception(fug, per)) {
            return true;
        }
    }

    if (BUS_INTERCEPT_ENABLED) {
        if (checkBusInterception(fug, per)) {
            return true;
        }
    }

    return false;
}

function checkParadaInterception(fug, per) {
    if (!fug.parada || !per.parada) return false;
    if (fug.parada === per.parada) return true;
    return false;
}

function checkBusInterception(fug, per) {
    if (!fug.bus || !per.bus) return false;
    if (fug.bus === per.bus) return true;
    return false;
}

// =========================================
// TIEMPO
// =========================================

function checkTimeVictory(gameState, worldTime) {
    const elapsed = worldTime - gameState.startTime;
    if (elapsed >= MAX_GAME_TIME) {
        return true;
    }
    return false;
}

// =========================================
// FINALIZACIÓN
// =========================================

function finishGame(gameState, winner, reason, worldTime) {
    gameState.state = GAME_STATES.FINISHED;
    gameState.winner = winner;
    gameState.reason = reason;
    gameState.endTime = worldTime;
}

// =========================================
// JUGADORES
// =========================================

function findPlayerByRole(players, role) {
    return Object.values(players).find(p => p.role === role);
}

// =========================================
// VALIDACIONES DE MOVIMIENTO
// =========================================

function canMoveToParada(player, paradaId) {
    if (!player) return false;
    if (player.bus) return false;
    if (player.parada === paradaId) return false;
    return true;
}

function canTakeBus(player, busId, busesAtParada) {
    if (!player) return false;
    if (player.bus) return false;
    if (!player.parada) return false;

    const bus = busesAtParada.find(b => b.id === busId);
    if (!bus) return false;

    if (bus.timeToNext > 0) return false;

    return true;
}

// =========================================
// SALIDA DE BUS
// =========================================

function leaveBus(player) {
    if (!player.bus) return;
    player.bus = null;
}

// =========================================
// DESCONEXIÓN
// =========================================

function handleDisconnect(gameState, players, socketId, worldTime) {
    if (gameState.state !== GAME_STATES.RUNNING) return gameState;

    if (!players[socketId]) return gameState;

    const role = players[socketId].role;
    delete players[socketId];

    if (role === "fugitivo") {
        finishGame(
            gameState,
            WINNERS.PERSEGUIDOR,
            "fugitivo_desconectado",
            worldTime
        );
    } else {
        finishGame(
            gameState,
            WINNERS.FUGITIVO,
            "perseguidor_desconectado",
            worldTime
        );
    }

    return gameState;
}

// =========================================
// REINICIO
// =========================================

function resetGame(gameState, worldTime) {
    gameState.state = GAME_STATES.WAITING;
    gameState.startTime = worldTime;
    gameState.endTime = null;
    gameState.winner = WINNERS.NONE;
    gameState.reason = null;
}

// =========================================
// INFORMACIÓN PÚBLICA
// =========================================

function getPublicGameState(gameState) {
    return {
        state: gameState.state,
        winner: gameState.winner,
        reason: gameState.reason,
        startTime: gameState.startTime,
        endTime: gameState.endTime
    };
}

// =========================================
// EXPORTS
// =========================================

module.exports = {
    GAME_STATES,
    WINNERS,
    createGameState,
    startGame,
    evaluateGame,
    handleDisconnect,
    canMoveToParada,
    canTakeBus,
    leaveBus,
    resetGame,
    getPublicGameState
};
