#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec2 v_texcoord;

out vec4 outColor;

uniform sampler2D u_texture;

void main() {
    outColor = texture(u_texture, v_texcoord);
}