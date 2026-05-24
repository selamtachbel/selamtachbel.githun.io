function pad(n){ return n.toString().padStart(2, '0'); }



function updateClock(){

  const now = new Date();

  const h = pad(now.getHours());

  const m = pad(now.getMinutes());

  const s = pad(now.getSeconds());

  document.getElementById('clock').textContent = `${h}:${m}:${s}`;

}

updateClock();

setInterval(updateClock, 1000);