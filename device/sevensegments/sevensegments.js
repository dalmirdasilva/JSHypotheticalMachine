var SevenSegmentsView = {

  powered: true,
  display: null,
  mapAddress: {
    first: 0xfb,
    last: 0xfd
  },

  init: function () {
    this.initLibrary();
    this.initComponents();
    this.attachListener();
    this.updateMappingLabel();
    this.updateUI();
  },

  updateMappingLabel: function () {
    this.ELEMENT.sevensegmentsMapFirst.text(Converter.toString(this.mapAddress.first, 2, 16));
    this.ELEMENT.sevensegmentsMapLast.text(Converter.toString(this.mapAddress.last, 2, 16));
  },

  initLibrary: function () {
  },

  initComponents: function () {
    var self = this;
    this.ELEMENT.sevensegmentsPowerButton.button().click(function () {
      self.powered = !self.powered;
      self.clearSevenSegments();
      self.updateUI();
    });
    this.ELEMENT.sevensegmentsClearButton.button().click(function () {
      self.clearSevenSegments();
    });
    this.clearSevenSegments();
    this.updateMappingLabel();
  },

  attachListener: function () {
    var self = this;
    var simulator = Simulator.getInstance();
    var channel = simulator.getNextFreeChannel();
    var listener = new SimulatorEventListener(function (message) {
      if (message.getChannel() == channel) {
        if (self.powered) {
          self.setSevenSegmentsValue(message.getPayload());
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
  },

  clearSevenSegments: function () {
    this.setSevenSegmentsValue({
      slice: new Array(this.mapAddress.last - this.mapAddress.first + 1)
    });
  },

  setSevenSegmentsValue: function (memoryInfo) {
    var mappedMemory = memoryInfo.slice;
    var text = '';
    for (var i = 0; i < mappedMemory.length; i++) {
      text += Converter.toString(mappedMemory[i] & 0xff, 2, 16);
    }
    this.ELEMENT.sevensegmentsBody.text(text);
  },

  updateUI: function () {
    if (this.powered) {
      this.ELEMENT.sevensegmentsBody.removeClass('off');
    } else {
      this.ELEMENT.sevensegmentsBody.addClass('off');
    }
  },

  ELEMENT: {
    sevensegmentsPowerButton: $('#sevensegments-power-button'),
    sevensegmentsClearButton: $('#sevensegments-clear-button'),
    sevensegmentsMapFirst: $('#sevensegments-map-first'),
    sevensegmentsMapLast: $('#sevensegments-map-last'),
    sevensegmentsCanvas: $('#sevensegments-canvas'),
    sevensegmentsBody: $('#sevensegments-body')
  }
};
