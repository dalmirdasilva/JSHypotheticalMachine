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
 * StackView object
 */
var StackView = {

  cache: new Uint8Array(Config.SIMULATOR_STACK_SIZE),
  lastTos: -1,

  init: function () {
    var self = this;
    self.createStackGrid();
    var listener = new UIEventListener(function () {
      self.repaint();
    });
    UI.addEventListener(UI.EVENT.ON_REPAINT, listener);
    var radixListener = {
      notify: function () {
        self.repaint(true);
      }
    };
    Converter.addEventListener(Converter.EVENT.ON_RADIX_CHANGE, radixListener);
  },

  repaint: function (force) {
    var self = this;
    Simulator.getInstance().exchangeMessage(new Message(Message.TYPE.GET_TOP_OF_STACK), function (message) {
      var topOfStack = message.getPayload();
      self.updateTopOfStack(topOfStack, force);
    });
    Simulator.getInstance().exchangeMessage(new Message(Message.TYPE.GET_STACK_BUFFER), function (message) {
      var arrayBuffer = message.getPayload();
      self.updateStackValues(arrayBuffer, force);
    });
  },

  updateTopOfStack: function (tos, force) {
    if (force || tos != this.lastTos) {
      this.lastTos = tos;
      this.ELEMENT.currentCell().removeClass('stack-cell-current');
      this.ELEMENT.topOfStack(tos).addClass('stack-cell-current');
    }
  },

  updateStackValues: function (arrayBuffer, force) {
    var array = new Uint8Array(arrayBuffer);
    for (var i = 0; i < array.length; i++) {
      var byte = array[i];
      if (force || byte != this.cache[i]) {
        this.cache[i] = byte;
        var text = Converter.toString(byte);
        this.ELEMENT.topOfStack(i).text(text);
      }
    }
  },

  createStackGrid: function () {
    var table = this.ELEMENT.stackGridTable;
    var stackSize = Config.SIMULATOR_STACK_SIZE;
    var tr = this.ELEMENT.stackGridTr.clone();
    var positionTd = this.ELEMENT.stackGridTd.clone();
    positionTd.html('&nbsp;');
    positionTd.addClass('stack-cell-corner');
    var valueTd = this.ELEMENT.stackGridTd.clone();
    valueTd.addClass('stack-cell-top');
    tr.append(positionTd);
    tr.append(valueTd);
    table.append(tr);
    for (var i = stackSize - 1; i >= 0; i--) {
      tr = this.ELEMENT.stackGridTr.clone();
      positionTd = this.ELEMENT.stackGridTd.clone();
      positionTd.html(i.toString(16).toUpperCase());
      positionTd.addClass('stack-cell-side');
      valueTd = this.ELEMENT.stackGridTd.clone();
      valueTd.html(Converter.toString(0));
      var stackCellId = 'stack-reg-' + i;
      valueTd.attr('id', stackCellId)
        .attr('position', i)
        .addClass('stack-cell');
      tr.append(positionTd);
      tr.append(valueTd);
      table.append(tr);
    }
    table.appendTo(this.ELEMENT.stackBody);
  },

  ELEMENT: {
    stackGridTable: $("<table border='0' cellspacing='0' cellpadding='1' width='100%'></table>"),
    stackGridTr: $('<tr></tr>'),
    stackGridTd: $('<td></td>'),
    stackBody: $('#stack-body'),
    stackHolder: $('#stack-holder'),
    topOfStack: function (tos) {
      return $('#stack-reg-' + tos, this.stackHolder);
    },
    currentCell: function () {
      return $('.stack-cell-current', this.stackHolder);
    }
  }
};
