nop.App = function() {
  console.log("hello world!");

  var _canvas,
    _updateLoop, _stats,
    _renderer, _camera, _scene,
    _mesh, _mat, _testPass, _bgPass,

    _SPEED = 10.0,
    _SIZE = 128,
    _fwdExtend = _SIZE/2.0, // center to side
    _MAX_Y = 100.0,

    _postprocess = {
      enabled: true,
    },
    _CHANNEL_W = 26,
    _CHANNEL_H = 1,
    _channel = {
      w: _CHANNEL_W,
      h: _CHANNEL_H,
      data: new Uint8Array(_CHANNEL_W*_CHANNEL_H),
      sum: 0.0,
    },

    _particles = {},
    _leapMan,
    _controls;

  // EVENTS

  var _onWindowResize = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    _renderer.setSize(w, h);

    // reallocate postprocess targets
    if (_postprocess.enabled) {
      _postprocess.composer.renderTarget1 = new THREE.WebGLRenderTarget(w, h, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: false
      });
      _postprocess.composer.renderTarget2 = _postprocess.composer.renderTarget1.clone();
    }
  };

  var _onFrameUpdate = function(dt, t) {
    _stats.end();
    _stats.begin();

    if (_leapMan.isConnected())
      _leapUpdate(dt, t);

    _controls.update(dt, t);

    var followPos = _camera.getWorldPosition();
    var followDir = _camera.getWorldDirection();
    followDir.y = 0;
    followDir.normalize();
    _mesh.position.x = Math.round(followPos.x + followDir.x * _fwdExtend);
    _mesh.position.z = Math.round(followPos.z + followDir.z * _fwdExtend);

    if (followPos.y > _MAX_Y)
      _controls.reset();

    _particles.update(dt, t);

    _mat.uniforms.uTime.value = t;
    _bgPass.material.uniforms.uTime.value = t;

    var tmpVec4 = new THREE.Vector4();
    tmpVec4.set(0, 0, -1, 0);
    tmpVec4.applyMatrix4(_camera.matrixWorld);
    _bgPass.material.uniforms.uCamDir.value.set(tmpVec4.x, tmpVec4.y, tmpVec4.z);
    tmpVec4.set(0, 1, 0, 0);
    tmpVec4.applyMatrix4(_camera.matrixWorld);
    _bgPass.material.uniforms.uCamUp.value.set(tmpVec4.x, tmpVec4.y, tmpVec4.z);

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
    _particles.init();
    _keyboardInit();
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

    _bgPass = new nop.ShaderPass(nop.BackgroundShader);

    _testPass = new nop.ShaderPass(nop.VizShader);
    _testPass.material.transparent = true;
    _testPass.material.blending = THREE.NormalBlending;
  };

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
    _bgPass.render(_renderer.getRenderer(), target);
    _renderer.render(target);
    _leapMan.render(target);

    _testPass.render(_renderer.getRenderer(), target);
  };

  var _currRoll = 0.0;

  var _leapUpdate = function(dt, t) {
    _leapMan.update();

    if (_leapMan.frame.hands[0]) {
      var pitch = 0;
      var roll = 0;
      var speed = 0;

      for (var i=0; i<_leapMan.frame.hands.length; i++) {
        var hand = _leapMan.frame.hands[i];
        pitch += hand.pitch() - 0.05*Math.PI;
        roll += hand.roll();
        speed += 0.2*_SPEED + 0.1*hand.sphereRadius;
      }

      pitch /= _leapMan.frame.hands.length;
      roll /= _leapMan.frame.hands.length;
      speed /= _leapMan.frame.hands.length;

      _controls.setDirection(roll, pitch);
      _controls.setSpeed(speed);

      _currRoll = roll;

      _controls.enableAutoLevel = false;
    }
    else {
      _controls.setSpeed(_SPEED);
      _controls.enableAutoLevel = true;
    }
  };

  _particles.init = function() {
    this.DIM = 128;
    this.count = 4096;
    this.geo = new THREE.Geometry();
    for (var i=0; i<this.count; i++) {
      this.geo.vertices.push(new THREE.Vector3(
        Math.random() * 2.0*this.DIM - this.DIM,
        Math.random() * 2.0*this.DIM - this.DIM,
        Math.random() * 2.0*this.DIM - this.DIM
      ));
    }
    this.mat = nop.ShaderPass.createShaderMaterial(nop.ParticleShader);
    this.mat.defines.BBOX_DIM = this.DIM.toFixed(1);
    this.mat.blending = THREE.AdditiveBlending;
    this.mat.transparent = true;
    this.mat.depthTest = true;
    this.mat.depthWrite = false;
    this.mesh = new THREE.PointCloud(this.geo, this.mat);
    this.mesh.frustumCulled = false;
    _scene.add(this.mesh);
  };

  _particles.update = function(dt, t) {
    this.mat.uniforms.uTime.value = t;
  };

  var _keyboardInit = function() {
    Mousetrap.bind("shift+r", _controls.reset);
  };


  // PUBLIC

  this.setChannels = function(ch) {
    var TEMPORAL_BLEND = 0.0;

    for (var i=0, n=_channel.w*_channel.h; i<n; i++) {
      _channel.data[i] =
        (1.0-TEMPORAL_BLEND) * ch[i] +
        TEMPORAL_BLEND * _channel.data[i];
    }

    var texture = new THREE.DataTexture(
      _channel.data,
      _channel.w,
      _channel.h,
      THREE.LuminanceFormat
    );
    // texture.minFilter = THREE.NearestFilter;
    // texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    texture.needsUpdate = true;
    _channel.texture = texture;
    _mat.uniforms.tChannels.value = texture;
    _testPass.material.uniforms.tChannels.value = texture;
  };


  // INIT

  _init();
  _updateLoop.start();

};