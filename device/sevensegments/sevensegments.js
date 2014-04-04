var SevenSegmentsView = {
    
    mapAddress: {
        first: 0xfb,
        last: 0xfb
    },
    powered: true,
    display: null,
    
    init: function() {
        with (this) {
			initLibrary();
			initComponents();
			attachListener();
			updateMappingLabel();
		}
    },
    
    updateMappingLabel: function() {
        this.ELEMENT.sevensegmentsMapFirst.text(this.mapAddress.first.toString(16));
    },
    
    initLibrary: function() {
        with (this) {
			display = new SegmentDisplay("sevensegments-canvas");
			display.pattern = "########";
			display.displayAngle = 3;
			display.digitHeight = 50;
			display.digitWidth = 12;
			display.digitDistance = 2.5;
			display.segmentWidth = 3.5;
			display.segmentDistance = 0.5;
			display.segmentCount = 7;
			display.cornerType = 3;
			display.colorOn = "rgba(0, 0, 0, 0.9)";
			display.colorOff = "rgba(0, 0, 0, 0.1)";
		}
    },
    
    initComponents: function() {
        with (this) {
			ELEMENT.sevensegmentsPowerButton.button().click(function() {
				clearSevenSegments();
				powered = !powered;
			});
			ELEMENT.sevensegmentsClearButton.button().click(function() {
				if (powered) {
					clearSevenSegments();
				}
			});
		}
    },
    
    attachListener: function() {
        with (this) {
			var simulator = Simulator.getInstance();
			var channel = simulator.getNextFreeChannel();
			var listener = new SimulatorEventListener(function(message) {
				if (message.getChannel() == channel) {
					if (powered) {
						setSevenSegmentsValue(message.getContent());
					}
				}
			});
			simulator.addEventListener(Simulator.EVENT.ASYNC_MESSAGE_RECEIVED, listener);
			var requestMessage = new Message(Message.TYPE.ADD_MEMORY_EVENT_LISTENER, {begin: this.mapAddress.first, end: this.mapAddress.last}, channel);
			simulator.exchangeMessage(requestMessage, function(message) {});
		}
    },
    
    clearSevenSegments: function() {
		this.display.setValue("");
	},
	
	setSevenSegmentsValue: function(mappedMemory) {
		var value = Converter.toString(mappedMemory[0] & 0xff).split("");
		var length = value.length;
		for (; length < 8; length++) {
			value.unshift(" ");
		}
		this.display.setValue(value.join(""));
	},
    
    ELEMENT: {
        sevensegmentsPowerButton: $("#sevensegments-power-button"),
        sevensegmentsClearButton: $("#sevensegments-clear-button"),
        sevensegmentsMapFirst: $("#sevensegments-map-first"),
        sevensegmentsCanvas: $("#sevensegments-canvas")
    }
};
