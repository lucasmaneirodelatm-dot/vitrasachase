const mode = localStorage.getItem('mode') || 'local';

let jugador = {
  rol: mode === 'ia' ? 'fugitivo' : 'fugitivo',
  parada: paradas[0]
};

document.getElementById('title').textContent =
  `Modo: ${mode.toUpperCase()}`;

updateInfo();

function updateInfo() {
  document.getElementById('info').textContent =
    `Rol: ${jugador.rol} | Parada: ${jugador.parada.nombre}`;
}

function move() {
  const next = paradas[Math.floor(Math.random() * paradas.length)];
  jugador.parada = next;
  updateInfo();
}
