/**
 * @param {number} value
 * @returns {string} 
 */
const colorChannelToHex = (value) => {
  return Math.floor(value * 255).toString(16).padStart(2, '0');
};

/**
 * @param {[number, number, number, number]} param0
 * @returns {string}
 */
const colorToRGBHex = ([r, g, b, _a]) => {
  const r1 = colorChannelToHex(r);
  const g1 = colorChannelToHex(g);
  const b1 = colorChannelToHex(b);
  return `#${r1}${g1}${b1}`;
};

class Application {
  /**
   * @type {WebGL2RenderingContext}
   */
  #gl;
  #clearColor = [0., 0., 0., 1.];
  #keyColors = {
    k: [0., 0., 0., 1.],
    r: [1., 0., 0., 1.],
    y: [1., 1., 0., 1.],
    g: [0., 1., 0., 1.],
    c: [0., 1., 1., 1.],
    b: [0., 0., 1., 1.],
    m: [1., 0., 1., 1.],
    w: [1., 1., 1., 1.],
  };

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.#gl = canvas.getContext('webgl2');
    if (!this.#gl) {
      throw 'Failed to initialize a WebGL2 context';
    }
    console.log('WebGL2 initialized!');
  }

  resizeToFitWindow() {
    /**
     * @type {HTMLDivElement}
     */
    const parent = this.#gl.canvas.parentElement;
    const {clientWidth, clientHeight} = parent;
    this.#gl.canvas.width = clientWidth;
    this.#gl.canvas.height = clientHeight;
  }

  render() {
    const gl = this.#gl;
    const canvas = gl.canvas;
    const [r, g, b, a] = this.#clearColor;
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  /**
   * @param {string} key
   */
  pressKey(key) {
    const gl = this.#gl;
    if (key === '*') {
      this.#clearColor = [Math.random(), Math.random(), Math.random(), 1.];
    } else if (key === '?') {
      /**
       * @type {[number, number, number, number]}
       */
      const color = gl.getParameter(gl.COLOR_CLEAR_VALUE);
      const colorString = colorToRGBHex(color);
      console.log(`Clear color is ${colorString}`);
    } else {
      const color = this.#keyColors[key];
      if (color != null) {
        this.#clearColor = color;
      }
    }
  }
}

/**
 * @type {Application?}
 */
let app;

const window_onDOMContentLoaded = () => {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById('canvas');
  if (!canvas) {
    console.error('Sorry! No HTML5 Canvas was found on this page.');
    return;
  }
  app = new Application(canvas);
  app.resizeToFitWindow();
  app.render();
};

const window_onResize = () => {
  app?.resizeToFitWindow();
  app?.render();
};

const window_onKeyDown = (event) => {
  app?.pressKey(event.key);
  app?.render();
};

window.addEventListener('DOMContentLoaded', window_onDOMContentLoaded);
window.addEventListener('resize', window_onResize);
window.addEventListener('keydown', window_onKeyDown);
