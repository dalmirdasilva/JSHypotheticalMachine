var OscillatorView = {
    
    cache: {frequency: Config.SIMULATOR_OSC_INITIAL_FREQUENCY, clocking: true},
    
    ELEMENT: {
        oscillatorSlider: $("#oscillator-slider"),
        oscillatorSliderLabel: $("#oscillator-slider-label"),
        oscillatorClockingButton: $("#oscillator-clocking-button"),
        oscillatorClockOutButton: $("#oscillator-clock-out-button")
    },
    
    init: function() {
        this.initConponents();
        this.updateOscillatorLabel(Config.SIMULATOR_OSC_INITIAL_FREQUENCY);
    },
    
    setOscillatorFrequency: function(frequency) {
        var self = this;
        Simulator.getInstance().exchangeMessage(
            new Message(Message.TYPE.SET_OSC_FREQUENCY, frequency),
            function(message) {
                if (message.getContent() != frequency) {
                    self.ELEMENT.oscillatorSlider.slider({"value": self.cache.frequency});
                } else {
                    self.cache.frequency = frequency;
                    self.updateOscillatorLabel(frequency);
                }
            }
        );
    },
    
    updateOscillatorLabel: function(frequency) {
        this.ELEMENT.oscillatorSliderLabel.text(frequency + " Hz");
    },
    
    initConponents: function() {
        var self = this;
        this.ELEMENT.oscillatorSlider.slider({
            value: Config.SIMULATOR_OSC_INITIAL_FREQUENCY,
            orientation: "horizontal",
            range: "min",
            animate: true,
            min: 1,
            max: Config.SIMULATOR_OSC_MAX_FREQUENCY,
            slide: function(event, ui) {
                self.setOscillatorFrequency(ui.value);
            }
        });
        this.ELEMENT.oscillatorClockOutButton.button().click(function() {
            if (!self.cache.clocking) {
                Simulator.getInstance().exchangeMessage(
                    new Message(Message.TYPE.SET_OSC_CLOCK, Oscillator.ACTION.CLOCKOUT_NOW),
                    function(message) {}
                );
            }
        });
        this.ELEMENT.oscillatorClockingButton.button().click(function() {
            Simulator.getInstance().exchangeMessage(
                new Message(Message.TYPE.SET_OSC_CLOCK, self.cache.clocking ? Oscillator.ACTION.STOP_CLOCKING : Oscillator.ACTION.RESUME_CLOCKING),
                function(message) {
                    if (message.getContent()) {
                        self.cache.clocking = !self.cache.clocking;
                    }
                }
            );
        });
    }
};
