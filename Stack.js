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
 * Stack class
 */
function Stack(size) {
    
    this.size = size;
    this.tos = 0;
    this.buffer = new ArrayBuffer(size);
    this.dataView = null;
    
    this.pop = function() {
        if(this.tos == 0) {
            throw "Stack underflow."
        }
        this.tos--;
        var top = this.dataView.getInt8(this.tos);
        this.dataView.setInt8(this.tos, 0x00);
        return top;
    };
    
    this.push = function(b) {
        if(this.tos >= this.size) {
            throw "Stack overflow."
        }
        this.dataView.setUint8(this.tos++, b);
    };
    
    this.erase = function() {
        for(var i = 0; i < this.size / 4; i += 4) {
            this.dataView.setUint8(i, 0);
        }
        this.tos = 0;
    };
    
    this.read = function(address) {
        return this.dataView.getUint8(address);
    };
    
    this.getSize = function() {
        return this.size;
    };
    
    this.getTop = function() {
        return this.tos;
    };
    
    this.getBuffer = function() {
        return this.buffer;
    };
    
    this.setBuffer = function(buffer) {
        this.buffer = buffer;
        this.updateDataView();
    };
    
    this.updateDataView = function() {
        this.dataView = new DataView(this.buffer);
    };
    
    this.updateDataView();
} 
