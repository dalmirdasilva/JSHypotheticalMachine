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
    
    REFRESH_FREQUENCY: 20,
    _interval: null,
    eventListeners: {},
    launcher: null,
    
    addEventListener: function(event, listener) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(listener);
    },
    
    notifyEvent: function(event) {
        var listeners = this.eventListeners[event];
        if (listeners) {
            listeners.map(function(listener) {
                listener.notify(this.launcher);
            });
        }
    },
    
    init: function(launcher) {
        this.launcher = launcher;
        var interval = 1000 / this.REFRESH_FREQUENCY;
        var self = this;
        this._interval = setInterval(function() {
            self.notifyEvent(UI.EVENT.ON_REPAINT);
        }, interval);
        this.notifyEvent(UI.EVENT.ON_INITIALIZE);
    }
} 

UI.EVENT = {
    ON_INITIALIZE: 0x00,
    ON_REPAINT: 0x01
};

var UIEventListener = function(notify) {
    this.notify = notify;
};
