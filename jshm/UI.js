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
 * UI class
 */
var UI = {

  interval: null,
  eventNotifier: new EventNotifier(),

  init: function () {
    var self = this;
    Simulator.getInstance().simulate(Config.MACHINE_FILE);
    GlassOverlay.add();
    FragmentLauncher.launchAll(function () {
      self.notifyEvent(UI.EVENT.ON_INITIALIZE);
      self.startRefreshing();
      GlassOverlay.remove();
    });
    this.attachListener();
  },

  addEventListener: function (event, listener) {
    this.eventNotifier.addEventListener(event, listener);
  },

  notifyEvent: function (event) {
    this.eventNotifier.notifyEvent(event);
  },

  stopRefreshing: function () {
    if (this.interval != null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },

  startRefreshing: function () {
    if (this.interval == null) {
      var period = 1000 / Config.UI_REFRESH_FREQUENCY;
      var self = this;
      self.interval = setInterval(function () {
        self.notifyEvent(UI.EVENT.ON_REPAINT);
      }, period);
    }
  },

  attachListener: function () {
    var self = this;
    var simulator = Simulator.getInstance();
    var channel = simulator.getNextFreeChannel();
    var listener = new SimulatorEventListener(function (message) {
      if (message.getChannel() == channel && message.getType() == Message.TYPE.CPU_EVENT_NOTIFICATION) {
        var cpuInfo = message.getPayload();
        if (!cpuInfo.sleeping && cpuInfo.powered) {
          self.startRefreshing();
        } else {
          self.stopRefreshing();
        }
      }
    });
    simulator.addEventListener(Simulator.EVENT.BROADCAST_MESSAGE_RECEIVED, listener);
    var requestMessage = new Message(Message.TYPE.ADD_CPU_EVENT_LISTENER, {event: Cpu.EVENT.ON_POWER_OFF}, channel);
    simulator.exchangeMessage(requestMessage, function (message) {
    });
    requestMessage.setPayload({event: Cpu.EVENT.ON_POWER_ON});
    simulator.exchangeMessage(requestMessage, function (message) {
    });
    requestMessage.setPayload({event: Cpu.EVENT.ON_SLEEP});
    simulator.exchangeMessage(requestMessage, function (message) {
    });
    requestMessage.setPayload({event: Cpu.EVENT.ON_AWAKE});
    simulator.exchangeMessage(requestMessage, function (message) {
    });
  },

  updateDraggableItems: function () {
    this.ELEMENT.draggableItems().draggable({
      handle: '.draggable-handler',
      stack: '.draggable-item',
      stop: function () {
        var target = $(this);
        var uuid = FragmentLauncher.getFragmentUuidFromChild(this);
        var item = Storage.getItem(uuid);
        item.position = {
          left: target.offset().left,
          top: target.offset().top,
          zIndex: target.zIndex()
        };
        Storage.setItem(uuid, item);
      }
    });
  },

  resetSavedElementPosition: function () {
    this.ELEMENT.draggableItems().each(function () {
      var uuid = FragmentLauncher.getFragmentUuidFromChild(this);
      var item = Storage.getItem(uuid);
      if (item.position )
      delete item.position;
      Storage.setItem(uuid, item);
    });
  },

  applyCustomPosition: function () {
    this.ELEMENT.draggableItems().each(function () {
      var uuid = FragmentLauncher.getFragmentUuidFromChild(this);
      var item = Storage.getItem(uuid);
      if (item.position != null) {
        $(this).animate(item.position, 200);
      }
    });
  },

  EVENT: {
    ON_INITIALIZE: 0x00,
    ON_REPAINT: 0x01
  },

  ELEMENT: {
    draggableItems: function () {
      return $('.draggable-item')
    },
    glassLayer: $('#glass-layer')
  }
};
