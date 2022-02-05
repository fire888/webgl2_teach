
export const easyShaderV = `
attribute vec4 a_position;
varying vec2 v_uv;

void main() {
  v_uv = vec2(a_position[0], a_position[1]);

  gl_Position = a_position;
}
`


  


// Cyrcles from https://www.shadertoy.com/view/7dByDG
export const easyShaderF = `
precision mediump float;
#define PI 3.14159265359
uniform float u_time;
varying vec2 v_uv;

float circle(vec2 uv, vec2 position, float radius, float blur)
{
	return 1.0 - smoothstep(radius - blur, radius + blur, length(uv - position));
}


float lineCircles(vec2 uv, vec2 position, float radius, float blur) 
{
    float offset = .3;

    float color = circle(uv, position, radius, blur);
    position[1] -= offset; 
    color += circle(uv, position, radius, blur);
    position[1] -= offset; 
    color += circle(uv, position, radius, blur);
    position[1] -= offset; 
    color += circle(uv, position, radius, blur);
    position[1] -= offset;  
    color += circle(uv, position, radius, blur);
    position[1] -= offset; 
    color += circle(uv, position, radius, blur);
    position[1] -= offset; 
    color += circle(uv, position, radius, blur);
    position[1] -= offset; 
    color += circle(uv, position, radius, blur);
    return color;
}

float manyLinesCircles(vec2 uv, vec2 position, float radius, float blur) {
    float offset = .3;

    float color = lineCircles(uv, position, radius, blur);
    position[0] -= offset; 
    color += lineCircles(uv, position, radius, blur);
    position[0] -= offset; 
    color += lineCircles(uv, position, radius, blur);
    position[0] -= offset; 
    color += lineCircles(uv, position, radius, blur);
    position[0] -= offset;  
    color += lineCircles(uv, position, radius, blur);
    position[0] -= offset; 
    color += lineCircles(uv, position, radius, blur);
    position[0] -= offset; 
    color += lineCircles(uv, position, radius, blur);
    position[0] -= offset; 
    color += lineCircles(uv, position, radius, blur);
    return color;
}


vec2 rotate(vec2 original, float angle, vec2 pivot) 
{
    mat2 rotation = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
    vec2 final = original;
    final -= pivot;
    final *= rotation;
    final += pivot;
    return final;
}



void main() {
    vec2 uv = v_uv / .5;


    vec3 color = vec3(0.0);
    
    float t = cos(u_time) * 2.;
    

    vec2 uvR = rotate(uv, u_time, vec2(0.0));

	  float c1 = manyLinesCircles(uvR, vec2(1., 1.), 0.05, 0.001);

    vec2 uvG = rotate(uv, 2. -u_time, vec2(0.0));
    
    float c2 = manyLinesCircles(uvG, vec2(1., 1.), 0.05, 0.001);
    
    vec2 uvB = rotate(uv, u_time * 0.5, vec2(0.0));
  
    float c3 = manyLinesCircles(uvB, vec2(1., 1.), 0.05, 0.001);
    

    color.r = 1.0 * c1  + 0.1 * c2   + 0.1 * c3;   
    color.g = 1.0 * c1  + 0.8 * c2   + 0.3 * c3; 
    color.b = 0.5 * c1  + 0.9 * c2   + 0.5 * c3; 

    gl_FragColor = vec4(color, 1.0);
}
`