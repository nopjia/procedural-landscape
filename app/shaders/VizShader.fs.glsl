uniform sampler2D tChannels;

varying vec2 vUv;

void main() {
  vec3 color = vec3(0.0, 0.0, 0.0);
  float alpha = 0.0;

  float channel = texture2D(tChannels, vUv).r;
  if (vUv.y < channel) {
    color += vec3(1.0, 1.0, 1.0);
    alpha += 0.1;
  }

  gl_FragColor = vec4(vec3(color), alpha);
}