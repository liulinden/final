const canvas = document.getElementById('cvs')

const dpr = Math.ceil(window.devicePixelRatio || 1);
canvas.width=canvas.clientWidth*dpr;
canvas.height=canvas.clientHeight*dpr;

