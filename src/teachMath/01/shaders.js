
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
// Main
//

out vec4 outColor;

void main()
{
    vec2 uv = v_uv;
    
    float y = sqrt(.5 - )
    
    vec3 col = vec3(sin((uv.x + 1.) / 2.), .0, .0);

    outColor = vec4(col, 1.0);
}
`
