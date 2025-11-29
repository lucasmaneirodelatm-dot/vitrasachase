document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const main = document.getElementById("main");

  setTimeout(() => {
    loader.classList.add("hidden");
    main.classList.remove("hidden");
  }, 600);
});

// Utilidades
function randomItem(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
