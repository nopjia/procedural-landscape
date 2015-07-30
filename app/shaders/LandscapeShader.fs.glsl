#extension GL_OES_standard_derivatives : enable

varying vec2 vUv;
varying vec3 vPos;
varying float vYGround;
varying float vYAdded;

#define THEME_COLOR vec3(1.0, 0.0, 0.0)

#define GRID_SIZE 128.0
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

  float line = max(line2.x, line2.y);

  float height = vYAdded / 10.0;
  color += (THEME_COLOR + vec3(height)) * line;

  return color;

  // float line = 0.0;
  // if (any(lessThan(coords, vec2(lineWidth))))
  //   line = 1.0;
}

#define LIGHT_DIR vec3(0.0, 1.0, 0.0)

vec3 getShading(vec3 color) {
  vec3 fdx = dFdx(vPos);
  vec3 fdy = dFdy(vPos);
  vec3 normal = normalize(cross(fdx,fdy));
  float dotFactor = dot(normal, LIGHT_DIR);

  dotFactor *= vYAdded/10.0;
  dotFactor = smoothstep(0.25, 1.0, dotFactor);

  color += (THEME_COLOR + vec3(0.5)) * dotFactor;

  return color;
}

#define K_FOG_COLOR vec3(0.0, 0.0, 0.0)
#define K_FOG_DENSITY 0.025

vec3 getFog(vec3 color) {
  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = exp2(-K_FOG_DENSITY*K_FOG_DENSITY * depth*depth * 1.442695);
  fogFactor = clamp(1.0 - fogFactor, 0.0, 1.0);
  return mix(color, K_FOG_COLOR, fogFactor);
}

void main() {
  vec3 color = vec3(0.0);

  color = getGrid(color, vUv);
  color = getShading(color);
  color = getFog(color);

  gl_FragColor = vec4(color, 1.0);
}