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
var Snapshooter = function (simulator) {
  this.simulator = simulator;
};

Snapshooter.prototype.saveState = function () {
  try {
    this.saveCpuState();
    //this.saveMemoryState();
   // this.saveStackState();
  } catch(e) {
    Logger.error('Cannot save the state: (' + e + ');');
  }
};

Snapshooter.prototype.restoreState = function () {
  try {
    this.restoreCpuState();
   // this.restoreMemoryState();
    //this.restoreStackState();
  } catch(e) {
    Logger.error('Cannot restore the state: (' + e + ');');
  }
};

Snapshooter.prototype.discardState = function () {
  try {
    this.discardCpuState();
    this.discardMemoryState();
    this.discardStackState();
  } catch(e) {
    Logger.error('Cannot discard the state: (' + e + ');');
  }
};

Snapshooter.prototype.saveCpuState = function () {
  var self = this;
  this.simulator.exchangeMessage(new Message(Message.TYPE.GET_CPU_INFORMATION), function (message) {
    var cpuState = message.getPayload();
    self.withStorageItem(function (item) {
      item.cpuState = cpuState;
    });
  });
};

Snapshooter.prototype.restoreCpuState = function () {
  var self = this;
  this.withStorageItem(function (item) {
    if (item.hasOwnProperty('cpuState')) {
      self.simulator.exchangeMessage(new Message(Message.TYPE.SET_CPU_INFORMATION, item.cpuState), function () {
      });
    }
  });
};

Snapshooter.prototype.discardCpuState = function () {
  this.withStorageItem(function (item) {
    delete item.cpuState;
  });
};

Snapshooter.prototype.saveMemoryState = function () {
  var self = this;

  this.simulator.exchangeMessage(new Message(Message.TYPE.GET_CPU_INFORMATION), function (message) {
    var memoryState = message.getPayload();
    self.withStorageItem(function (item) {
      item.memoryState = memoryState;
    });
  });
};

Snapshooter.prototype.restoreMemoryState = function () {
  var self = this;
  this.withStorageItem(function (item) {
    if (item.hasOwnProperty('memoryState')) {
      self.memory.setBuffer(item.memoryState);
    }
  });
};

Snapshooter.prototype.discardMemoryState = function () {
  this.withStorageItem(function (item) {
    delete item.memoryState;
  });
};

Snapshooter.prototype.saveStackState = function () {
  var self = this;
  this.withStorageItem(function (item) {
    item.stackState = self.stack.getBuffer();
  });
};

Snapshooter.prototype.restoreStackState = function () {
  var self = this;
  this.withStorageItem(function (item) {
    if (item.hasOwnProperty('stackState')) {
      self.stack.setBuffer(item.stackState);
    }
  });
};

Snapshooter.prototype.discardStackState = function () {
  this.withStorageItem(function (item) {
    delete item.stackState;
  });
};

Snapshooter.prototype.withStorageItem = function (fn) {
  if (fn) {
    var item = Storage.getItem('snapshooter');
    console.log(item)
    fn(item);
    Storage.setItem('snapshooter', item);
  }
};