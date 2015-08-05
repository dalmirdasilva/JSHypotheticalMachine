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
 * Logger class
 */
var Logger = {

  logEndpoint: 'http://localhost/JSHypotheticalMachine/',

  debug: function (message) {
    this.log('debug', message);
  },

  error: function (message) {
    this.log('error', message);
  },

  info: function (message) {
    this.log('info', message);
  },

  log: function (level, message) {
    console.log(level, message);
    if (Config.SEND_LOG) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', this.logEndpoint, false);
      xhr.send(level + ': ' + message);
    }
  }
};
 
