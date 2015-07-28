#extension GL_OES_standard_derivatives : enable

varying vec2 vUv;

#define GRID_SIZE 100.0
#define K_LINE 0.5  // line width
#define K_SM 4.0    // smooth radius in terms of lineWidth

vec3 getGrid(vec3 color, vec2 uv) {
  vec2 pixSize = abs(dFdx(vUv)) + abs(dFdy(vUv));

  vec2 lineWidth = vec2(K_LINE * GRID_SIZE / 2.0) * pixSize;  // scales with size

  vec2 coords = mod(uv*vec2(GRID_SIZE), vec2(1.0));
  coords.x = coords.x > 0.5 ? 1.0-coords.x : coords.x;
  coords.y = coords.y > 0.5 ? 1.0-coords.y : coords.y;

  // linear func with points (lw, 1), (K_SM*lw, 0)
  vec2 line2 = smoothstep(0.0, 1.0,
    -1.0/((K_SM-1.0)*lineWidth) * coords +
    K_SM/(K_SM-1.0));
  return color * max(line2.x, line2.y);

  // float line = 0.0;
  // if (any(lessThan(coords, vec2(lineWidth))))
  //   line = 1.0;
}

#define K_FOG_COLOR vec3(0.0, 0.0, 0.0)
#define K_FOG_DENSITY 0.03

vec3 getFog(vec3 color) {
  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = exp2(-K_FOG_DENSITY*K_FOG_DENSITY * depth*depth * 1.442695);
  fogFactor = clamp(1.0 - fogFactor, 0.0, 1.0);
  return mix(color, K_FOG_COLOR, fogFactor);
}

void main() {
  vec3 color = vec3(1.0, 0.0, 0.0);

  color = getGrid(color, vUv);
  color = getFog(color);

  gl_FragColor = vec4(color, 1.0);
}