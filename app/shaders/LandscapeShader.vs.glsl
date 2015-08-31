#inject shaders/chunks/NoiseFuncs.glsl

uniform float uTime;
uniform sampler2D tChannels;

varying vec2 vUv;
varying vec3 vPos;
varying float vYGround;
varying float vYAdded;

void main() {
  vUv = uv;

  vec4 pos = modelMatrix * vec4(position, 1.0);

  float floorTime = floor(uTime);
  float ceilTime = ceil(uTime);
  float smoothTime = smoothstep(floorTime, ceilTime, uTime);
  float stepTime = smoothTime + floorTime;
  float flipflop = mod(uTime, 2.0) > 1.0 ? smoothTime : 1.0-smoothTime;

  float n0 = snoise(pos.xz / 100.0);
  float n1 = snoise(pos.xz / 80.0);
  float n2 = snoise(pos.xz / 20.0);
  float n3 = snoise((pos.xz + stepTime) /  5.0);

  vYGround = n0 * 4.0;
  vYAdded = max(0.0,
    n1 * 10.0 +
    n2 * 5.0 +
    n3 * 2.0
  );

  float channel = texture2D(tChannels, vec2(n1, 0.5)).r;  // lookup with n1
  channel *= channel;
  channel *= smoothstep(-0.5, 0.5, n1);  // modulate amount affected by noise, so we dont raise flat ground
  vYAdded += 5.0 * channel;

  pos.y = vYGround + vYAdded;
  // pos.y = 0.0;

  vPos = pos.xyz;

  gl_Position = projectionMatrix * viewMatrix * pos;
}