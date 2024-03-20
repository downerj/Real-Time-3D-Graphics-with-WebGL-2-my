/**
 * @type {HTMLCanvasElement}
 */
let canvas;

const resizeCanvas = () => {
  if (canvas == null) {
    return;
  }
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
};

const window_onDOMContentLoaded = () => {
  canvas = document.getElementById('canvas');
  resizeCanvas();
};

const window_onResize = () => {
  resizeCanvas();
};

window.addEventListener('DOMContentLoaded', window_onDOMContentLoaded);
window.addEventListener('resize', window_onResize);
