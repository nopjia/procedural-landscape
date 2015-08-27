nop.LeapManager = function(renderer, camera, transform) {
  var _scene, _root, _controller;
  var _connected = false;

  var MAX_HANDS = 4;      // apparently leap can have more than 2 hands
              // more than MAX_HANDS will draw, from plugin
              // but will not be taken into account

  this.renderer = renderer;
  this.camera = camera;
  this.matrix = transform;


  // PUBLIC

  this.followCamera = true;

  // read-only
  this.frame = undefined;
  this.palmPositions = []; for (var i=0; i<MAX_HANDS; i++) this.palmPositions.push(new THREE.Vector3());
  this.activeHandCount = 0;
  // this.jointPositions = []; for (var i=0; i<50; i++) this.jointPositions.push(new THREE.Vector3());
  // this.activeJointCount = 0;


  // FUNCTIONS

  this.update = function() {
    // update leapRoot transform
    if (this.followCamera)
      _root.matrix.multiplyMatrices(this.camera.matrixWorld, this.matrix);
    else
      _root.matrix.copy(this.matrix);
    _root.matrixWorldNeedsUpdate = true;

    // grab frame data
    this.frame = _controller.frame();

    // extract palm positions
    this.activeHandCount = Math.min(this.frame.hands.length, MAX_HANDS);
    for (var h=0; h<this.activeHandCount; h++) {
      var pos = this.frame.hands[h].palmPosition;
      this.palmPositions[h].set(pos[0],pos[1],pos[2]);
      this.palmPositions[h].applyMatrix4(_root.matrix);
    }

    // this.activeJointCount = this.activeHandCount * 25;

    // extract joint positions
    // var jointIdx = 0;
    // for (var h=0; h<this.frame.hands.length; h++) {
    //     var hand = this.frame.hands[h];
    //     for (var f=0; f<hand.fingers.length; f++) {
    //         var finger = hand.fingers[f];
    //         for (var j=0; j<finger.positions.length; j++) {
    //             var rawpos = finger.positions[j];
    //             this.jointPositions[jointIdx].set(rawpos[0],rawpos[1],rawpos[2]);
    //             this.jointPositions[jointIdx].applyMatrix4(_root.matrix);
    //             jointIdx++;
    //         }
    //     }
    // }
  };

  this.render = function(renderTarget, forceClear) {
    this.renderer.render(_scene, this.camera, renderTarget, forceClear);
  };

  this.isConnected = function() {
    return _connected;
  };


  // INIT

  _scene = new THREE.Scene();
  _scene.overrideMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    opacity: 0.25,
    transparent: true
  });

  _root = new THREE.Object3D();
  _root.matrixAutoUpdate = false;
  _scene.add(_root);

  _controller = new Leap.Controller();
  _controller.use("boneHand", {
    render: function() {},
    scene: _root,
    arm: false,
  }).connect();


  _controller.on("deviceAttached", function() {
    console.log("Leap device attached");
    _connected = true;
  });

  _controller.on("deviceRemoved", function() {
    console.log("Leap device removed");
    _connected = false;
  });

  _controller.on("deviceConnected", function() {
    console.log("Leap device connected");
    _connected = true;
  });

  _controller.on("deviceDisconnected", function() {
    console.log("Leap device disconnected");
    _connected = false;
  });
};