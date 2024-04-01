/**
 * @returns {HTMLCanvasElement?}
 */
export const getCanvas = () => {
  /**
   * @type {HTMLCanvasElement?}
   */
  const canvas = document.querySelector('#canvas');
  if (!canvas) {
    console.error(`Cannot find a canvas using the CSS selector "${selectors}" on this page.`);
  }
  return canvas;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {WebGL2RenderingContext?}
 */
export const getWebGL2Context = (canvas) => {
  /**
   * @type {WebGL2RenderingContext?}
   */
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    console.error('WebGL2 is not supported in your browser.');
  }
  return gl;
}

/**
 * @param {HTMLCanvasElement} canvas
 */
export const resizeCanvasToFitWindow = (canvas) => {
  /**
   * @type {HTMLElement}
   */
  const parent = canvas.parentElement;
  const {clientWidth, clientHeight} = parent;
  canvas.width = clientWidth;
  canvas.height = clientHeight;
};
