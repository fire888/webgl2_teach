#version 300 es

in vec4 a_position;
uniform vec2 u_offset;
uniform vec2 u_rot;

void main() {
  vec4 rotated = vec4(
    a_position.x * u_rot.y + a_position.y * u_rot.x,
    a_position.y * u_rot.y - a_position.x * u_rot.x,
    0.,
    1.
  );

  vec4 pos = vec4(rotated.x + u_offset.x, rotated.y + u_offset.y, 0, 1);

  gl_Position = pos;
}
