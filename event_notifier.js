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
 * EventNotifier static class
 */
var EventNotifier = {
    
    callbacks: new Array(),
    
    _init: function(name) {
        if (!this.callbacks[name]) {
            this.callbacks[name] = new Array();
        }
    },

    notify: function(name) {
        this._init(name);
        for (var i = 0; i < this.callbacks[name].length; i++) {
            var callback = this.callbacks[name][i];
            try {
                callback(arguments);
            } catch (e) {
            }
        }
    },

    attach: function(name, callback) {
        this._init(name);
        if (this.callbacks[name]) {
            this.callbacks[name].push(callback);
        }
    }
}
