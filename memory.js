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
 * Memory class
 */
function Memory(size) {
    
    this.size = size;
    this.buffer = new ArrayBuffer(size);
    this.dataView = new DataView(this.buffer);
    this.eventListeners = {};
    
    this.access = {read: 0, write: 0};
    
    this.read = function(address) {
        this.checkBoundaries(address);
        this.access.read++;
        return this.dataView.getUint8(address);
    };
    
    this.write = function(address, value) {
        this.checkBoundaries(address);
        this.access.write++;
        this.dataView.setUint8(address, value);
        this.notifyEvent(Memory.EVENT.AFTER_WRITE, address);
    };
    
    this.erase = function() {
        for(var i = 0; i < this.size / 4; i += 4) {
            this.dataView.setUint32(i, 0);
        }
        this.resetAccess();
    };
    
    this.resetAccess = function() {
        this.access.read = 0;
        this.access.write = 0;
    };
    
    this.getAccess = function() {
        return this.access;
    };
    
    this.getSize = function() {
        return this.size;
    };
    
    this.getBuffer = function() {
        return this.buffer;
    };
    
    this.setBuffer = function(buffer) {
        this.buffer = buffer;
        this.dataView = new DataView(this.buffer);
    };
    
    this.checkBoundaries = function(address) {
        if (address < 0 || address >= this.size) {
            throw "Memory access violation at " + address + ".";
        }
    };
    
    this.notifyEvent = function(event, address) {
        var self = this;
        var listeners = this.eventListeners[event];
        if (listeners) {
            listeners.map(function(listener) {
                if (address >= listener.begin  && address <= listener.end) {
                    var slice = self.buffer.slice(listener.begin, listener.end);
                    listener.notify(slice);
                }
            });
        }
    };
    
    this.addEventListener = function(event, listener) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(listener);
    };
}

Memory.EVENT = {
    AFTER_WRITE: 0x01
};

function MemoryEventListener(begin, end, notify) {
    this.begin = begin;
    this.end = end;
    this.notify = notify;
}
