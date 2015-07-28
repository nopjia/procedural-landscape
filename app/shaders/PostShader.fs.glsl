uniform sampler2D tDiffuse;
uniform float uTime;
uniform vec2 uHV;

varying vec2 vUv;


#define BLOOM_TH 0.2
// cut off then remap to 1.0
vec3 doThreshold(vec3 col) {
  return clamp( (col-BLOOM_TH)/(1.0-BLOOM_TH), 0.0, 1.0 );
  //return (col-BLOOM_TH)/(1.0-BLOOM_TH);
}

#define BLOOM_SIZE  5.0
vec3 myBloomEffect(vec2 newUV) {
  vec3 col = vec3(0.0);

  for (float y = -BLOOM_SIZE; y <= BLOOM_SIZE; y++)
  for (float x = -BLOOM_SIZE; x <= BLOOM_SIZE; x++) {
    float ux = newUV.x + x*uHV.x;
    float uy = newUV.y + y*uHV.y;

    col += doThreshold(texture2D( tDiffuse, vec2(ux,uy) ).rgb);
  }

  float area = BLOOM_SIZE*1.5;
  area = area*area;
  col = col/area;

  //return col;
  return col + texture2D(tDiffuse,newUV).rgb*0.5;
  //return 1.0 - (1.0-col)*(1.0-texture2D(tDiffuse,vUv).rgb); // screen
  //return col*col + texture2D(tDiffuse,vUv).rgb;
}


#define FILM_SCOUNT     512.0    // 0-4096
#define FILM_SINTENSITY 0.60     // 0-1
#define FILM_NINTENSITY 0.50      // 0-1
vec3 filmPass(vec3 col) {
  float x = vUv.x * vUv.y * uTime * 1000.0;
  x = mod( x, 13.0 ) * mod( x, 123.0 );

  float dx = mod( x, 0.01 );

  vec3 cResult = col + col * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );
  vec2 sc = vec2( sin( vUv.y * FILM_SCOUNT ), cos( vUv.y * FILM_SCOUNT ) );
  cResult += col * vec3( sc.x, sc.y, sc.x ) * FILM_SINTENSITY;
  cResult = col + clamp( FILM_NINTENSITY, 0.0,1.0 ) * ( cResult - col );

  return cResult;
}

void main() {
  // vec3 col = texture2D(tDiffuse, vUv).rgb;
  vec3 col = myBloomEffect(vUv);
  col = filmPass(col);

  gl_FragColor = vec4(col, 1.0);
}