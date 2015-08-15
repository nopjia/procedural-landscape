nop.TestShader = {

  uniforms: {
    "tDiffuse": { type: "t", value: null },
  },

  vertexShader: nop.Utils.loadTextFile(
    "shaders/Basic.vs.glsl"
  ),

  fragmentShader: nop.Utils.loadTextFileInject(
    "shaders/TestShader.fs.glsl"
  )

};