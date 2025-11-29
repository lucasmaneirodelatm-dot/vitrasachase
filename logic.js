document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const main = document.getElementById("main");

  setTimeout(() => {
    loader.classList.add("hidden");
    main.classList.remove("hidden");
  }, 600);
});

// Utilidades
function randomItem(arr){ return arr[Math.floor(Math.random()*arr.length)]; },
/* ====== INICIAR JUEGO — LOCAL ====== */
document.addEventListener("DOMContentLoaded", () => {
  const btnLocal = document.getElementById("startLocal");
  if(btnLocal){
    btnLocal.addEventListener("click", () => {
      const j1 = document.getElementById("p1").value.trim() || "Jugador 1";
      const j2 = document.getElementById("p2").value.trim() || "Jugador 2";

      window.__salaLocal = {
        modo: "local",
        jugadores: [
          { nombre: j1, rol: "fugitivo" },
          { nombre: j2, rol: "perseguidor" }
        ]
      };

      window.location.href = "sala.html";
    });
  }

  /* ====== INICIAR JUEGO — IA ====== */
  const btnIA = document.getElementById("startIA");
  if(btnIA){
    btnIA.addEventListener("click", () => {
      const nombre = document.getElementById("ia_name").value.trim() || "Jugador";
      const rol     = document.getElementById("ia_role").value;
      const nivel   = document.getElementById("ia_level").value;

      window.__salaIA = {
        modo: "ia",
        jugadores: [{ nombre, rol }],
        ia: {
          rol: rol === "fugitivo" ? "perseguidor" : "fugitivo",
          nivel
        }
      };

      window.location.href = "sala.html";
    });
  }
});

