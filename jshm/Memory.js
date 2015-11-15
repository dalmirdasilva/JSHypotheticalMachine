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
 * Memory class
 */
var Memory = function (size) {
  this.size = size || Config.SIMULATOR_MEMORY_SIZE;
  this.buffer = new Int8Array(size);
  this.eventNotifier = new EventNotifier();
  this.addressMask = Config.SIMULATOR_MEMORY_ADDRESS_MASK || 0xff;
  this.access = {read: 0, write: 0};
};

Memory.prototype.read = function (address) {
  address &= this.addressMask;
  this.checkBoundaries(address);
  this.access.read++;
  return this.buffer[address];
};

Memory.prototype.write = function (address, value) {
  address &= this.addressMask;
  this.checkBoundaries(address);
  this.buffer[address] = value;
  this.access.write++;
  this.notifyEvent(Memory.EVENT.AFTER_WRITE, address);
};

Memory.prototype.erase = function () {
  this.buffer.set(new Int8Array(this.size), 0);
  this.resetAccess();
};

Memory.prototype.resetAccess = function () {
  this.access.read = 0;
  this.access.write = 0;
};

Memory.prototype.getAccess = function () {
  return this.access;
};

Memory.prototype.getSize = function () {
  return this.size;
};

Memory.prototype.getBuffer = function () {
  return this.buffer;
};

Memory.prototype.setBuffer = function (buffer) {
  this.buffer = new Int8Array(buffer);
};

Memory.prototype.checkBoundaries = function (address) {
  if (address >= this.size) {
    throw new Error("Memory access violation at " + address + ".");
  }
};

Memory.prototype.notifyEvent = function (event, address) {
  var self = this;
  var listeners = self.eventNotifier.listeners[event];
  if (listeners != null) {
    listeners.map(function (listener) {
      if (address >= listener.begin && address <= listener.end) {
        var slice = self.buffer.subarray(listener.begin, listener.end + 1);
        listener.notify(slice);
      }
    });
  }
};

Memory.prototype.addEventListener = function (event, listener) {
  this.eventNotifier.addEventListener(event, listener);
};

Memory.EVENT = {
  AFTER_WRITE: 0x01
};
