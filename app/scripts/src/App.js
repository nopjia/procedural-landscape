App = function() {
  console.log("hello world!");

  var _canvas,
    _updateLoop,
    _renderer, _camera, _scene,
    _mesh, _mat,

    _SIZE = 100,
    _SPEED = 5,
    _fwdExtend = _SIZE/2.0, // center to side

    _controls;

  // EVENTS

  var _onWindowResize = function() {
    _renderer.setSize(window.innerWidth, window.innerHeight);
  };

  var _onFrameUpdate = function(dt, t) {
    var dir = _camera.getWorldDirection();
    _mover.translateX(dir.x * _SPEED * dt);
    // _mover.translateY(dir.y * _SPEED * dt);
    _mover.translateZ(dir.z * _SPEED * dt);

    var followPos = _camera.getWorldPosition();
    dir.y = 0;
    dir.normalize();
    _mesh.position.x = Math.round(followPos.x + dir.x * _fwdExtend);
    _mesh.position.z = Math.round(followPos.z + dir.z * _fwdExtend);

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
    var geo = new THREE.PlaneBufferGeometry(_SIZE, _SIZE, _SIZE, _SIZE);
    _mat = createShaderMaterial(LandscapeShader);
    _mesh = new THREE.Mesh(geo, _mat);
    _mesh.rotation.x = -Math.PI/2.0;
    _scene.add(_mesh);

    _controls = new THREE.PointerLockControls(_camera);
    _controls.enabled = true;

    _mover = new THREE.Object3D();

    var ctrlObj = _controls.getObject();
    ctrlObj.position.y = 0;
    _mover.position.y = 2;
    _mover.add(ctrlObj);
    _scene.add(_mover);
  };

  _init();
  _updateLoop.start();

};