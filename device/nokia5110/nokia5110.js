var Nokia5110View = {

  ctx: null,
  dimension: {
    w: 84,
    h: 48
  },
  extrinsicDimension: {
    w: 420 + 1,
    h: 240 + 1
  },
  mapAddress: {
    first: 0xf0,
    last: 0xf1
  },
  address: {
    y: 0,
    x: 0
  },
  horizontalAddressing: true,
  dram: new Uint8Array(84 * 6),
  powered: true,
  blankMode: false,
  inverseMode: false,
  OPERATION: {
    NOP: 0x00,
    FUNCTION_SET: 0x20,
    DISPLAY_CONTROL: 0x08,
    SET_Y_ADDRESS: 0x40,
    SET_X_ADDRESS: 0x80
  },

  init: function () {
    this.updateMappingLabels();
    this.createCanvasContext();
    this.initComponents();
    this.attachListeners();
  },

  repaint: function (force) {
    if (!force && (!this.powered || this.blankMode)) {
      return;
    }
    for (var x = 0; x < this.dimension.w; x++) {
      for (var y = 0; y < this.dimension.h; y++) {
        var pixel = this.getPixel(x, y);
        var style = (pixel != 0) ? '#116611' : '#dddddd';
        this.ctx.fillStyle = style;
        this.ctx.fillRect(1 + x * 5, 1 + y * 5, 4, 4);
      }
    }
  },

  updateMappingLabels: function () {
    this.ELEMENT.nokia5110MapFirst.text(this.mapAddress.first.toString(16));
    this.ELEMENT.nokia5110MapLast.text(this.mapAddress.last.toString(16));
  },

  createCanvasContext: function () {
    var canvas = this.ELEMENT.nokia5110Canvas[0];
    canvas.width = this.extrinsicDimension.w;
    canvas.height = this.extrinsicDimension.h;
    this.ctx = canvas.getContext('2d');
    this.repaint();
  },

  attachListeners: function () {
    var self = this;
    var simulator = Simulator.getInstance();
    var channel = simulator.getNextFreeChannel();
    var listener = new SimulatorEventListener(function (message) {
      if (message.getChannel() == channel && message.getType() == Message.TYPE.MEMORY_WRITE_EVENT_NOTIFICATION) {
        self.executeOperation(message.getPayload());
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

  initComponents: function () {
    var self = this;
    this.ELEMENT.nokia5110PowerButton.button().click(function () {
      self.powered = !self.powered;
      if (self.powered) {
        self.powerOn();
      } else {
        self.powerOff();
      }
      self.clearDisplay();
    });
    this.ELEMENT.nokia5110ClearButton.button().click(function () {
      self.clearDisplay();
    });
  },

  clearDisplay: function (force) {
    this.fillDram(0x00);
    this.repaint(force);
  },

  powerOff: function () {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.extrinsicDimension.w, this.extrinsicDimension.h);
    this.address.x = this.address.y = 0;
  },

  powerOn: function () {
    this.ctx.clearRect(0, 0, this.extrinsicDimension.w, this.extrinsicDimension.h);
  },

  executeFunctionSet: function (db) {
    this.powered = !(db & 0x04);
    this.horizontalAddressing = !(db & 0x02);
  },

  executeDisplayControl: function (db) {
    switch (((db >> 1) & 0x02) | (db & 0x01)) {
      case 0:
        this.fillDram(0x00);
        this.setBlankMode(true);
        break;
      case 1:
        this.fillDram(0xff);
        break;
      case 2:
        this.setBlankMode(false);
        break;
      case 3:
        this.inverseMode = !this.inverseMode;
        break;
    }
  },
  
  setBlankMode: function(mode) {
    this.blankMode = mode;
  },

  executeSetYAddress: function (db) {
    this.address.y = db & 0x07;
  },

  executeSetXAddress: function (db) {
    this.address.x = db & 0x7f;
  },

  fillDram: function (pattern) {
    this.dram.set(new Uint8Array(this.dimension.w * (this.dimension.h / 8), pattern & 0xff));
  },

  processData: function (db) {
    this.dram[this.address.y * this.dimension.w + this.address.x] = db & 0xff;
    if (this.horizontalAddressing) {
      if (++this.address.x >= this.dimension.w) {
        this.address.y++;
      }
    } else {
      if (++this.address.y >= this.dimension.h / 8) {
        this.address.x++;
      }
    }
    this.address.x %= this.dimension.w;
    this.address.y %= this.dimension.h / 8;
  },

  getPixel: function (x, y) {
    return (this.dram[Math.floor(y / 8) * this.dimension.w + x] & (1 << (y % 8))) > 0;
  },

  executeOperation: function (memoryInfo) {
    if (!this.powered || memoryInfo.address == this.mapAddress.first) {
      return;
    }
    var mappedMemory = memoryInfo.slice;
    var dc = mappedMemory[0] & 0xff;
    var db = mappedMemory[1] & 0xff;
    if (dc == 0) {
      if (db == this.OPERATION.NOP) {
        return;
      } else if ((db & this.OPERATION.SET_X_ADDRESS) > 0) {
        this.executeSetXAddress(db);
      } else if ((db & this.OPERATION.SET_Y_ADDRESS) > 0) {
        this.executeSetYAddress(db);
      } else if ((db & this.OPERATION.FUNCTION_SET) > 0) {
        this.executeFunctionSet(db);
      } else if ((db & this.OPERATION.DISPLAY_CONTROL) > 0) {
        this.executeDisplayControl(db);
      } else {
        Logger.error('Nokia5110: Unknown operation: ' + db + '.')
      }
    } else {
      this.processData(db);
    }
    this.repaint();
  },

  ELEMENT: {
    nokia5110Canvas: $("#nokia5110-canvas"),
    nokia5110PowerButton: $("#nokia5110-power-button"),
    nokia5110ClearButton: $("#nokia5110-clear-button"),
    nokia5110MapFirst: $("#nokia5110-map-first"),
    nokia5110MapLast: $("#nokia5110-map-last")
  }
};
