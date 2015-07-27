#define SIZE 100

varying vec2 vUv;

void main() {
  vec3 color = vec3(vUv.x, vUv.y, 0.0);

  float line = 0.0;
  vec2 coords = vUv * vec2(SIZE);
  if (any( lessThan(mod(coords, vec2(1.0)), vec2(0.02)) ))
    line = 1.0;

  color *= line;
  gl_FragColor = vec4(color, 1.0);
}