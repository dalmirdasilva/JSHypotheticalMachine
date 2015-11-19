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

  base: Config.UI_DEFAULT_BASE,
  availableBases: new Array(2, 8, 10, 16),
  baseByteLength: new Array(8, 3, 3, 2),
  eventNotifier: new EventNotifier(),

  addEventListener: function (event, listener) {
    this.eventNotifier.addEventListener(event, listener);
  },

  setBase: function (base) {
    if (base != this.base && this.isBaseAvailable(base)) {
      var _base = this.base;
      this.base = base;
      this.eventNotifier.notifyEvent(Converter.EVENT.ON_BASE_CHANGE, {
        from: _base,
        to: base
      });
    }
  },

  isBaseAvailable: function (base) {
    return this.availableBases.indexOf(base) >= 0;
  },

  getBase: function () {
    return this.base;
  },

  toNumber: function (string) {
    return parseInt(string, this.base);
  },

  toString: function (number, len, base) {
    if (!base || !this.isBaseAvailable(base)) {
      base = this.base;
    }
    var s = number.toString(base);
    var v = s;
    var length = (len) ? len - s.length : (this.baseByteLength[this.availableBases.indexOf(base)] - s.length);
    for (var i = 0; i < length; i++) {
      v = '0' + v;
    }
    return v;
  }
};

Converter.EVENT = {
  ON_BASE_CHANGE: 0x00
};
