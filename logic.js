/******************************************************
 *               VITRASA CHASE — LOGIC.JS
 *     Versión estable (Local + IA) — Funciona YA
 ******************************************************/

/* ====== LOADER GENERAL (index.html) ====== */
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const main = document.getElementById("main");

  // Evitar que se quede pillado si falla alguna imagen
  setTimeout(() => {
    if(loader){
      loader.classList.add("hidden");
    }
    if(main){
      main.classList.remove("hidden");
    }
  }, 1500);
});


/* ========================================================
 * INICIAR PARTIDA LOCAL
 * ====================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const btnLocal = document.getElementById("startLocal");

  if(btnLocal){
    btnLocal.addEventListener("click", () => {
      const j1 = document.getElementById("p1").value.trim() || "Jugador 1";
      const j2 = document.getElementById("p2").value.trim() || "Jugador 2";

      // Guardar la sala en memoria global
      window.__sala = {
        modo: "local",
        jugadores: [
          { nombre: j1, rol: "fugitivo" },
          { nombre: j2, rol: "perseguidor" }
        ],
        estado: "en_parada"
      };

      // Redirige a la sala
      window.location.href = "sala.html";
    });
  }
});


/* ========================================================
 * INICIAR PARTIDA CONTRA IA
 * ====================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const btnIA = document.getElementById("startIA");

  if(btnIA){
    btnIA.addEventListener("click", () => {
      const nombre = document.getElementById("ia_name").value.trim() || "Jugador";
      const rol = document.getElementById("ia_role").value;
      const nivel = document.getElementById("ia_level").value;

      // IA toma el rol contrario automáticamente
      const rolIA = rol === "fugitivo" ? "perseguidor" : "fugitivo";

      window.__sala = {
        modo: "ia",
        jugadores: [
          { nombre, rol }
        ],
        ia: {
          rol: rolIA,
          nivel
        },
        estado: "en_parada"
      };

      // Redirige a sala
      window.location.href = "sala.html";
    });
  }
});


/* ========================================================
 * INICIALIZAR SALA (sala.html)
 * ====================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if(!window.__sala) return;  // si no hay sala, no hacemos nada

  const sala = window.__sala;

  // Mostrar modo en sala.html
  const sModo = document.getElementById("s_modo");
  const sJugadores = document.getElementById("s_jugadores");

  if(sModo) {
    sModo.textContent = sala.modo === "local" ? "Juego Local" : "Contra IA";
  }

  if(sJugadores){
    if(sala.modo === "local"){
      sJugadores.innerHTML = `
        👤 ${sala.jugadores[0].nombre} — <b>Fugitivo</b><br>
        🕵️ ${sala.jugadores[1].nombre} — <b>Perseguidor</b>
      `;
    } else {
      sJugadores.innerHTML = `
        👤 ${sala.jugadores[0].nombre} — <b>${sala.jugadores[0].rol}</b><br>
        🤖 IA (${sala.ia.nivel}) — <b>${sala.ia.rol}</b>
      `;
    }
  }
});
