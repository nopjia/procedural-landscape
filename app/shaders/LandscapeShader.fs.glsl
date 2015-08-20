#extension GL_OES_standard_derivatives : enable

#inject shaders/chunks/Rand.glsl

uniform float uTime;
uniform sampler2D tChannels;
uniform float uChannelSum;

varying vec2 vUv;
varying vec3 vPos;
varying float vYGround;
varying float vYAdded;

#define THEME_COLOR vec3(1.0, 0.0, 0.0)

#define K_LINE 0.5  // line width
#define K_SM 4.0    // smooth radius in terms of lineWidth

vec3 getGrid(vec3 color) {
  vec2 pixSize = abs(dFdx(vUv)) + abs(dFdy(vUv));

  vec2 lineWidth = vec2(K_LINE * SIZE / 2.0) * pixSize;  // scales with size

  vec2 coords = mod(vUv*vec2(SIZE), vec2(1.0));
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

vec3 getFill(vec3 color) {
  vec2 coords = floor(vPos.xz);

  float randVal = 0.0;
  {
    randVal = rand(coords + floor(uTime)*16.0);
    randVal = randVal > 0.98 ? randVal : 0.0;
  }

  float audioVal = 0.0;
  {
    vec2 channels = texture2D(tChannels, vec2(rand(coords), 0.5)).rg;
    audioVal = channels.x * channels.y;
    audioVal = audioVal > 0.5 ? 1.0 : 0.0;
  }

  return color + (THEME_COLOR + vec3(0.5)) * (audioVal + randVal);
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

#define FOG_COLOR vec3(0.0, 0.0, 0.0)
#define FOG_DENSITY 0.025

vec3 getFog(vec3 color) {
  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = exp2(-FOG_DENSITY*FOG_DENSITY * depth*depth * 1.442695);
  fogFactor = clamp(1.0 - fogFactor, 0.0, 1.0);
  return mix(color, FOG_COLOR, fogFactor);
}

void main() {
  vec3 color = vec3(0.0);

  color = getFill(color);
  color = getGrid(color);
  color = getShading(color);
  color = getFog(color);

  gl_FragColor = vec4(color, 1.0);
}