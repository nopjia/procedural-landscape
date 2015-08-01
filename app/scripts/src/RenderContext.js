nop.RenderContext = function(canvas) {

  // PRIVATE VARS

  var _canvas = canvas;
  var _renderer;
  var _w, _h, _aspect;

  var _camera;
  var _scene;

  // HARDCODE PARAMS

  var _rendererParams = {
    canvas: _canvas,
    alpha: false,
    depth: true,
    stencil: false,
    antialias: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    logarithmicDepthBuffer: false,
    autoClear: false,
    clearColor: 0x0,
    clearAlpha: 0,
    sortObjects: true,
    shadowMapEnabled: false,
    shadowMapType: THREE.PCFShadowMap,
    shadowMapCullFace: THREE.CullFaceFront,
    shadowMapDebug: false,
  };

  var _cameraParams = {
    fov: 60,
    near: 1,
    far: 1000
  };

  // PRIVATE FUNCTIONS

  var _initRenderer = function() {
    _renderer = new THREE.WebGLRenderer(_rendererParams);
    _renderer.setSize(_w, _h);
    _renderer.setClearColor(_rendererParams.clearColor, _rendererParams.clearAlpha);
    _renderer.autoClear = _rendererParams.autoClear;
    _renderer.sortObjects = _rendererParams.sortObjects;
    _renderer.shadowMapEnabled = _rendererParams.shadowMapEnabled;
    _renderer.shadowMapType = _rendererParams.shadowMapType;
    _renderer.shadowMapCullFace = _rendererParams.shadowMapCullFace;
    _renderer.shadowMapDebug = _rendererParams.shadowMapDebug;
  };

  // PUBLIC FUNCTIONS

  this.init = function() {
    _w = _canvas.clientWidth;
    _h = _canvas.clientHeight;
    _aspect = _w/_h;

    _initRenderer();

    _camera = new THREE.PerspectiveCamera(
      _cameraParams.fov,
      _aspect,
      _cameraParams.near,
      _cameraParams.far
    );

    _scene = new THREE.Scene();
  };

  this.setSize = function(w, h) {
    _w = w;
    _h = h;
    _aspect = _w/_h;

    _renderer.setSize(_w, _h);

    _camera.aspect = _aspect;
    _camera.updateProjectionMatrix();
  };

  this.render = function(target) {
    // _renderer.clearTarget(target);
    _renderer.render(_scene, _camera, target);
  };

  this.getRenderer = function() {
    return _renderer;
  };

  this.getScene = function() {
    return _scene;
  };

  this.getCamera = function() {
    return _camera;
  };

};

nop.RenderContext.prototype.constructor = nop.RenderContext;