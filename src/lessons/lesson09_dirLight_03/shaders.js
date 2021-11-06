
export const easyShaderV = `
attribute vec4 a_position;
attribute vec3 a_normal;

uniform mat4 u_worldViewProjection;
uniform mat4 u_world;
uniform mat4 u_transformItemMatrix;

varying vec3 v_normal;

void main() {
  gl_Position = u_transformItemMatrix * a_position;

  v_normal = mat3(u_world * u_transformItemMatrix) * a_normal;
}
`

export const easyShaderF = `precision mediump float;
uniform vec3 u_reverseLightDirection;
uniform vec3 u_color;

varying vec3 v_normal;

void main() {
    vec3 normal = normalize(v_normal);
    float light = min(max(dot(normal, u_reverseLightDirection), .01), .9);
    
    gl_FragColor = vec4(u_color * light, 1.);
}
`
