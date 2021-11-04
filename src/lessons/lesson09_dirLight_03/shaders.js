
export const easyShaderV = `
attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
`

export const easyShaderF = `precision mediump float;

// Passed in from the vertex shader.
varying vec4 v_color;

void main() {
   gl_FragColor = v_color;
}
`











/*******************************************************/


export const vSh = `
attribute vec4 a_position;
attribute vec3 a_normal;
uniform mat4 u_viewMatrix;

varying vec3 v_normal;
varying mat4 v_viewMatrix;

void main() {
    //mat4 inv = inverse(u_viewMatrix);
    v_normal = mat3(u_viewMatrix) * a_normal;
    gl_Position = u_viewMatrix * a_position;
}`




export const fSh = `
precision mediump float;
uniform vec3 u_reverseLightDirection;
uniform vec3 u_color;
uniform float u_flash;
uniform mat4 u_invRotMatrix;

varying vec3 v_normal;

void main() {
    vec3 normal = mat3(u_invRotMatrix) * v_normal;
    normal = mat3(u_invRotMatrix) * normal;
    float light = dot(normal, u_reverseLightDirection);
    vec3 color = mix(u_color, vec3(0., 0., 0.5 + u_color.z), light);

    gl_FragColor = vec4(color, 1.);
    //gl_FragColor = vec4(vec3(u_flash), 1.);
}`