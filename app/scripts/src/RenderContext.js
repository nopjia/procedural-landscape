var RenderContext = function(canvas) {

  // PRIVATE VARS

  var _this = this;

  var _canvas = canvas;
  var _stats;
  var _renderer;
  var _w, _h, _aspect;

  var _camera;
  var _scene;

  var _imgData = {
    pending: false,
    callback: undefined,
    dataUrl: undefined
  };

  var _postprocess = {
    enabled: true,
    resolution: 2,
  };

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

  _postprocess.init = function() {
    var copyPass = new THREE.ShaderPass(THREE.CopyShader);
    var renderPass = new THREE.RenderPass(_scene, _camera);
    var bokehPass = new THREE.BokehPass(_scene, _camera, {
      focus:    1.0,
      aperture: 0.02,
      maxblur:  1.0,
      width: _w,
      height: _h
    });
    bokehPass.materialDepth = createShaderMaterial(LandscapeDepthShader);
    bokehPass.materialDepth.uniforms.mNear.value = _camera.near;
    bokehPass.materialDepth.uniforms.mFar.value = _camera.far;  // needs update

    var bloomPass = new THREE.BloomPass(1.0);

    var composer = new THREE.EffectComposer(_renderer);
    composer.addPass(renderPass);
    // composer.addPass(bokehPass);
    // bokehPass.renderToScreen = true;
    composer.addPass(bloomPass);
    composer.addPass(copyPass);
    copyPass.renderToScreen = true;

    _postprocess.composer = composer;
  };

  _postprocess.update = function(dt, t) {
    _postprocess.composer.render(dt);
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

    _stats = new Stats();
    _stats.domElement.style.position = "absolute";
    _stats.domElement.style.left = "0px";
    _stats.domElement.style.top = "0px";
    _canvas.parentElement.appendChild(_stats.domElement);

    if (_postprocess.enabled)
      _postprocess.init();
  };

  this.setSize = function(w, h) {
    _w = w;
    _h = h;
    _aspect = _w/_h;

    _renderer.setSize(_w, _h);

    _camera.aspect = _aspect;
    _camera.updateProjectionMatrix();
  };

  this.update = function(dt, t) {
    _stats.end();
    _stats.begin();

    _renderer.clearTarget(null);

    if (_postprocess.enabled) {
      _postprocess.update(dt, t);
    }
    else {
      _renderer.render(_scene, _camera);
    }

    if (_imgData.pending) {
      _imgData.dataUrl = _renderer.domElement.toDataURL();
      _imgData.pending = false;
      if(_imgData.callback) _imgData.callback(_imgData.dataUrl);
    }
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

  this.getImageData = function(cb) {
    _imgData.pending = true;
    _imgData.callback = cb;
  };

};

RenderContext.prototype.constructor = RenderContext;