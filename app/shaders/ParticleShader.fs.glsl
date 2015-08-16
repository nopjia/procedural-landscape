#inject shaders/chunks/Constants.glsl

void main() {
  vec2 coord = gl_PointCoord*2.0 - 1.0;
  float alpha = smoothstep(0.8, 1.0, 1.0-length(coord) + 0.8);
  alpha *= 0.5;

  vec3 color = vec3(1.0, 0.7, 0.7);

  gl_FragColor = vec4(color, alpha);
}