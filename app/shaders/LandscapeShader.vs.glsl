#inject shaders/chunks/NoiseFuncs.glsl

varying vec2 vUv;
varying vec3 vPos;

void main() {
  vUv = uv;

  vec4 pos = modelMatrix * vec4(position, 1.0);

  pos.y = snoise(pos.xz / 100.0) * 4.0;

  pos.y += max(0.0,
    snoise(pos.xz / 80.0) * 10.0 +
    snoise(pos.xz / 20.0) * 5.0 +
    snoise(pos.xz /  5.0) * 2.0
  );

  vPos = pos.xyz;

  gl_Position = projectionMatrix * viewMatrix * pos;
}