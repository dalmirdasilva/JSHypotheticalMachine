/**
 * Neander simulator - A simple simulator for the Neander hypothetical computer in javascript
 *
 * Copyright (C) 2011  Dalmir da Silva <dalmirdasilva@gmail.com>
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
function Memory(size) {

  this.data = new Array(size);

  this.mask = 0xffffffff;

  this.size = function () {
    return this.data.length;
  };

  this.read = function (address) {
    return (this.data[address] & this.mask);
  };

  this.write = function (address, data) {
    if (address < this.size()) {
      this.data[address] = (data & this.mask);
    }
  };

  this.erase = function () {
    for (var i = 0; i < this.size(); i++) {
      this.data[i] = 0;
    }
  };
}
