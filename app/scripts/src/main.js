(function() {
  var _app = new nop.App();
  window.app = _app;

  // osc setup

  var _lChannels = [4.62872, 1.58214, 0.591573, 0.393997, 1.03054, 0.778582, 0.636379, 0.717635, 0.650172, 0.560302, 0.534312, 0.927477, 0.770676, 1.99887, 1.75363, 2.03946, 1.13368, 0.800895, 1.74356, 1.66772, 1.44762, 1.57046, 1.41017, 1.35579, 0.493747],
    _rChannels = [2.93248, 1.5108, 1.4605, 0.466725, 2.10538, 1.51791, 1.60459, 0.487575, 2.06482, 0.255121, 0.279649, 0.58267, 0.704574, 1.14138, 1.14706, 3.14236, 0.925674, 1.14986, 2.82053, 2.27961, 1.31303, 2.0448, 1.5199, 2.24297, 1.2617];

  // TODO_NOP: total hack, force it to clear out blending
  for (var i=0; i<100; i++)
    _app.setChannels(_lChannels, _rChannels);

  var _oscPort = new osc.WebSocketPort({
    url: "ws://localhost:8081" // URL to your Web Socket server.
  });

  _oscPort.on("message", function (msg) {
    if (msg.address === "/left_barks") {
      _lChannels = msg.args;
    }
    else if (msg.address === "/right_barks") {
      _rChannels = msg.args;

      // only set channels on right
      _app.setChannels(_lChannels, _rChannels);
    }
  });

  _oscPort.open();
})();
