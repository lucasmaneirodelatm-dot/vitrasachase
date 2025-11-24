// worldState.js
// Lógica básica de estado del mundo (buses, paradas, líneas). Pensado para ejecutarse en servidor (Node)
// Si lo quieres en frontend, adapta fetch->XHR a fetch con CORS o incrusta JSON.
const fs = typeof require !== 'undefined' ? require('fs') : null;

class WorldState {
  constructor({paradasPath, lineasPath, busesPath} = {}) {
    this.paradasPath = paradasPath;
    this.lineasPath = lineasPath;
    this.busesPath = busesPath;
    this.paradas = {};
    this.lineas = [];
    this.buses = [];
    this.started = false;
  }

  async loadJSON(path) {
    if (typeof fetch !== 'undefined') {
      const r = await fetch(path);
      return r.json();
    } else if (fs) {
      return JSON.parse(fs.readFileSync(path,'utf8'));
    } else throw new Error('No fetch ni fs disponible');
  }

  async init() {
    this.paradas = await this.loadJSON(this.paradasPath);
    this.lineas = await this.loadJSON(this.lineasPath);
    this.buses = await this.loadJSON(this.busesPath);
    // Normalizar: si paradas json es array o map
    if (Array.isArray(this.paradas)) this.paradasMap = Object.fromEntries(this.paradas.map(p=>[p.id||p.codigo, p]));
    else if (this.paradas.paradas) this.paradasMap = Object.fromEntries(this.paradas.paradas.map(p=>[p.id||p.codigo, p]));
    else this.paradasMap = this.paradas;
    // Inicializar vehículos de ejemplo: si buses es plantilla agrégalas con estado
    this.simBuses = [];
    (this.buses || []).forEach((b, i) => {
      this.simBuses.push({
        id: b.id || `sim-${i}`,
        line: b.line || b.linea || b.lineId || 'unknown',
        capacity: b.capacity || 30,
        passengers: Math.floor(Math.random()*5),
        posIndex: 0,
        delay: 0
      });
    });
    return this;
  }

  // mueve cada bus al siguiente índice de parada de su línea (simulación simple)
  step() {
    this.simBuses.forEach(bus => {
      bus.posIndex++;
      // ciclo simple
      const line = this.lineas.find(l => (l.id||l.codigo)===bus.line);
      const totalStops = line && line.paradas ? line.paradas.length : 6;
      if (bus.posIndex >= totalStops) bus.posIndex = 0;
      // aleatorio: pasajeros suben/bajan
      const change = Math.floor(Math.random()*4)-1;
      bus.passengers = Math.max(0, Math.min(bus.capacity, bus.passengers + change));
    });
  }

  getBusesAtStop(stopId) {
    // devuelve buses cuyo index actual coincida con índice de la parada en su línea
    const res = [];
    this.simBuses.forEach(bus=>{
      const line = this.lineas.find(l => (l.id||l.codigo)===bus.line);
      if (!line || !line.paradas) return;
      const stopIndex = line.paradas.map(String).indexOf(String(stopId));
      if (stopIndex === -1) return;
      if (bus.posIndex === stopIndex) res.push(bus);
    });
    return res;
  }

  attemptBoard(busId, player) {
    const bus = this.simBuses.find(b=>b.id===busId);
    if (!bus) return {ok:false, reason:'no bus'};
    if (bus.passengers >= bus.capacity) return {ok:false, reason:'full'};
    bus.passengers++;
    return {ok:true, bus};
  }
}

// Export para Node
if (typeof module !== 'undefined') module.exports = WorldState;
