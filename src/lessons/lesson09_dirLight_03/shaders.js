
export const easyShaderV = `
attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec4 a_color;

uniform mat4 u_worldViewProjection;
uniform mat4 u_world;
uniform mat4 u_transformItemMatrix;

varying vec4 v_color;
varying vec3 v_normal;

void main() {
  // Multiply the position by the matrix.

  
  gl_Position = u_transformItemMatrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
  v_normal = mat3(u_world * u_transformItemMatrix) * a_normal;
}
`

export const easyShaderF = `precision mediump float;
uniform vec3 u_reverseLightDirection;

varying vec4 v_color;
varying vec3 v_normal;

void main() {
    vec3 normal = normalize(v_normal);
    float light = dot(normal, u_reverseLightDirection);
    
    gl_FragColor = v_color;
    gl_FragColor.rgb *= light;
}
`
