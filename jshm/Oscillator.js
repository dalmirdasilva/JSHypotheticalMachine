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
 * Oscillator class
 */
var Oscillator = function (frequency) {
  this.frequency = frequency || Config.SIMULATOR_OSC_INITIAL_FREQUENCY;
  this.eventNotifier = new EventNotifier();
  this.tics = 0;
  this.interval = null;
  this.isClocking = false;
};

Oscillator.prototype.getFrequency = function () {
  return this.frequency;
};

Oscillator.prototype.setFrequency = function (frequency) {
  if (frequency > Config.SIMULATOR_OSC_MAX_FREQUENCY || frequency < 1) {
    throw 'Oscillation frequency ' + frequency + ' out or range of 1..' + Config.SIMULATOR_OSC_MAX_FREQUENCY + '';
  }
  this.frequency = frequency;
  if (this.isClocking) {
    this.restartClocking();
  }
};

Oscillator.prototype.restartClocking = function () {
  this.stopClocking();
  this.startClocking();
};

Oscillator.prototype.stopClocking = function () {
  this.isClocking = false;
  clearInterval(this.interval);
};

Oscillator.prototype.startClocking = function () {
  var millis = 1000 / this.frequency;
  var self = this;
  this.stopClocking();
  this.interval = setInterval(function () {
    self.clockOut();
  }, millis);
  this.isClocking = true;
  return millis;
};

Oscillator.prototype.clockOut = function () {
  this.tics++;
  this.notifyEvent(Oscillator.EVENT.ON_CLOCK);
};

Oscillator.prototype.addEventListener = function (event, listener) {
  this.eventNotifier.addEventListener(event, listener);
};

Oscillator.prototype.notifyEvent = function (event, notification) {
  this.eventNotifier.notifyEvent(event, notification);
};

Oscillator.EVENT = {
  ON_CLOCK: 0x01
};

Oscillator.ACTION = {
  RESUME_CLOCKING: 0x00,
  STOP_CLOCKING: 0x01,
  CLOCKOUT_NOW: 0x02
};
