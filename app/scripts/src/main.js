(function() {
  var _app = new nop.App();
  window.app = _app;

  _app.setChannels([]);

  var _onMicAllowed = function(stream) {
    console.log("Mic Allowed");

    window.persistAudioStream = stream;
    var audioContent = new AudioContext();
    var audioStream = audioContent.createMediaStreamSource( stream );
    var analyser = audioContent.createAnalyser();
    audioStream.connect(analyser);
    analyser.fftSize = 64;
    var frequencyArray = new Uint8Array(analyser.frequencyBinCount);

    var update = function() {
      requestAnimationFrame(update);
      analyser.getByteFrequencyData(frequencyArray);
      _app.setChannels(frequencyArray);
    };

    update();
  };

  var _onMicNotAllowed = function(error) {
    console.log(error);
  };

  var _initMic = function() {
    window.navigator = window.navigator || {};
    navigator.getUserMedia =  navigator.getUserMedia       ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia    ||
                              null;
    navigator.getUserMedia({audio:true}, _onMicAllowed, _onMicNotAllowed);
  };

  _initMic();

})();
