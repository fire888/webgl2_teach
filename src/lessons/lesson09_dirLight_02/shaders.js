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
    vec3 normal = mat3(u_invRotMatrix) * normalize(v_normal);
    normal = mat3(u_invRotMatrix) * normal;
    float light = dot(normal, u_reverseLightDirection);
    vec3 color = mix(u_color, vec3(0., 0., 0.5), max(light, 0.)) + vec3(u_flash);

    gl_FragColor = vec4(color, 1.);
    //gl_FragColor = vec4( vec3(u_flash), 1.);
}`