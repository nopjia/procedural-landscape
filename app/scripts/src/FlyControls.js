var FlyControls = function(camera, canvas) {

  var _SPEED = 10;

  var _camera = camera;
  var _canvas = canvas;

  var _posObj, _pitchObj, _yawObj, _rollObj;

  var _xStrength = 0,
    _yStrength = 0,
    _xAmount = 0,
    _yAmount = 0;

  var _init = function() {
    _posObj = new THREE.Object3D();
    _rotObj = new THREE.Object3D();

    _posObj.add(_rotObj);
    _rotObj.add(_camera);

    _rotObj.rotation.order = "YXZ";

    _canvas.addEventListener("mousemove", _onMouseMove, false);
  };

  var _onMouseMove = function(event) {
    // convert to square normalized coords, based on height
    var y = ((1.0 - event.clientY/_canvas.clientHeight) - 0.5) * 2.0;
    var x = (event.clientX/_canvas.clientWidth - 0.5) * 2.0 * _canvas.clientWidth/_canvas.clientHeight;

    _xStrength = -x;
    _yStrength = y;
  };

  this.getObject = function() {
    return _posObj;
  };

  this.update = function(dt, t) {
    _xAmount += _xStrength * dt;
    _yAmount += _yStrength * dt;

    var ROLL_AMOUNT = 0.25;

    _rotObj.rotation.y = _xAmount;
    _rotObj.rotation.x = _yAmount;
    _rotObj.rotation.z = Math.max(Math.min(_xStrength * ROLL_AMOUNT, Math.PI/2.0), -Math.PI/2.0);

    var dir = _camera.getWorldDirection();
    _posObj.translateX(dir.x * _SPEED * dt);
    _posObj.translateY(dir.y * _SPEED * dt);
    _posObj.translateZ(dir.z * _SPEED * dt);
  };

  _init();

};