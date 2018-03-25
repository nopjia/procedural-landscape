uniform float mNear;
uniform float mFar;

void main() {
  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float color = 1.0 - smoothstep(mNear, mFar, depth);
  gl_FragColor = vec4( vec3( color ), 1.0 );
}