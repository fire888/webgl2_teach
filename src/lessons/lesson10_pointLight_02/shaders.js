
export const easyShaderV = `
attribute vec4 a_position;
attribute vec3 a_normal;

uniform mat4 u_world;
uniform mat4 u_worldViewProjection;

varying vec3 v_normal;
varying vec3 v_surfaceToLight;

void main() {
  gl_Position = u_worldViewProjection * a_position;

  v_normal = mat3(u_worldViewProjection) * a_normal;

  vec3 surfaceWorldPosition = (u_worldViewProjection * a_position).xyz;
  vec3 lightPos = vec3(0., 1., -1.);
  v_surfaceToLight = lightPos - surfaceWorldPosition;
}
`

export const easyShaderF = `precision mediump float;
uniform vec3 u_color;

varying vec3 v_normal;
varying vec3 v_surfaceToLight;

void main() {
    vec3 normal = normalize(v_normal);

    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    float light = dot(normal, surfaceToLightDirection);
    
    gl_FragColor = vec4(u_color * light, 1.);
    //gl_FragColor = vec4(1.);
}
`
