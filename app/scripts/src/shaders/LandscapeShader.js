var LandscapeShader = {

  uniforms: {

  },

  vertexShader: Utils.loadTextFileInject(
    "shaders/LandscapeShader.vs.glsl"
  ),

  fragmentShader: Utils.loadTextFileInject(
    "shaders/LandscapeShader.fs.glsl"
  )

};

var LandscapeDepthShader = {

  uniforms: {
    mNear: { type: "f", value: 1 },
    mFar: { type: "f", value: 100 }
  },

  vertexShader: Utils.loadTextFileInject(
    "shaders/LandscapeShader.vs.glsl"
  ),

  fragmentShader: Utils.loadTextFileInject(
    "shaders/DepthShader.fs.glsl"
  )

};