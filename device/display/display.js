var DisplayView = {
    
    ctx: null,
    intrinsicDimention: {w: 400, h: 200},
    extrinsicDimention: {w: 256, h: 128},
    firstMemoryAddress: 0xfd,
    lastMemoryAddress: 0xff,
    
    init: function() {
        var self = this;
        self.createCanvas();
        self.attachListener();
        self.initButtons();
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
        var channel = 1;
        var listener = new SimulatorEventListener(function(message) {
            if (message.getChannel() == channel) {
                self.executeOperation(message.getContent());
            }
        });
        simulator.addEventListener(Simulator.EVENT.ASYNC_MESSAGE_RECEIVED, listener);
        var requestMessage = new Message(Message.TYPE.ADD_MEMORY_EVENT_LISTENER, {begin: this.firstMemoryAddress, end: this.lastMemoryAddress}, channel);
        simulator.exchangeMessage(requestMessage, function(message) {});
    },
    
    initButtons: function() {
        var self = this;
        this.ELEMENT.displayClearButton.button().click(function() {
            self.clearDisplay();
        });
    },
    
    clearDisplay: function() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.intrinsicDimention.w, this.intrinsicDimention.h)
    },
    
    executeOperation: function(mappedMemory) {
        var operation = mappedMemory[0];
        this.ctx.fillStyle = "#000";
        switch (operation) {
            case 0x00:
                this.ctx.moveTo(mappedMemory[1] & 0xff, mappedMemory[2] & 0x7f);
            break;
            case 0x01:
                this.ctx.lineTo(mappedMemory[1] & 0xff, mappedMemory[2] & 0x7f);
            break;
        }
        this.ctx.stroke();
    },
    
    ELEMENT: {
        displayCanvas: $("display-canvas"),
        displayClearButton: $("#display-clear-button")
    }
};
