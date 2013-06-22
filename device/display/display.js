var DisplayView = {
    
    ctx: null,
    intrinsicDimention: {w: 400, h: 200},
    extrinsicDimention: {w: 256, h: 128},
    mapAddress: {
        first: 0xff - 0x05,
        last: 0xff
    },
    powered: true,

    OP: {
        NOP: 0x00,
        MOVE_TO: 0x01,
        LINE_TO: 0x02,
        ARC_TO: 0x03
    },
    
    init: function() {
        var self = this;
        self.updateMappingLabels();
        self.createCanvas();
        self.attachListener();
        self.initButtons();
    },
    
    updateMappingLabels: function() {
        this.ELEMENT.displayMapFirst.text(this.mapAddress.first.toString(16));
        this.ELEMENT.displayMapLast.text(this.mapAddress.last.toString(16));
    },
    
    createCanvas: function() {
        var canvas = document.getElementById("display-canvas");
        canvas.width = this.extrinsicDimention.w;
        canvas.height = this.extrinsicDimention.h;
        this.ctx = canvas.getContext("2d");
        this.clearDisplay();
    },
    
    attachListener: function() {
        var self = this;
        var simulator = Simulator.getInstance();
        var channel = simulator.getNextFreeChannel();
        var listener = new SimulatorEventListener(function(message) {
            if (message.getChannel() == channel) {
                self.executeOperation(message.getContent());
            }
        });
        simulator.addEventListener(Simulator.EVENT.ASYNC_MESSAGE_RECEIVED, listener);
        var requestMessage = new Message(Message.TYPE.ADD_MEMORY_EVENT_LISTENER, {begin: this.mapAddress.first, end: this.mapAddress.last}, channel);
        simulator.exchangeMessage(requestMessage, function(message) {});
    },
    
    initButtons: function() {
        var self = this;
        this.ELEMENT.displayPowerButton.button().click(function() {
            self.clearDisplay();
            if (self.powered) {
                self.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                self.ctx.fillRect(0, 0, self.extrinsicDimention.w, self.extrinsicDimention.h);
            }
            self.powered = !self.powered;
        });
        this.ELEMENT.displayClearButton.button().click(function() {
            if (self.powered) {
                self.clearDisplay();
            }
        });
    },
    
    clearDisplay: function() {
        this.ctx.fillStyle = "rgb(0, 0, 0)";
        this.ctx.clearRect(0, 0, this.extrinsicDimention.w, this.extrinsicDimention.h);
        this.ctx.beginPath();
    },
    
    executeOperation: function(mappedMemory) {
        with (this) {
            var operation = mappedMemory[0];
            if (!powered || operation == OP.NOP) {
                return;
            }
            var x = mappedMemory[1] & 0xff;
            var y = mappedMemory[2] & 0x7f;
            switch (operation) {
                case OP.MOVE_TO:
                    this.ctx.moveTo(x, y);
                break;
                case OP.LINE_TO:
                    this.ctx.lineTo(x, y);
                break;
                case OP.ARC_TO:
                    var x2 = mappedMemory[3] & 0xff;
                    var y2 = mappedMemory[4] & 0x7f;
                    var r = mappedMemory[5] & 0x7f;
                    this.ctx.arcTo(x, y, x2, y2, r);
                break;
            }
            this.ctx.stroke();
        }
    },
    
    ELEMENT: {
        displayCanvas: $("display-canvas"),
        displayPowerButton: $("#display-power-button"),
        displayClearButton: $("#display-clear-button"),
        displayMapFirst: $("#display-map-first"),
        displayMapLast: $("#display-map-last")
    }
};
