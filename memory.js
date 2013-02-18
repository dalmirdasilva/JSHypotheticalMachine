/**
 * JS Hypothetical Machine
 * 
 * Copyright (C) 2011  Dalmir da Silva <dalmirdasilva@gmail.com>
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
    this.buf = new ArrayBuffer(size);
    this.dv = new DataView(this.buf);
    
    this.read = function(address) {
        if (address < 0 || address >= this.size) {
            throw "Memory access violation.";
        }
        return this.dv.getInt8(address);
    }
    
    this.write = function(address, value) {
        if(address < this.getSize()) {
            this.dv.setInt8(address, value);
        }
    }
    
    this.erase = function() {
        for(var i = 0; i < this.size; i++) {
            this.dv.setInt8(i, 0);
        }
    }
    
    this.getSize = function() {
        return this.size;
    }
}
