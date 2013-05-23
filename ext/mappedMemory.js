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
 * Stack MappedMemory
 */
function MappedMemory(arrayBuffer, from, size) {
    
    this.mapped = new DataView(arrayBuffer, from, size);
    this.size = size;
    
    this.size = function() {
        return this.size;
    }
    
    this.read = function(address) {
        return this.mapped.getUint8(address);
    }
    
    this.write = function(address, value) {
        this.mapped.setUint8(address, value);
    }
    
    this.erase = function() {
        for(var i = 0; i < this.size; i++) {
            this.mapped.setUint8(i, 0);
        }
    }
} 
