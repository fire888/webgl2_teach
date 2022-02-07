
export const easyShaderV = `#version 300 es    
in vec4 a_position;
out vec2 v_uv; 

void main() {
    v_uv = vec2(a_position.x, a_position.y);

    gl_Position = a_position;
}
`


  


// https://www.shadertoy.com/view/ss2cDK
export const easyShaderF = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform float u_time; 



//
// Pseudorandom functions.
//

float random (float x) {
	float f = 43758.5453123;
	return fract(sin(x) * f);
}

float random2 (vec2 c, float t) {
  vec2 vBig = vec2(456789.23444, 432156.878888);

  c.x += sin(t / 100.);
  c.y += cos(t / 100.);
  
  return fract((sin(dot(c, vBig))) * 43758.5453123);
}


//
// Main
//

out vec4 outColor;

void main()
{
    vec2 uv = v_uv * 20.;
    
    float r = random2(floor(uv), u_time);
    vec3 col = vec3(.0 + r, .0, .0);


    

    outColor = vec4(col, 1.0);
}
`