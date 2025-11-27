// common.js — utilidades compartidas
(function(){
  // permiso de reproducción de audios tras interacción del usuario
  window.__audioAllowed = false;
  window.addEventListener('click', ()=> { window.__audioAllowed = true; }, {once:true});

  function resourcesLoaded(){
    // Puedes ampliar: comprobar imágenes/audios concretos
    return true;
  }

  window.waitForResourcesThenShow = function(){
    document.addEventListener('DOMContentLoaded', ()=>{
      // intenta esperar recursos reales si los defines
      const interval = setInterval(()=>{
        if (resourcesLoaded()) {
          clearInterval(interval);
          const loader = document.getElementById('loader');
          const main = document.getElementById('main');
          if (loader) loader.style.display = 'none';
          if (main) main.classList.remove('hidden');
        }
      }, 80);
    });
  };

  window.playClip = async function(url){
    if (!window.__audioAllowed) return console.log('Audio bloqueado hasta interacción del usuario');
    try {
      const a = new Audio(url);
      await a.play();
      return a;
    } catch (e) { console.warn('Audio play error', e); return null; }
  };

  // Helper simple para fetch + safe JSON
  window.safeFetchJson = async function(url){
    try { const r = await fetch(url); if (!r.ok) throw new Error('not ok'); return await r.json(); }
    catch(e){ return null; }
  };

  // Exponer utilidades globalmente
  window.__utils = {resourcesLoaded, playClip, safeFetchJson};
})();
