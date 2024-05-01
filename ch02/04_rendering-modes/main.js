import { configureControls } from '../../common/js/gui.js';
import {
  getCanvas,
  getWebGL2Context,
  resizeCanvasToFitWindow
} from "./canvas.js";
import { Colors } from "./color.js";
import { ShaderTools } from "./shader.js";
import { AnimationLoop } from "./animation.js";

/**
 * @param {string} path
 * @returns {Promise<string?>}
 */
const loadTextFile = async (path) => {
  try {
    const response = await fetch(path);
    const text = await response.text();
    return text;
  } catch (e) {
    console.error(`Could not load file at path "${path}": ${e}`);
    return null;
  }
};

class ProgramAttributeLocations {
  /**
   * @type {number}
   */
  vertexPosition;
}

class ProgramVAOData {
  /**
   * @type {WebGLVertexArrayObject}
   */
  vertexArray;
  /**
   * @type {Uint16Array}
   */
  indices;
}

class Application {
  /**
   * @type {WebGL2RenderingContext}
   */
  #gl;
  /**
   * @type {ShaderTools}
   */
  #shaderTools;
  #clearColor = Colors.Black;
  /**
   * @type {WebGLProgram}
   */
  #program;
  /**
   * @type {ProgramAttributeLocations}
   */
  #locations;
  /**
   * @type {ProgramVAOData[]}
   */
  #vaoData = [];
  /**
   * @type {{[name: string]: {mode: number, indices: Uint16Array}}}
   */
  static #renderModeMap = {
    Triangles: {
      mode: WebGL2RenderingContext.TRIANGLES,
      indices: new Uint16Array([0, 1, 2, 2, 3, 4]),
    },
    Lines: {
      mode: WebGL2RenderingContext.LINES,
      indices: new Uint16Array([1, 3, 0, 4, 1, 2, 2, 3]),
    },
    Points: {
      mode: WebGL2RenderingContext.POINTS,
      indices: new Uint16Array([1, 2, 3]),
    },
    'Line Loop': {
      mode: WebGL2RenderingContext.LINE_LOOP,
      indices: new Uint16Array([2, 3, 4, 1, 0]),
    },
    'Line Strip': {
      mode: WebGL2RenderingContext.LINE_STRIP,
      indices: new Uint16Array([2, 3, 4, 1, 0]),
    },
    'Triangle Strip': {
      mode: WebGL2RenderingContext.TRIANGLE_STRIP,
      indices: new Uint16Array([0, 1, 2, 3, 4]),
    },
    'Triangle Fan': {
      mode: WebGL2RenderingContext.TRIANGLE_FAN,
      indices: new Uint16Array([0, 1, 2, 3, 4]),
    },
  };
  /**
   * @type {'Triangles' | 'Lines' | 'Points' | 'Line Loop' | 'Line Strip' | 'Triangle Strip' | 'Triangle Fan'}
   */
  #renderMode = 'Triangles';
  /**
   * @type {AnimationLoop}
   */
  #animationLoop = new AnimationLoop(this.#onTick.bind(this), 60);

  /**
   * @param {HTMLCanvasElement} canvas
   */
  async initializeGraphics(canvas) {
    const gl = getWebGL2Context(canvas);
    if (!gl) {
      throw 'Failed to initialize the application.';
    }
    this.#gl = gl;
    console.log('WebGL2 initialized!');
    this.#shaderTools = new ShaderTools(gl);
    await this.#initializePrograms();
    this.#initializeBuffers();
    this.#initializeControls();
  }

  /**
   * @returns {Promise<void>}
   */
  async #initializePrograms() {
    const gl = this.#gl;
    const vertexSource = (await loadTextFile('main.vert'))?.trim();
    const fragmentSource = (await loadTextFile('main.frag'))?.trim();
    if (!vertexSource || !fragmentSource) {
      return;
    }
    const program = this.#shaderTools.initializeProgram(vertexSource, fragmentSource);
    if (!program) {
      throw 'Failed to initialize the application.';
    }
    this.#program = program;
    gl.useProgram(program);
    this.#locations = new ProgramAttributeLocations();
    for (const key in this.#locations) {
      this.#locations[key] = gl.getAttribLocation(program, key);
    }
  }

  #initializeBuffers() {
    const gl = this.#gl;
    const locations = this.#locations;
    const vertices = [
      -.5, -.5, 0,
      -.25, .5, 0,
      0, -.5, 0,
      .25, .5, 0,
      .5, -.5, 0
    ];
    const { indices } = Application.#renderModeMap.Triangles;
    const trapezoidVAO = gl.createVertexArray();
    gl.bindVertexArray(trapezoidVAO);
    const trapezoidVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trapezoidVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(locations.vertexPosition);
    gl.vertexAttribPointer(locations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    const trapezoidIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trapezoidIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    const trapezoidVAOData = new ProgramVAOData();
    trapezoidVAOData.vertexArray = trapezoidVAO;
    trapezoidVAOData.incides = indices;
    this.#vaoData.push(trapezoidVAOData);
  }

  #initializeControls() {
    configureControls({
      'Rendering Mode': {
        value: this.#renderMode,
        options: Object.keys(Application.#renderModeMap),
        onChange: v => this.#renderMode = v
      }
    });
  }

  run() {
    this.#animationLoop.resume();
  }

  #onTick(_timestamp) {
    this.#render();
  }

  #render() {
    const gl = this.#gl;
    const { canvas } = gl;
    const [ r, g, b, a ] = this.#clearColor;

    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.useProgram(this.#program);
    for (const data of this.#vaoData) {
      const {mode, indices} = Application.#renderModeMap[this.#renderMode];
      gl.bindVertexArray(data.vertexArray);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
      gl.drawElements(mode, indices.length, gl.UNSIGNED_SHORT, 0);
    }
    gl.bindVertexArray(null);
  }

  /**
   * @param {string} key
   */
  pressKey(key) { }
}

const window_onDOMContentLoaded = async () => {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = getCanvas();
  if (!canvas) {
    return;
  }
  resizeCanvasToFitWindow(canvas);

  const app = new Application();
  try {
    await app.initializeGraphics(canvas);
  } catch (e) {
    console.error(e);
    return;
  }
  app.run();

  const window_onResize = () => {
    resizeCanvasToFitWindow(canvas);
  };

  const window_onKeyDown = (event) => {
    app.pressKey(event.key);
  };

  window.addEventListener('resize', window_onResize);
  window.addEventListener('keydown', window_onKeyDown);
};

window.addEventListener('DOMContentLoaded', window_onDOMContentLoaded);
