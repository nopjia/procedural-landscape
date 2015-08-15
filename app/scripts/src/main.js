(function() {
  var _app = new nop.App();
  window.app = _app;

  // osc setup

  var _lChannels = [2.88248, 1.81905, 0.885232, 0.752346, 1.39541, 0.419183, 0.885005, 0.430251, 0.43322, 0.46077, 0.731486, 0.473056, 0.388802, 1.10335, 1.49138, 1.05948, 0.831532, 0.922975, 1.13051, 1.16688, 1.0534, 1.42578, 0.945443, 0.649983, 0.204673],
    _rChannels = [2.79725, 1.09491, 1.65111, 1.21438, 1.54252, 0.378161, 1.65036, 1.0926, 1.10632, 1.42285, 0.960308, 0.664765, 0.56939, 0.839897, 1.54936, 1.48099, 1.93249, 1.84086, 1.59905, 1.8786, 1.24542, 1.73043, 1.19373, 0.832994, 0.216778];

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
