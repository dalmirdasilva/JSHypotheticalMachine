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
 * Stack class
 */
var Stack = function (memory, address, size) {
  this.memory = memory;
  this.address = address;
  this.tos = 0;
  this.size = size || Config.SIMULATOR_STACK_SIZE;
};

Stack.prototype.pop = function () {
  if (this.tos <= 0) {
    throw new Error('Stack underflow.');
  }
  this.tos--;
  return this.memory.buffer[this.address - this.tos];
};

Stack.prototype.push = function (b) {
  if (this.tos >= this.size) {
    throw new Error('Stack overflow.');
  }
  this.memory.buffer[this.address - this.tos++] = b;
};

Stack.prototype.getSize = function () {
  return this.size;
};

Stack.prototype.getTop = function () {
  return this.tos;
};

Stack.prototype.getBuffer = function () {
  return this.memory.buffer.slice(this.address - this.tos, this.address);
};

Stack.prototype.erase = function () {
  this.getBuffer().set(new Uint8Array(this.size), 0);
  this.tos = 0;
};