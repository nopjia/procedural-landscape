nop.VizShader = {

  uniforms: {
    "tChannels": { type: "t", value: null },
  },

  vertexShader: nop.Utils.loadTextFile(
    "shaders/Basic.vs.glsl"
  ),

  fragmentShader: nop.Utils.loadTextFileInject(
    "shaders/VizShader.fs.glsl"
  )

};