App = function() {
  console.log("hello world!");

  var _canvas,
    _updateLoop,
    _renderer, _camera, _scene,
    _mesh, _mat,

    _SPEED = 1.0,
    _FWD_EXTEND = 10.0,
    _direction,

    _controls;

  // EVENTS

  var _onWindowResize = function() {
    _renderer.setSize(window.innerWidth, window.innerHeight);
  };

  var _onFrameUpdate = function(dt, t) {
    _camera.translateX(_direction.x * _SPEED * dt);
    _camera.translateY(_direction.y * _SPEED * dt);
    _camera.translateZ(_direction.z * _SPEED * dt);

    var followPos = _camera.position;
    _mesh.position.x = Math.round(followPos.x + _direction.x * _FWD_EXTEND);
    _mesh.position.z = Math.round(followPos.z + _direction.z * _FWD_EXTEND);

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
    _direction = new THREE.Vector3(0.447214, 0.0, -0.894427);
  };

  _init();
  _updateLoop.start();

};