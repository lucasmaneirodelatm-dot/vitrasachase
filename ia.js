// ia.js - pequeña librería para comportamiento IA en sala
// Expuesto como función simple: decide acciones cada X ms según nivel
window.IA = {
  createController: function(playerObj, level='normal'){
    let aggressiveness = (level==='easy')?0.25:(level==='hard')?0.85:0.5;
    let iv;
    return {
      start: function(onAction){
        iv = setInterval(()=>{
          // IA decide: 30% coger bus si hay 'ahora', o moverse
          const rnd = Math.random();
          if(rnd < aggressiveness*0.6){
            onAction({action:'try_board', reason:'IA decidió intentar embarcar'});
          } else if(rnd < 0.75){
            onAction({action:'walk_nearby', reason:'IA camina a parada cercana'});
          } else {
            onAction({action:'wait', reason:'IA espera'});
          }
        }, 3500);
      },
      stop: function(){ clearInterval(iv); }
    };
  }
};
