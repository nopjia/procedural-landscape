#define SIZE 100

varying vec2 vUv;

void main() {
  vec3 color = vec3(1.0, 0.0, 0.0);

  const float LINE_WIDTH = 0.02;
  float line = 0.0;
  if (any( lessThan(mod(vUv*vec2(SIZE), vec2(1.0)), vec2(LINE_WIDTH)) ))
    line = 1.0;

  color *= line;
  gl_FragColor = vec4(color, 1.0);
}