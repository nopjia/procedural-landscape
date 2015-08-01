nop.App = function() {
  console.log("hello world!");

  var _canvas,
    _updateLoop,
    _renderer, _camera, _scene,
    _mesh, _mat,

    _SIZE = 128,
    _fwdExtend = _SIZE/2.0, // center to side

    _controls;

  // EVENTS

  var _onWindowResize = function() {
    _renderer.setSize(window.innerWidth, window.innerHeight);
  };

  var _onFrameUpdate = function(dt, t) {
    _controls.update(dt, t);

    var followPos = _camera.getWorldPosition();
    var followDir = _camera.getWorldDirection();
    followDir.y = 0;
    followDir.normalize();
    _mesh.position.x = Math.round(followPos.x + followDir.x * _fwdExtend);
    _mesh.position.z = Math.round(followPos.z + followDir.z * _fwdExtend);

    _renderer.update(dt, t);
  };

  var _onFixedUpdate = function(dt, t) {

  };


  // PRIVATE FUNCTIONS

  var _init = function() {
    _updateLoop = new nop.UpdateLoop();
    _updateLoop.frameCallback = _onFrameUpdate;
    _updateLoop.fixedCallback = _onFixedUpdate;

    _canvas = document.querySelector("#webgl-canvas");

    _renderer = new nop.RenderContext(_canvas);
    _renderer.init();
    _camera = _renderer.getCamera();
    _scene = _renderer.getScene();

    window.addEventListener("resize", _onWindowResize, false);

    _sceneInit();
  };

  var _sceneInit = function() {
    var geo = new THREE.PlaneBufferGeometry(_SIZE, _SIZE, _SIZE, _SIZE);
    _mat = nop.ShaderPass.createShaderMaterial(nop.LandscapeShader);
    _mesh = new THREE.Mesh(geo, _mat);
    _mesh.rotation.x = -Math.PI/2.0;
    _scene.add(_mesh);

    _controls = new nop.FlyControls(_camera, _canvas);
    _controls.getObject().position.y = 2;
    _scene.add(_controls.getObject());
  };

  _init();
  _updateLoop.start();

};