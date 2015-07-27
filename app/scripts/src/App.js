App = function() {
  console.log("hello world!");

  var _canvas,
    _updateLoop,
    _renderer, _camera, _scene,
    _mesh, _mat,
    _controls;


  // EVENTS

  var _onWindowResize = function() {
    _renderer.setSize(window.innerWidth, window.innerHeight);
  };

  var _onFrameUpdate = function(dt, t) {
     if (!_controls.enabled)
      _controls.update();
    _renderer.update(dt);
  };

  var _onFixedUpdate = function(dt, t) {

  };


  // PRIVATE FUNCTIONS

  var _init = function() {
    _updateLoop = new UpdateLoop();
    _updateLoop.frameCallback = _onFrameUpdate;
    _updateLoop.fixedCallback = _onFixedUpdate;

    _canvas = document.querySelector("#webgl-canvas");

    _renderer = new RenderContext(_canvas);
    _renderer.init();
    _camera = _renderer.getCamera();
    _scene = _renderer.getScene();

    window.addEventListener("resize", _onWindowResize, false);

    _sceneInit();
  };

  var _sceneInit = function() {
    var geo = new THREE.PlaneBufferGeometry(100, 100, 100, 100);
    _mat = createShaderMaterial(LandscapeShader);
    _mesh = new THREE.Mesh(geo, _mat);
    _mesh.rotation.x = -Math.PI/2.0;
    _scene.add(_mesh);

    _camera.position.y = 2;
    _camera.position.z = 10;

    _controls = new THREE.OrbitControls(_camera, _canvas);
    _controls.rotateUp(Math.PI/6);
    _controls.autoRotate = true;
    _controls.autoRotateSpeed = 1.0;
    _controls.noPan = true;
  };

  _init();
  _updateLoop.start();

};