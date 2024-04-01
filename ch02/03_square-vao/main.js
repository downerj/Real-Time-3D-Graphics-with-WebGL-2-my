import {
  getCanvas,
  getWebGL2Context,
  resizeCanvasToFitWindow
} from "./canvas.js";
import { Colors } from "./color.js";
import { ShaderTools } from "./shader.js";

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
   * @type {number}
   */
  indexCount;
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
  }

  /**
   * @returns {Promise<void>}
   */
  async #initializePrograms() {
    const gl = this.#gl;
    const vertexSource = await loadTextFile('main.vert');
    const fragmentSource = await loadTextFile('main.frag');
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
      -.5, .5, 0,
      -.5, -.5, 0,
      .5, -.5, 0,
      .5, .5, 0
    ];
    const indices = [0, 1, 2, 0, 2, 3];
    const squareVAO = gl.createVertexArray();
    gl.bindVertexArray(squareVAO);
    const squareVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(locations.vertexPosition);
    gl.vertexAttribPointer(locations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    const squareIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    const squareVAOData = new ProgramVAOData();
    squareVAOData.vertexArray = squareVAO;
    squareVAOData.indexCount = indices.length;
    this.#vaoData.push(squareVAOData);
  }

  render() {
    const gl = this.#gl;
    const { canvas } = gl;
    const [r, g, b, a] = this.#clearColor;

    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.useProgram(this.#program);
    for (const data of this.#vaoData) {
      gl.bindVertexArray(data.vertexArray);
      gl.drawElements(gl.TRIANGLES, data.indexCount, gl.UNSIGNED_SHORT, 0);
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
  app.render();

  const window_onResize = () => {
    resizeCanvasToFitWindow(canvas);
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
