nop.BackgroundShader = {

  uniforms: {
    "uTime" : { type: "f", value: 0.0 },
    "tChannels": { type: "t", value: null },
    "uChannelSum": { type: "f", value: 0.0 },
    "uCamDir": { type: "v3", value: new THREE.Vector3() },
    "uCamUp": { type: "v3", value: new THREE.Vector3() },
  },

  vertexShader: nop.Utils.loadTextFileInject(
    "shaders/Basic.vs.glsl"
  ),

  fragmentShader: nop.Utils.loadTextFileInject(
    "shaders/BackgroundShader.fs.glsl"
  )

};