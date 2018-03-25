#define SPEED 1.0

uniform float uTime;

vec3 calcPos() {
  const vec3 BBOX = vec3(BBOX_DIM);

  vec3 pos = position - cameraPosition;
  pos.y += uTime * SPEED;

  vec3 bmax = cameraPosition + BBOX / 2.0;
  vec3 bmin = cameraPosition - BBOX / 2.0;

  pos = mod(pos, BBOX) + bmin;

  return pos;
}

void main() {
  vec4 mvPosition = modelViewMatrix * vec4( calcPos(), 1.0 );

  gl_PointSize = 150.0 / length( mvPosition.xyz );
  gl_Position = projectionMatrix * mvPosition;
}