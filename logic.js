/* ============================
   VITRASA CHASE - logic.js
   CÓDIGO ARREGLADO COMPLETAMENTE
=============================== */

/* ---------- LOADER ---------- */
function resourcesLoaded() {
    // Aquí luego se podrán meter comprobaciones de audios, imágenes, etc.
    return true;
}

function hideLoaderShowMain() {
    const loader = document.getElementById("loader");
    const main = document.getElementById("main");
    if (loader) loader.classList.add("hidden");
    if (main) main.classList.remove("hidden");
}

function showLoader() {
    const loader = document.getElementById("loader");
    const main = document.getElementById("main");
    if (loader) loader.classList.remove("hidden");
    if (main) main.classList.add("hidden");
}

/* ---------- INICIO GENERAL ---------- */
document.addEventListener("DOMContentLoaded", () => {
    console.log("logic.js cargado correctamente");

    // Loader: se quita cuando el DOM está listo
    if (resourcesLoaded()) {
        setTimeout(() => {
            hideLoaderShowMain();
        }, 100);
    }

    // Botón de iniciar partida local
    const btnLocal = document.getElementById("startLocal");
    if (btnLocal) {
        btnLocal.onclick = () => {
            const p1 = document.getElementById("p1").value || "Fugitivo";
            const p2 = document.getElementById("p2").value || "Perseguidor";

            window.__room = {
                mode: "local",
                players: [
                    { name: p1, role: "fugitivo" },
                    { name: p2, role: "perseguidor" }
                ]
            };

            window.location.href = "juego.html";
        };
    }

    // Botón de iniciar Contra IA
    const btnIA = document.getElementById("startIA");
    if (btnIA) {
        btnIA.onclick = () => {
            const name = document.getElementById("ia_name").value || "Jugador";
            const role = document.getElementById("ia_role").value || "fugitivo";
            const level = document.getElementById("ia_level").value || "normal";

            window.__room = {
                mode: "ia",
                players: [
                    { name, role },
                    { name: "IA", role: role === "fugitivo" ? "perseguidor" : "fugitivo", ai: true, level }
                ]
            };

            window.location.href = "juego.html";
        };
    }

    /* ---------- SI ESTAMOS EN JUEGO.HTML ---------- */
    if (location.pathname.endsWith("juego.html")) {
        initGame();
    }
});

/* ================================
        LÓGICA DEL JUEGO
================================ */

function initGame() {
    console.log("Inicializando partida…");

    const title = document.getElementById("title");
    if (title && window.__room) {
        title.textContent = "VITRASA CHASE — " + window.__room.mode.toUpperCase();
    }

    // Mostrar una parada aleatoria simple
    const parada = getRandomParada();
    renderParada(parada);

    // Mostrar buses inventados
    const buses = simulateBuses();
    renderBusList(buses);
}

/* ---------- PARADAS SIMPLES ---------- */

function getRandomParada() {
    return {
        id: "6620",
        name: "Rúa de Policarpo Sanz, 40"
    };
}

function renderParada(parada) {
    const box = document.getElementById("paradaInfo");
    if (!box) return;

    box.innerHTML = `
        <h3>Parada ${parada.id}</h3>
        <p>${parada.name}</p>
    `;
}

/* ---------- BUSES SIMULADOS ---------- */

function simulateBuses() {
    return [
        { line: "C1", number: 6154, eta: "ahora" },
        { line: "4A", number: 6231, eta: "3 min" },
        { line: "5B", number: 6177, eta: "6 min" }
    ];
}

function renderBusList(buses) {
    const box = document.getElementById("busList");
    if (!box) return;

    box.innerHTML = "<h3>📍 Próximos autobuses</h3>";

    buses.forEach(b => {
        const div = document.createElement("div");
        div.className = "busItem";
        div.innerHTML = `<strong>${b.line}</strong> — Bus ${b.number} — <em>${b.eta}</em>`;
        box.appendChild(div);

        if (b.eta === "ahora") {
            const btn = document.getElementById("cogerBtn");
            if (btn) btn.classList.remove("hidden");
        }
    });
}
