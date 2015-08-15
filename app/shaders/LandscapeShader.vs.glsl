#inject shaders/chunks/NoiseFuncs.glsl

uniform sampler2D tChannels;

varying vec2 vUv;
varying vec3 vPos;
varying float vYGround;
varying float vYAdded;

void main() {
  vUv = uv;

  vec4 pos = modelMatrix * vec4(position, 1.0);

  vYGround = snoise(pos.xz / 100.0) * 4.0;
  vYAdded = max(0.0,
    snoise(pos.xz / 80.0) * 10.0 +
    snoise(pos.xz / 20.0) * 5.0 +
    snoise(pos.xz /  5.0) * 2.0
  );

  const float SCALE = 32.0;
  vec2 channels = texture2D(tChannels, vec2(pos.x/SCALE + 0.5, pos.z/SCALE)).rg;
  vYAdded *= (1.0 + 0.2 * channels.x * channels.y);

  pos.y = vYGround + vYAdded;
  // pos.y = 0.0;

  vPos = pos.xyz;

  gl_Position = projectionMatrix * viewMatrix * pos;
}