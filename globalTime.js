// globalTime.js
// Simula un reloj global para el juego. Exporta una API pequeña.
// Si pones esto en el servidor, este será la referencia para todas las partidas.
class GlobalTime {
  constructor(tickMs = 1000) {
    this.tickMs = tickMs;
    this.seconds = 0;
    this.running = false;
    this.subs = [];
  }
  start(){
    if(this.running) return;
    this.running = true;
    this._timer = setInterval(()=> {
      this.seconds++;
      this.subs.forEach(fn => { try{ fn(this.seconds);}catch(e){} });
    }, this.tickMs);
  }
  stop(){
    clearInterval(this._timer);
    this.running = false;
  }
  onTick(fn){ this.subs.push(fn); return ()=> this.subs = this.subs.filter(x=>x!==fn); }
  now(){ return this.seconds; }
  format(){ // formato mm:ss
    const m = Math.floor(this.seconds/60).toString().padStart(2,'0');
    const s = (this.seconds%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }
}
if(typeof module !== 'undefined') module.exports = GlobalTime;
