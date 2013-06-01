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
 * Oscillator class
 */
function Oscillator(frequency) {
    
    this.MAX_FREQUENCY = 1000;
    this.frequency = frequency;
    this.attachedListeners = [];
    this.tics = 0;
    this.listenersIdCounter = 0;
    this._interval;
    this.started = false;
    
    this.getFrequency = function() {
        return this.frequency;
    };
    
    this.setFrequency = function(frequency) {
        if (frequency > this.MAX_FREQUENCY || frequency < 1) {
            throw "Oscillation frequency " + frequency + " out or range of 1.." + this.MAX_FREQUENCY + "";
        }
        this.frequency = frequency;
        this.restartClocking();
    };
    
    this.restartClocking = function() {
        this.stopClocking();
        this.startClocking();
    };

    this.stopClocking = function() {
        clearInterval(this._interval);
    };
    
    this.startClocking = function() {
        var interval = 1000 / this.frequency;
        var self = this;
        this.stopClocking();
        this._interval = setInterval(function() {
            self.clockOut();
        }, interval);
        return interval;
    };
    
    this.clockOut = function() {
        this.tics++;
        this.notifyListeners();
    };
    
    this.attachListener = function(notify, prescaller) {
        prescaller = ((typeof prescaller) !== "undefined" || prescaller == 0) ? prescaller : 1;
        var id = this.nextListenersId();
        var listener = {"notify": notify, "prescaller": prescaller, "counter": 0, "listenersId": id};
        this.attachedListeners.push(listener);
        return id;
    };
    
    this.connect = function(notify, prescaller) {
        return this.attachListener(notify, prescaller);
    };
    
    this.unattachListener = function(listenersId) {
        var position = -1;
        this.attachedListeners.map(function(listener, index) {
            if (listener["listenersId"] == listenersId) {
                position = index;
            }
        });
        if (~position) {
            this.attachedListeners.splice(position, 1);
            return true;
        }
        return false;
    };
    
    this.notifyListeners = function() {
        for (var i in this.attachedListeners) {
            var listener = this.attachedListeners[i]
            listener.counter++;
            if (listener.counter >= listener.prescaller) {
                listener.counter = 0;
                listener.notify();
            }
        }
    };
    
    this.nextListenersId = function() {
        return this.listenersIdCounter++;
    };
}

