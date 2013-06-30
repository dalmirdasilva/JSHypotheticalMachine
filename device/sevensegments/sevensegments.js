var SevenSegmentsView = {
    
    ctx: null,
    intrinsicDimention: {w: 400, h: 200},
    extrinsicDimention: {w: 256, h: 128},
    mapAddress: {
        first: 0xff - 0x05,
        last: 0xff
    },
    powered: true,

    OPERATION: {
        NOPERATIONS: 0x00,
        MOVE_TO: 0x01,
        LINE_TO: 0x02,
        ARC_TO: 0x03
    },
    
    init: function() {
        var self = this;
        self.updateMappingLabels();
        self.createCanvasContext();
        self.initComponents();
        self.attachListener();
    },
    
    repaint: function() {
        with (this) {
            if (!powered) {
                return;
            }
            clearSevenSegments();
            ctx.stroke();
        }
    },
    
    updateMappingLabels: function() {
        this.ELEMENT.sevensegmentsMapFirst.text(this.mapAddress.first.toString(16));
        this.ELEMENT.sevensegmentsMapLast.text(this.mapAddress.last.toString(16));
    },
    
    createCanvasContext: function() {
        var canvas = this.ELEMENT.sevensegmentsCanvas[0];
        canvas.width = this.extrinsicDimention.w;
        canvas.height = this.extrinsicDimention.h;
        this.ctx = canvas.getContext("2d");
        this.clearSevenSegments();
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
    
    initComponents: function() {
        var self = this;
        this.ELEMENT.sevensegmentsPowerButton.button().click(function() {
            self.clearSevenSegments(true);
            if (self.powered) {
                self.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                self.ctx.fillRect(0, 0, self.extrinsicDimention.w, self.extrinsicDimention.h);
            }
            self.powered = !self.powered;
        });
        this.ELEMENT.sevensegmentsClearButton.button().click(function() {
            if (self.powered) {
                self.clearSevenSegments(true);
            }
        });
    },
    
    clearSevenSegments: function(resetPath) {
        with (this) {
            ctx.clearRect(0, 0, extrinsicDimention.w, extrinsicDimention.h);
            if (resetPath) {
                ctx.beginPath();
            }
        }
    },
    
    executeOperation: function(mappedMemory) {
        with (this) {
            var operation = mappedMemory[0];
            if (!powered || operation == OPERATION.NOPERATIONS) {
                return;
            }
            var x = mappedMemory[1] & 0xff;
            var y = mappedMemory[2] & 0x7f;
            switch (operation) {
                case OPERATION.MOVE_TO:
                    this.ctx.moveTo(x, y);
                break;
                case OPERATION.LINE_TO:
                    ctx.lineTo(x, y);
                break;
                case OPERATION.ARC_TO:
                    var x2 = mappedMemory[3] & 0xff;
                    var y2 = mappedMemory[4] & 0x7f;
                    var r = mappedMemory[5] & 0x7f;
                    ctx.arcTo(x, y, x2, y2, r);
                break;
                case OPERATION.STROKE:
                break;
            }
            repaint();
        }
    },
    
    ELEMENT: {
        sevensegmentsCanvas: $("#sevensegments-canvas"),
        sevensegmentsPowerButton: $("#sevensegments-power-button"),
        sevensegmentsClearButton: $("#sevensegments-clear-button"),
        sevensegmentsMapFirst: $("#sevensegments-map-first"),
        sevensegmentsMapLast: $("#sevensegments-map-last")
    }
};
