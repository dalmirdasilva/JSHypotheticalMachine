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
var Simulator = function () {
  this.messageHandlerQueue = [];
  this.worker = null;
  this.running = false;
  this.eventNotifier = new EventNotifier();
  this.nextFreeChannel = 0;
};

Simulator.prototype.broadcastMessageHandler = function (message) {
  this.notifyEvent(Simulator.EVENT.BROADCAST_MESSAGE_RECEIVED, message);
};

Simulator.prototype.simulate = function (path) {
  if (!this.running) {
    var self = this;
    this.worker = new Worker(path);
    this.worker.addEventListener(Simulator.EVENT.MESSAGE_RECEIVED, function (event) {
      var message = Message.newFromHash(event.data);
      if (message.getType() == Message.TYPE.EXCEPTION_REPORT) {
        self.processExceptionReport(message);
      }
      if (message.isBroadcast()) {
        self.broadcastMessageHandler(message);
      } else {
        var handler = self.messageHandlerQueue.shift();
        if (handler && (typeof handler === 'function')) {
          handler(message);
        } else {
          throw new Error('No available handler for message: ' + message);
        }
      }
    }, false);
    this.running = true;
  }
};

/**
 * Exchanges a message with the machine.
 *
 * TODO: make sure every exchanged message is properly handled.
 *
 * @param message
 * @param responseHandler
 * @returns {boolean}
 */
Simulator.prototype.exchangeMessage = function (message, responseHandler) {
  if (!this.running) {
    throw new Error('No running worker to exchange message.');
  }
  this.messageHandlerQueue.push(responseHandler);

  // What happens if at this moment a message comes from worker?
  // What happens if this specific message never come back?
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

Simulator.prototype.processExceptionReport = function (message) {
  Logger.error('Exception reported: ' + message.getPayload());
};

Simulator.EVENT = {
  MESSAGE_RECEIVED: 'message',
  BROADCAST_MESSAGE_RECEIVED: 0x01
};

Simulator.instance = null;
Simulator.getInstance = function () {
  if (Simulator.instance == null) {
    Simulator.instance = new Simulator();
  }
  return Simulator.instance;
};
