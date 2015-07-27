varying vec2 vUv;

void main() {
  vUv = uv;

  vec4 pos = modelMatrix * vec4(position, 1.0);

  pos.y = sin(pos.z);

  gl_Position = projectionMatrix * viewMatrix * pos;
}