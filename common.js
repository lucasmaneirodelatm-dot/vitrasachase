// common.js — estable y compatible

(function(){

  window.__audioAllowed = false;
  window.addEventListener("click", () => { window.__audioAllowed = true; }, { once:true });

  window.playClip = async function(url){
    if (!window.__audioAllowed) return;
    try { new Audio(url).play(); } catch(e){}
  };

  window.safeFetchJson = async function(url){
    try {
      const r = await fetch(url);
      if (!r.ok) throw 0;
      return await r.json();
    } catch(e){ return null; }
  };

  // LOADER INFALIBLE
  window.waitForResourcesThenShow = function(){
    document.addEventListener("DOMContentLoaded", () => {
      const loader = document.getElementById("loader");
      const main = document.getElementById("main");
      setTimeout(() => {
        if (loader) loader.style.display = "none";
        if (main) main.classList.remove("hidden");
      }, 250);
    });
  };

})();
