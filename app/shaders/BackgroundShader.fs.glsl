#inject shaders/chunks/Constants.glsl

uniform float uTime;
uniform sampler2D tChannels;
uniform float uChannelSum;
uniform vec3 uCamUp;
uniform vec3 uCamDir;

varying vec2 vUv;

#define SKY_COLOR vec3(0.0, 0.4, 0.8)

void main() {
  vec3 C = normalize(uCamDir);
  vec3 A = 1.0*normalize(cross(C, uCamUp));
  vec3 B = normalize(uCamUp);
  vec3 rd = normalize( C + (2.0*vUv.x-1.0)*0.57735027*A + (2.0*vUv.y-1.0)*0.57735027*B );

  vec3 color = SKY_COLOR *
    asin(rd.y) / M_PI2 *
    (smoothstep(0.5, 1.5, uChannelSum) * 0.5 + 0.5);
  gl_FragColor = vec4( vec3( color ), 1.0 );
}