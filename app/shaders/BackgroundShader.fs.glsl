uniform float uTime;
uniform sampler2D tChannels;
uniform float uChannelSum;

varying vec2 vUv;

#define FOG_COLOR vec3(0.0, 0.0, 0.1)

void main() {
  vec3 color = FOG_COLOR * smoothstep(1.2, 1.8, uChannelSum);
  gl_FragColor = vec4( vec3( color ), 1.0 );
}