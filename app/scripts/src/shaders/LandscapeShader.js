nop.LandscapeShader = {

  uniforms: {
    "tChannels": { type: "t", value: null }
  },

  vertexShader: nop.Utils.loadTextFileInject(
    "shaders/LandscapeShader.vs.glsl"
  ),

  fragmentShader: nop.Utils.loadTextFileInject(
    "shaders/LandscapeShader.fs.glsl"
  )

};

nop.LandscapeDepthShader = {

  uniforms: {
    mNear: { type: "f", value: 1 },
    mFar: { type: "f", value: 100 }
  },

  vertexShader: nop.Utils.loadTextFileInject(
    "shaders/LandscapeShader.vs.glsl"
  ),

  fragmentShader: nop.Utils.loadTextFileInject(
    "shaders/DepthShader.fs.glsl"
  )

};