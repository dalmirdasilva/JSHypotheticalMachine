var SevenSegmentsView = {

  powered: true,
  display: null,
  mapAddress: {
    first: 0xfb,
    last: 0xfd
  },

  init: function () {
    with (this) {
      initLibrary();
      initComponents();
      attachListener();
      updateMappingLabel();
    }
  },

  updateMappingLabel: function () {
    this.ELEMENT.sevensegmentsMapFirst.text(this.mapAddress.first.toString(16));
  },

  initLibrary: function () {
  },

  initComponents: function () {
    with (this) {
      ELEMENT.sevensegmentsPowerButton.button().click(function () {
        clearSevenSegments();
        powered = !powered;
      });
      ELEMENT.sevensegmentsClearButton.button().click(function () {
        if (powered) {
          clearSevenSegments();
        }
      });
    }
  },

  attachListener: function () {
    with (this) {
      var simulator = Simulator.getInstance();
      var channel = simulator.getNextFreeChannel();
      var listener = new SimulatorEventListener(function (message) {
        if (message.getChannel() == channel) {
          if (powered) {
            setSevenSegmentsValue(message.getPayload());
          }
        }
      });
      simulator.addEventListener(Simulator.EVENT.BROADCAST_MESSAGE_RECEIVED, listener);
      var requestMessage = new Message(Message.TYPE.ADD_MEMORY_EVENT_LISTENER, {
        begin: this.mapAddress.first,
        end: this.mapAddress.last
      }, channel);
      simulator.exchangeMessage(requestMessage, function (message) {
      });
    }
  },

  clearSevenSegments: function () {
    this.sevensegmentsBody.text('');
  },

  setSevenSegmentsValue: function (mappedMemory) {
//    var value = Converter.toString(mappedMemory, this.mapAddress.last - this.mapAddress.first).split('');

//    var length = value.length;
 //   for (; length < 8; length++) {
  //    value.unshift(' ');
   // }
    for (var i = 0; i < mappedMemory.length; i++) {
      if (mappedMemory[i] < 0) {
        mappedMemory[i] *= -1;
        mappedMemory[i] = Converter.toString(mappedMemory[i], 2);
      }
    }
    this.ELEMENT.sevensegmentsBody.text(mappedMemory.join(''));
  },

  ELEMENT: {
    sevensegmentsPowerButton: $('#sevensegments-power-button'),
    sevensegmentsClearButton: $('#sevensegments-clear-button'),
    sevensegmentsMapFirst: $('#sevensegments-map-first'),
    sevensegmentsCanvas: $('#sevensegments-canvas'),
    sevensegmentsBody: $('#sevensegments-body')
  }
};
