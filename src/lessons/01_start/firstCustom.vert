#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
uniform vec2 u_offset;

// all shaders have a main function
void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    vec4 pos = a_position + vec4(u_offset, 0., 0.);

    gl_Position = pos;
}