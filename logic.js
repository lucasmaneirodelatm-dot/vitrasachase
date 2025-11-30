// logic.js - index + helpers (no modificar para el loader)
/* Loader: espera resourcesLoaded() y oculta el loader sin texto */
function resourcesLoaded(){
  // puede extenderse para audio/images. Por ahora: comprobamos que logo y gif existen en la red.
  const img = document.getElementById('loader-img');
  return img && img.complete;
}
function hideLoader(){
  document.querySelectorAll('.loader').forEach(e=>e.classList.add('hidden'));
  document.getElementById('main')?.classList.remove('hidden');
}
function waitForResourcesThenShow(){
  const tryShow = () => {
    if(resourcesLoaded()){
      // small delay para que no parpadee
      setTimeout(hideLoader, 80);
    } else {
      setTimeout(tryShow, 200);
    }
  };
  tryShow();
}
document.addEventListener('DOMContentLoaded', ()=> {
  waitForResourcesThenShow();
});
