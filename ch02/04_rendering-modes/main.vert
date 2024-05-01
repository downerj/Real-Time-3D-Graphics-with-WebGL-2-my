#version 300 es

precision mediump float;

in vec3 vertexPosition;

void main(void) {
  gl_PointSize = 40.;
  gl_Position = vec4(vertexPosition, 1.);
}
