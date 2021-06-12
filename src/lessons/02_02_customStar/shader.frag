#version 300 es

precision highp float;

out vec4 colorOut;
uniform vec4 u_color;

void main() {
    //colorOut = vec4(1, 0, 0, 1);
    colorOut = u_color;
}