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
 * OscillatorEventListener class
 */
var OscillatorEventListener = function (prescaller, handler) {
  this.counter = 0;
  this.prescaller = prescaller || 1;
  this.handler = handler;
};

OscillatorEventListener.prototype.notify = function () {
  this.counter++;
  if (this.counter >= this.prescaller) {
    this.counter = 0;
    this.handler();
  }
};

OscillatorEventListener.prototype.getPrescaller = function () {
  return this.prescaller;
};

OscillatorEventListener.prototype.setPrescaller = function (prescaller) {
  this.prescaller = prescaller;
};

OscillatorEventListener.prototype.getCounter = function () {
  return this.counter;
};

OscillatorEventListener.prototype.setCounter = function (counter) {
  this.counter = counter;
};

OscillatorEventListener.prototype.increaseCounterBy = function (n) {
  this.counter += n;
};
