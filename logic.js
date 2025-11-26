cat > logic.js <<'EOF'
// ---------------------------------------------------------
// LOADER: SE OCULTA CUANDO EL DOM ESTÁ LISTO
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    console.log("✔ DOM cargado, ocultando loader");

    const loader = document.getElementById("loader");
    const main = document.getElementById("main");

    if (loader) loader.style.display = "none";
    if (main) main.classList.remove("hidden");
});

// ---------------------------------------------------------
// UTILIDADES
// ---------------------------------------------------------
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------
// ENRUTAMIENTO PARA LOCAL / IA / JUEGO
// ---------------------------------------------------------
if (location.pathname.endsWith("local.html")) {
    initLocalPage();
}
if (location.pathname.endsWith("ia.html")) {
    initIAPage();
}
if (location.pathname.endsWith("juego.html")) {
    initGamePage();
}

// ---------------------------------------------------------
// LOCAL.HTML
// ---------------------------------------------------------
function initLocalPage() {
    const btn = document.getElementById("startLocal");
    if (!btn) return;

    btn.onclick = () => {
        const p1 = document.getElementById("p1").value || "Fugitivo";
        const p2 = document.getElementById("p2").value || "Perseguidor";

        window.__sala = {
            modo: "local",
            jugadores: [
                { nombre: p1, rol: "fugitivo" },
                { nombre: p2, rol: "perseguidor" }
            ]
        };

        location.href = "juego.html";
    };
}

// ---------------------------------------------------------
// IA.HTML
// ---------------------------------------------------------
function initIAPage() {
    const btn = document.getElementById("startIA");
    if (!btn) return;

    btn.onclick = () => {
        const nombre = document.getElementById("ia_name").value || "Jugador";
        const rol = document.getElementById("ia_role").value || "fugitivo";

        window.__sala = {
            modo: "ia",
            jugadores: [
                { nombre, rol },
                { nombre: "IA", rol: rol === "fugitivo" ? "perseguidor" : "fugitivo", ia: true }
            ]
        };

        location.href = "juego.html";
    };
}

// ---------------------------------------------------------
// JUEGO.HTML
// ---------------------------------------------------------
function initGamePage() {
    console.log("✔ Página de juego iniciada");

    const info = document.getElementById("roomInfo");

    if (window.__sala) {
        info.innerHTML = `
            <strong>Modo:</strong> ${window.__sala.modo}<br>
            <strong>Jugadores:</strong> ${window.__sala.jugadores.map(j=>j.nombre+" ("+j.rol+")").join(", ")}
        `;
    }

    // PARADA ALEATORIA
    const paradas = Object.keys(DEFAULT_STOPS);
    const randomId = pickRandom(paradas);
    const parada = DEFAULT_STOPS[randomId];

    renderParada(randomId, parada);
}

// ---------------------------------------------------------
// RENDER PARADA
// ---------------------------------------------------------
function renderParada(id, parada) {
    const box = document.getElementById("paradaInfo");
    if (!box) return;
    box.innerHTML = `
        <h2>Próxima parada</h2>
        <p><strong>${id}</strong><br>${parada.nombre}</p>
    `;
}

// ---------------------------------------------------------
// PARADAS DE EJEMPLO
// ---------------------------------------------------------
const DEFAULT_STOPS = {
    "6620": { nombre: "Rúa de Policarpo Sanz, 40" },
    "20198": { nombre: "Rúa de Policarpo Sanz, 26" },
    "14264": { nombre: "Rúa de Urzáiz - Príncipe" },
    "14121": { nombre: "Rúa da Reconquista, 2" },
    "6930": { nombre: "Praza de América, 1" }
};
EOF
