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