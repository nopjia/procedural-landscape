nop.App = function() {
  console.log("hello world!");

  var _canvas,
    _updateLoop, _stats,
    _renderer, _camera, _scene,
    _mesh, _mat, _testPass,

    _SPEED = 10.0,
    _SIZE = 128,
    _fwdExtend = _SIZE/2.0, // center to side

    _postprocess = {
      enabled: true,
    },
    _CHANNEL_DIM = 4,
    _channel = {
      dim: _CHANNEL_DIM,
      data: new Uint8Array(_CHANNEL_DIM*_CHANNEL_DIM*3),
    },
    _leapMan,
    _controls;

  // EVENTS

  var _onWindowResize = function() {
    _renderer.setSize(window.innerWidth, window.innerHeight);
  };

  var _onFrameUpdate = function(dt, t) {
    _stats.end();
    _stats.begin();

    _leapUpdate();

    _controls.update(dt, t);

    var followPos = _camera.getWorldPosition();
    var followDir = _camera.getWorldDirection();
    followDir.y = 0;
    followDir.normalize();
    _mesh.position.x = Math.round(followPos.x + followDir.x * _fwdExtend);
    _mesh.position.z = Math.round(followPos.z + followDir.z * _fwdExtend);

    // _testPass.render(_renderer.getRenderer()); return;

    _mat.uniforms.uTime.value = t;

    if (_postprocess.enabled) {
      _render(_postprocess.composer.writeBuffer);
      _postprocess.composer.render();
    }
    else {
      _render();
    }
  };

  var _onFixedUpdate = function(dt, t) {

  };


  // PRIVATE FUNCTIONS

  var _init = function() {
    _updateLoop = new nop.UpdateLoop();
    _updateLoop.frameCallback = _onFrameUpdate;
    _updateLoop.fixedCallback = _onFixedUpdate;

    _canvas = document.querySelector("#webgl-canvas");

    _stats = new Stats();
    _stats.domElement.style.position = "absolute";
    _stats.domElement.style.left = "0px";
    _stats.domElement.style.top = "0px";
    _canvas.parentElement.appendChild(_stats.domElement);

    _renderer = new nop.RenderContext(_canvas);
    _renderer.init();
    _camera = _renderer.getCamera();
    _scene = _renderer.getScene();

    window.addEventListener("resize", _onWindowResize, false);

    if (_postprocess.enabled)
      _postprocess.init();

    _sceneInit();
  };

  var _sceneInit = function() {
    // mesh
    var geo = new THREE.PlaneBufferGeometry(_SIZE, _SIZE, _SIZE, _SIZE);
    _mat = nop.ShaderPass.createShaderMaterial(nop.LandscapeShader);
    _mat.defines.SIZE = _SIZE.toFixed(1);
    _mesh = new THREE.Mesh(geo, _mat);
    _mesh.rotation.x = -Math.PI/2.0;
    _scene.add(_mesh);

    // controls
    _controls = new nop.FlyControls(_camera, _canvas);
    _controls.getObject().position.y = 2;
    _scene.add(_controls.getObject());

    // leap
    var tmat = (new THREE.Matrix4()).compose(
      new THREE.Vector3(0.0, -3.0, -8.0),
      new THREE.Quaternion(),
      new THREE.Vector3(0.015, 0.015, 0.015));
    _leapMan = new nop.LeapManager(_renderer.getRenderer(), _camera, tmat);
  };

  _testPass = new nop.ShaderPass(nop.TestShader);

  _postprocess.init = function() {
    // var renderPass = new THREE.RenderPass(_scene, _camera);
    var bloomPass = new THREE.BloomPass(1.5);
    var filmPass = new THREE.FilmPass(0.5, 0.4, 1024.0, 0);

    var composer = new THREE.EffectComposer(_renderer.getRenderer());
    // composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(filmPass);
    filmPass.renderToScreen = true;

    _postprocess.composer = composer;
  };

  var _render = function(target) {
    _renderer.getRenderer().clearTarget(target);
    _renderer.render(target);
    _leapMan.render(target);
  };

  var _leapUpdate = function() {
    _leapMan.update();

    if (_leapMan.frame.hands[0]) {
      var hand = _leapMan.frame.hands[0];
      var pitch = hand.pitch() - 0.05*Math.PI; // adjust tilt
      var roll = hand.roll();
      var speed = 0.2*_SPEED + 0.1*hand.sphereRadius;

      _controls.setDirection(roll, pitch);
      _controls.setSpeed(speed);
    }

    _controls.setSpeed(_SPEED);
  };


  // PUBLIC

  this.setChannels = function(ch1, ch2) {
    var TEMPORAL_BLEND = 0.75;

    for (var i=0, n=_channel.dim*_channel.dim; i<n; i++) {
      _channel.data[i*3 + 0] = (ch1[i] + 0.5) * 255 * (1.0-TEMPORAL_BLEND) + TEMPORAL_BLEND * _channel.data[i*3 + 0];
      _channel.data[i*3 + 1] = (ch2[i] + 0.5) * 255 * (1.0-TEMPORAL_BLEND) + TEMPORAL_BLEND * _channel.data[i*3 + 1];
      // _channel.data[i*3 + 2] = 0;  // dangrous, but not needed here
    }

    var texture = new THREE.DataTexture(
      _channel.data,
      _channel.dim,
      _channel.dim,
      THREE.RGBFormat // THREE.LuminanceFormat
    );
    // texture.minFilter =  THREE.NearestFilter;
    // texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.needsUpdate = true;
    _channel.texture = texture;
    _mat.uniforms.tChannels.value = texture;
    _testPass.material.uniforms.tDiffuse.value = texture;
  };


  // INIT

  _init();
  _updateLoop.start();

};