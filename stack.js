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
    this.buf = new ArrayBuffer(size);
    this.dv = new DataView(this.buf);
    
    this.pop = function() {
        if(this.tos == 0) {
            throw "Stack underflow."
        }
        this.tos--;
        return this.dv.getInt8(this.tos);
    };
    
    this.push = function(b) {
        if(this.tos >= this.size) {
            throw "Stack overflow."
        }
        this.dv.setUint8(this.tos++, b);
    };
    
    this.erase = function() {
        for(var i = 0; i < this.size / 4; i += 4) {
            this.dv.setUint8(i, 0);
        }
        this.tos = 0;
    };
    
    this.read = function(address) {
        return this.dv.getUint8(address);
    };
    
    this.getSize = function() {
        return this.size;
    };
    
    this.getTop = function() {
        return this.tos;
    };
    
    this.getBuffer = function() {
        return this.buf;
    };
} 
