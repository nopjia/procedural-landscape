uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
  vec3 color = vec3(vUv.x, vUv.y, 0.0);

  vec2 uv = vUv * 2.0;
  uv.x = vUv.x < 0.5 ? uv.x * 2.0 : uv.x * 2.0 + 0.5;

  vec4 texColor = texture2D(tDiffuse, uv);

  color = mix(color, vec3(vUv.x < 0.5 ? texColor.r : texColor.g), texColor.a);
  // color = texColor.rgb;

  gl_FragColor = vec4( vec3( color ), 1.0 );
}