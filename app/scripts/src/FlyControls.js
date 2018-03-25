nop.FlyControls = function(camera, canvas) {

  var _speed = 10;
  var _MIN_Y = 1;

  var _camera = camera;
  var _canvas = canvas;

  var _posObj, _rotObj;

  var _xStrength = 0,
    _yStrength = 0,
    _xAmount = 0,
    _yAmount = 0;

  this.enableAutoLevel = true;
  var _hasUserInput = false;

  var _init = function() {
    _posObj = new THREE.Object3D();
    _rotObj = new THREE.Object3D();

    _posObj.add(_rotObj);
    _rotObj.add(_camera);

    _rotObj.rotation.order = "YXZ";

    _canvas.addEventListener("mousemove", _onMouseMove);
    _canvas.addEventListener("touchmove", _onTouchMove);
    _canvas.addEventListener("mouseout", _onMouseEnd);
    _canvas.addEventListener("touchend", _onMouseEnd);
  };

  var _applyInputMove = function(clientX, clientY) {
    // convert to square normalized coords, based on height
    var y = ((1.0 - clientY/_canvas.clientHeight) - 0.5) * 2.0;
    var x = (clientX/_canvas.clientWidth - 0.5) * 2.0 * _canvas.clientWidth/_canvas.clientHeight;

    _xStrength = -x;
    _yStrength = y;

    _hasUserInput = true;
  };

  var _onMouseMove = function(event) {
    _applyInputMove(event.clientX, event.clientY);
  };

  var _onTouchMove = function(event) {
    event.preventDefault();
    var touches = event.changedTouches;
    var touch = touches[0];
    _applyInputMove(touch.clientX, touch.clientY);
  };

  var _onMouseEnd = function(event) {
    _hasUserInput = false;
  };

  this.getObject = function() {
    return _posObj;
  };

  this.setDirection = function(x, y) {
    _xStrength = x;
    _yStrength = y;
  };

  this.setSpeed = function(speed) {
    _speed = speed;
  };

  this.update = function(dt, t) {
    _xAmount += _xStrength * dt;
    _yAmount += _yStrength * dt;

    var ROLL_AMOUNT = 0.25;
    _rotObj.rotation.y = _xAmount;
    _rotObj.rotation.x = _yAmount;
    _rotObj.rotation.z = Math.max(Math.min(_xStrength * ROLL_AMOUNT, Math.PI/2.0), -Math.PI/2.0);

    var dir = _camera.getWorldDirection();
    _posObj.position.x += (dir.x * _speed * dt);
    _posObj.position.y += (dir.y * _speed * dt);
    _posObj.position.z += (dir.z * _speed * dt);

    _posObj.position.y = Math.max(_posObj.position.y, _MIN_Y);

    if (this.enableAutoLevel && !_hasUserInput)
      this.updateAutoLevel(dt, t);
  };

  this.updateAutoLevel = function(dt, t) {
    var dir = _camera.getWorldDirection();
    var angleY = Math.asin(dir.y) * 180.0 / Math.PI;
    _yStrength = -angleY * dt;
    _xStrength += -_xStrength * dt;
  };

  this.reset = function() {
    _posObj.position.set(0.0, 0.0, 0.0);
    _rotObj.rotation.set(0.0, 0.0, 0.0);
    _xAmount = _xStrength = 0.0;
    _yAmount = _yStrength = 0.0;
  };

  _init();

};