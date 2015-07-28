#extension GL_OES_standard_derivatives : enable

#define SIZE 100.0

#define K_LINE 0.5  // line width
#define K_SM 4.0    // smooth radius in terms of lineWidth

varying vec2 vUv;

float getGrid(vec2 uv) {
  vec2 pixSize = abs(dFdx(vUv)) + abs(dFdy(vUv));

  vec2 lineWidth = vec2(K_LINE * SIZE / 2.0) * pixSize;

  vec2 coords = mod(uv*vec2(SIZE), vec2(1.0));
  coords.x = coords.x > 0.5 ? 1.0-coords.x : coords.x;
  coords.y = coords.y > 0.5 ? 1.0-coords.y : coords.y;

  // linear func with points (lw, 1), (K_SM*lw, 0)
  vec2 line2 = smoothstep(0.0, 1.0,
    -1.0/((K_SM-1.0)*lineWidth) * coords +
    K_SM/(K_SM-1.0));
  return max(line2.x, line2.y);

  // float line = 0.0;
  // if (any(lessThan(coords, vec2(lineWidth))))
  //   line = 1.0;
  // return line;
}

void main() {
  vec3 color = vec3(1.0, 0.0, 0.0);

  color *= getGrid(vUv);
  gl_FragColor = vec4(color, 1.0);
}