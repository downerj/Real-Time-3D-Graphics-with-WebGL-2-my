export class ShaderTools {
  /**
   * @type {WebGL2RenderingContext} gl
   */
  #gl;

  /**
   * @param {WebGL2RenderingContext} gl
   */
  constructor(gl) {
    this.#gl = gl;
  }

  /**
   * @param {string} source
   * @param {WebGL2RenderingContext.VERTEX_SHADER | WebGL2RenderingContext.FRAGMENT_SHADER} type
   * @returns {WebGLShader}
   */
  #initializeShader(source, type) {
    const gl = this.#gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  /**
   * @param {string} vertexSource
   * @param {string} fragmentSource
   * @returns {WebGLProgram?}
   */
  initializeProgram(vertexSource, fragmentSource) {
    const gl = this.#gl;
    const vertexShader = this.#initializeShader(vertexSource, gl.VERTEX_SHADER);
    if (!vertexShader) {
      return null;
    }
    const fragmentShader = this.#initializeShader(fragmentSource, gl.FRAGMENT_SHADER);
    if (!fragmentShader) {
      return null;
    }
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const status = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!status) {
      const programLog = gl.getProgramInfoLog(program);
      const vertexLog = gl.getShaderInfoLog(vertexShader);
      const fragmentLog = gl.getShaderInfoLog(fragmentShader);
      if (programLog) {
        console.error(`Program info log: ${programLog}`);
      }
      if (vertexLog) {
        console.error(`Vertex shader info log: ${vertexLog}`);
      }
      if (fragmentLog) {
        console.error(`Fragment shader info log: ${fragmentLog}`);
      }
    }
    gl.detachShader(program, vertexShader);
    gl.deleteShader(vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(fragmentShader);
    return status ? program : null;
  }
}
