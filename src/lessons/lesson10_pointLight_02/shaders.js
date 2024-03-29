
export const easyShaderV = `
attribute vec4 a_position;
attribute vec3 a_normal;

uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
uniform vec3 u_viewWorldPosition;

varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

void main() {
  gl_Position = u_worldViewProjection * a_position;

  v_normal = mat3(u_worldViewProjection) * a_normal;

  vec3 surfaceWorldPosition = (u_worldViewProjection * a_position).xyz;
  vec3 lightPos = vec3(-1., 5., 0.);
  v_surfaceToLight = lightPos - surfaceWorldPosition;
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}
`

export const easyShaderF = `precision mediump float;
uniform vec3 u_color;

varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

void main() {
    vec3 normal = normalize(v_normal);
    
    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);


    float light = dot(normal, surfaceToLightDirection);
    float specular = 0.0;
    if (light > 0.5) {
        specular = pow(dot(normal, halfVector), 200.);
    }
 
    
    gl_FragColor = vec4(u_color * light, 1.);
    gl_FragColor.rgb += clamp(specular, 0., 1.);
}
`
