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
 * Storage class
 */
var Storage = {

  clear: function () {
    return this.withLocalStorage(function (storage) {
      return storage.clear();
    });
  },

  getItem: function (key) {
    return this.withLocalStorage(function (storage) {
      var item = storage.getItem(key);
      if (item == null) {
        return {};
      }
      return JSON.parse(item);
    });
  },

  setItem: function (key, value) {
    return this.withLocalStorage(function (storage) {
      return storage.setItem(key, JSON.stringify(value));
    });
  },

  removeItem: function (key) {
    return this.withLocalStorage(function (storage) {
      return storage.removeItem(key);
    });
  },

  key: function (index) {
    return this.withLocalStorage(function (storage) {
      return storage.key(index);
    });
  },

  length: function () {
    return this.withLocalStorage(function (storage) {
      return storage.length;
    });
  },

  hasSupport: function () {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  },

  withLocalStorage: function (fn) {
    if (this.hasSupport()) {
      return fn(window.localStorage);
    }
    return null;
  }
};
