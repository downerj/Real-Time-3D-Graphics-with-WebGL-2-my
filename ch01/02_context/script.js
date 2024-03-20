class Application {
  /**
   * @type {WebGL2RenderingContext}
   */
  #gl;

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
};

const window_onResize = () => {
  app?.resizeToFitWindow();
};

window.addEventListener('DOMContentLoaded', window_onDOMContentLoaded);
window.addEventListener('resize', window_onResize);
