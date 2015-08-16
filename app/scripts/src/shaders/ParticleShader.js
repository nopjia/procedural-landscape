nop.ParticleShader = {

  uniforms: {
    "uTime" : { type: "f", value: 0.0 },
  },

  vertexShader: nop.Utils.loadTextFileInject(
    "shaders/ParticleShader.vs.glsl"
  ),

  fragmentShader: nop.Utils.loadTextFileInject(
    "shaders/ParticleShader.fs.glsl"
  )

};