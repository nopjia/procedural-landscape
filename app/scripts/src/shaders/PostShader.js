nop.PostShader = {

  uniforms: {
    "tDiffuse": { type: "t", value: null },
    "uTime": { type: "f", value: 0.0 },
    "uHV": { type: "v2", value: new THREE.Vector2() },
  },

  vertexShader: nop.Utils.loadTextFile(
    "shaders/Basic.vs.glsl"
  ),

  fragmentShader: nop.Utils.loadTextFileInject(
    "shaders/PostShader.fs.glsl"
  )

};