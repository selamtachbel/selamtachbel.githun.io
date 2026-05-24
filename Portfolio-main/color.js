function randomColor(){

  const r = Math.floor(Math.random()*256);

  const g = Math.floor(Math.random()*256);

  const b = Math.floor(Math.random()*256);

  return `rgb(${r}, ${g}, ${b})`;

}



const btn = document.getElementById('change');

const code = document.getElementById('code');



btn.addEventListener('click', () => {

  const c = randomColor();

  document.body.style.backgroundColor = c;

  code.textContent = `Current color: ${c}`;

});