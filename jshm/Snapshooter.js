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
 * Snapshooter object
 */
var Snapshooter = function (cpu, memory, stack) {
  this.cpu = cpu;
  this.memory = memory;
  this.stack = stack;
};

Snapshooter.prototype.saveState = function () {
  try {
    this.saveCpuState();
    this.saveMemoryState();
    this.saveStackState();
  } catch(e) {
    Logger.error('Cannot save the state: (' + e + ');');
  }
};

Snapshooter.prototype.restoreState = function () {
  try {
    this.restoreCpuState();
    this.restoreMemoryState();
    this.restoreStackState();
  } catch(e) {
    Logger.error('Cannot restore the state: (' + e + ');');
  }
};

Snapshooter.prototype.saveCpuState = function () {
  var self = this;
  this.withStorageItem(function (item) {
    item.cpuState = Cpu.packState(self.cpu);
  });
};

Snapshooter.prototype.restoreCpuState = function () {
  var self = this;
  this.withStorageItem(function (item) {
    Cpu.unpackState(self.cpu, item.cpuState);
  });
};

Snapshooter.prototype.saveMemoryState = function () {
  var self = this;
  this.withStorageItem(function (item) {
    item.memoryState = Cpu.packState(self.memory);
  });
};

Snapshooter.prototype.restoreMemoryState = function () {
  var self = this;
  this.withStorageItem(function (item) {
    Cpu.unpackState(self.memory, item.memoryState);
  });
};

Snapshooter.prototype.saveStackState = function () {
  var self = this;
  this.withStorageItem(function (item) {
    item.stackState = Cpu.packState(self.stack);
  });
};

Snapshooter.prototype.restoreStackState = function () {
  var self = this;
  this.withStorageItem(function (item) {
    Cpu.unpackState(self.stack, item.stackState);
  });
};

Snapshooter.prototype.withStorageItem = function (fn) {
  if (fn) {
    var item = Storage.getItem('snapshooter');
    fn(item);
    Storage.setItem('snapshooter', item);
  }
};