import {
  getCanvasBySelector,
  getWebGL2Context,
  resizeCanvasToFitWindow
} from "./canvas.js";
import {
  colorToRGBHex,
  generateRandomColor,
  Colors
} from "./color.js";

class Application {
  /**
   * @type {WebGL2RenderingContext}
   */
  #gl;
  #clearColor = Colors.Black;
  #keyColors = {
    k: Colors.Black,
    r: Colors.Red,
    y: Colors.Yellow,
    g: Colors.Green,
    c: Colors.Cyan,
    b: Colors.Blue,
    m: Colors.Magenta,
    w: Colors.White,
  };

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    const gl = getWebGL2Context(canvas);
    if (!gl) {
      throw 'Failed to initialize the application.';
    }
    this.#gl = gl;
    console.log('WebGL2 initialized!');
  }

  render() {
    const gl = this.#gl;
    const {canvas} = gl;
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
      this.#clearColor = generateRandomColor();
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

const window_onDOMContentLoaded = () => {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = getCanvasBySelector('#canvas');
  if (!canvas) {
    return;
  }
  resizeCanvasToFitWindow(canvas);
  const app = new Application(canvas);
  app.render();

  const window_onResize = () => {
    resizeCanvasToFitWindow();
    app.render();
  };
  
  const window_onKeyDown = (event) => {
    app.pressKey(event.key);
    app.render();
  };

  window.addEventListener('resize', window_onResize);
  window.addEventListener('keydown', window_onKeyDown);
};

window.addEventListener('DOMContentLoaded', window_onDOMContentLoaded);
