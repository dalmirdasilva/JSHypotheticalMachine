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
 * Converter class
 */
var Converter = {

  radix: Config.UI_DEFAULT_RADIX,
  availableRadixes: [2, 8, 10, 16],
  radixByteLength: [8, 3, 3, 2],
  eventNotifier: new EventNotifier(),

  addEventListener: function (event, listener) {
    this.eventNotifier.addEventListener(event, listener);
  },

  setRadix: function (radix) {
    if (radix != this.radix && this.isRadixAvailable(radix)) {
      var _radix = this.radix;
      this.radix = radix;
      this.eventNotifier.notifyEvent(Converter.EVENT.ON_BASE_CHANGE, {
        from: _radix,
        to: radix
      });
    }
  },

  isRadixAvailable: function (radix) {
    return this.availableRadixes.indexOf(radix) >= 0;
  },

  getRadix: function () {
    return this.radix;
  },

  toNumber: function (string) {
    return parseInt(string, this.radix);
  },

  toString: function (number, len, radix) {
    if (!radix || !this.isRadixAvailable(radix)) {
      radix = this.radix;
    }
    var s = number.toString(radix);
    var v = s;
    var length = (len) ? len - s.length : (this.radixByteLength[this.availableRadixes.indexOf(radix)] - s.length);
    for (var i = 0; i < length; i++) {
      v = '0' + v;
    }
    return v;
  }
};

Converter.EVENT = {
  ON_BASE_CHANGE: 0x00
};
