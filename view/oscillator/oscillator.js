/**
 * JS Hypothetical Machine
 *
 * Copyright (C) 2013  Dalmir da Silva <dalmirdasilva@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * OscillatorView object
 */
var OscillatorView = {

  cache: {frequency: Config.SIMULATOR_OSC_INITIAL_FREQUENCY, clocking: true},

  init: function () {
    this.initComponents();
    this.updateOscillatorLabel(Config.SIMULATOR_OSC_INITIAL_FREQUENCY);
  },

  setOscillatorFrequency: function (frequency) {
    var self = this;
    Simulator.getInstance().exchangeMessage(
        new Message(Message.TYPE.SET_OSC_FREQUENCY, frequency),
        function (message) {
          if (message.getPayload() != frequency) {
            self.ELEMENT.oscillatorSlider.slider({value: self.cache.frequency});
          } else {
            self.cache.frequency = frequency;
            self.updateOscillatorLabel(frequency);
          }
        }
    );
  },

  updateOscillatorLabel: function (frequency) {
    this.ELEMENT.oscillatorSliderLabel.text(frequency);
  },

  initComponents: function () {
    var self = this;
    this.ELEMENT.oscillatorSlider.slider({
      value: Config.SIMULATOR_OSC_INITIAL_FREQUENCY,
      orientation: 'horizontal',
      range: 'min',
      animate: true,
      min: 1,
      max: Config.SIMULATOR_OSC_MAX_FREQUENCY,
      slide: function (event, ui) {
        self.setOscillatorFrequency(ui.value);
      }
    });
    this.ELEMENT.oscillatorClockOutButton.button().click(function () {
      if (!self.cache.clocking) {
        Simulator.getInstance().exchangeMessage(
            new Message(Message.TYPE.SET_OSC_CLOCK, Oscillator.ACTION.CLOCKOUT_NOW),
            function (message) {
            }
        );
      }
    });
    this.ELEMENT.oscillatorClockingButton.button().click(function () {
      Simulator.getInstance().exchangeMessage(
          new Message(Message.TYPE.SET_OSC_CLOCK, self.cache.clocking ? Oscillator.ACTION.STOP_CLOCKING : Oscillator.ACTION.RESUME_CLOCKING),
          function (message) {
            if (message.getPayload()) {
              self.cache.clocking = !self.cache.clocking;
            }
          }
      );
    });
  },

  ELEMENT: {
    oscillatorSlider: $('#oscillator-slider'),
    oscillatorSliderLabel: $('#oscillator-slider-label'),
    oscillatorClockingButton: $('#oscillator-clocking-button'),
    oscillatorClockOutButton: $('#oscillator-clock-out-button')
  }
};
