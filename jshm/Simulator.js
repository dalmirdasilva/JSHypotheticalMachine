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
 * Simulator class
 */
var Simulator = function (path) {
  this.messageHandlerQueue = [];
  this.worker = null;
  this.launched = false;
  this.eventNotifier = new EventNotifier();
  this.nextFreeChannel = 0;
};

Simulator.prototype.asyncMessageHandler = function (message) {
  this.notifyEvent(Simulator.EVENT.ASYNC_MESSAGE_RECEIVED, message);
};

Simulator.prototype.simulate = function (path) {
  if (!this.launched) {
    var self = this;
    this.worker = new Worker(path);
    this.worker.addEventListener('message', function (event) {
      var message = Message.newFromHash(event.data);
      // TODO: OPPOSITE?
      if (message.isAsync()) {
        self.asyncMessageHandler(message);
      } else {
        var handler = self.messageHandlerQueue.shift();
        if (handler && (typeof handler === 'function')) {
          handler(message);
        } else {
          throw new Error('No available handler for message: ' + message);
        }
      }
    }, false);
    this.launched = true;
  }
};

Simulator.prototype.exchangeMessage = function (message, responseHandler) {
  if (!this.launched) {
    throw new Error('No launched worker to exchange message.');
  }
  this.messageHandlerQueue.push(responseHandler);

  // What happens if at this moment a message comes from worker?
  this.worker.postMessage(message.toHash());
  return true;
};

Simulator.prototype.notifyEvent = function (event, message) {
  this.eventNotifier.notifyEvent(event, message);
};

Simulator.prototype.addEventListener = function (event, listener) {
  this.eventNotifier.addEventListener(event, listener);
};

Simulator.prototype.getNextFreeChannel = function () {
  return this.nextFreeChannel++;
};

Simulator.EVENT = {
  ASYNC_MESSAGE_RECEIVED: 0x01
};

Simulator.instance = null;
Simulator.getInstance = function () {
  if (Simulator.instance == null) {
    Simulator.instance = new Simulator();
  }
  return Simulator.instance;
}
