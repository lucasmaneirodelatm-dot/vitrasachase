// common.js — versión infalible

(function(){

  // Permitir audios tras primer click
  window.__audioAllowed = false;
  window.addEventListener("click", () => { window.__audioAllowed = true; }, { once:true });

  // Reproduce audio seguro
  window.playClip = async function(url){
    if (!window.__audioAllowed) {
      console.log("Audio bloqueado hasta interacción del usuario");
      return null;
    }
    try {
      const a = new Audio(url);
      await a.play();
      return a;
    } catch (e) {
      console.warn("Audio play error:", e);
      return null;
    }
  };

  // Fetch JSON seguro
  window.safeFetchJson = async function(url){
    try {
      const r = await fetch(url);
      if (!r.ok) throw 0;
      return await r.json();
    } catch(e){
      return null;
    }
  };

  // ⛔ IMPORTANTE: Loader infalible — no depende de nada, no espera nada
  window.waitForResourcesThenShow = function(){
    document.addEventListener("DOMContentLoaded", () => {
      const loader = document.getElementById("loader");
      const main = document.getElementById("main");

      // Siempre lo ocultamos después de 350ms, funcione lo que funcione
      setTimeout(() => {
        if (loader) loader.style.display = "none";
        if (main) main.classList.remove("hidden");
      }, 350);
    });
  };

})();
