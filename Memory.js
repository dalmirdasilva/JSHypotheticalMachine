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
    
    this.size = size || Config.SIMULATOR_MEMORY_SIZE;
    this.buffer = new Int8Array(size);
    this.eventListeners = {};
    this.addressMask = Config.SIMULATOR_MEMORY_ADDRESS_MASK || 0xff;
    this.access = {read: 0, write: 0};
    
    this.read = function(address) {
        address &= this.addressMask;
        this.checkBoundaries(address);  
        this.access.read++;
        return this.buffer[address];
    };
    
    this.write = function(address, value) {
        address &= this.addressMask;
        this.checkBoundaries(address);
        this.buffer[address] = value;
        this.access.write++;
        this.notifyEvent(Memory.EVENT.AFTER_WRITE, address);
    };
    
    this.erase = function() {
        this.buffer.set(new Int8Array(size), 0);
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
        this.buffer = new Int8Array(buffer);
    };
    
    this.checkBoundaries = function(address) {
        if (address >= this.size) {
            throw new Error("Memory access violation at " + address + ".");
        }
    };
    
    this.notifyEvent = function(event, address) {
        var self = this;
        var listeners = self.eventListeners[event];
        if (listeners) {
            listeners.map(function(listener) {
                if (address >= listener.begin  && address <= listener.end) {
                    var slice = self.buffer.subarray(listener.begin, listener.end + 1);
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
