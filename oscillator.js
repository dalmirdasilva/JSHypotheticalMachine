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
    this.eventListeners = {};
    this.tics = 0;
    this._interval;
    
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
        this.notifyEvent(Oscillator.EVENT.ON_CLOCK);
    };
    
    this.addEventListener = function(event, listener) {
        if ((typeof listener.prescaller) !== "undefined" || listener.prescaller == 0) {
            listener.prescaller = 1;
        }        
        listener.counter = 0;
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(listener);
    };
    
    this.notifyEvent = function(event) {
        var listeners = this.eventListeners[event];
        if (listeners) {
            listeners.map(function(listener) {
                listener.counter++;
                if (listener.counter >= listener.prescaller) {
                    listener.counter = 0;
                    listener.notify();
                }
            });
        }
    };
    
    this.generateNextListenersId = function() {
        return this.nextListenerId++;
    };
}

Oscillator.EVENT = {
    ON_CLOCK: 0x01
};

Oscillator.ACTION = {
    RESUME_CLOCKING: 0x00,
    STOP_NEXT_CLOCK: 0x01,
    CLOCKOUT_NOW: 0x02
};

function OscillatorEventListener(prescaller, notify) {
    this.counter = 0;
    this.prescaller = prescaller;
    this.notify = notify;
}
