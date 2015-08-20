nop.BackgroundShader = {

  uniforms: {
    "uTime" : { type: "f", value: 0.0 },
    "tChannels": { type: "t", value: null },
    "uChannelSum": { type: "f", value: 0.0 },
  },

  vertexShader: nop.Utils.loadTextFileInject(
    "shaders/Basic.vs.glsl"
  ),

  fragmentShader: nop.Utils.loadTextFileInject(
    "shaders/BackgroundShader.fs.glsl"
  )

};