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
 * Glcd class
 */
function Glcd(width, height, graphicMemory, refreshRate, writePixel) {
    
    this.width = width;
    this.height = height;
    this.graphicMemory = graphicMemory;
    this.refreshRate = refreshRate;
    this.writePixel = writePixel;
    this._interval;
    this.powered = false;
    
    this.init = function() {
        var tcy = 1000 / this.refreshRate;
        var self = this;
        this._interval = setInterval(function() {
            self.refresh();
        }, tcy);
        this.powered = true;
    }
    
    this.stop = function() {
        clearInterval(this._interval);
        this.powered = false;
    }
    
    this.refresh = function() {
        var address = 0;
        for (var j = 0; j < height / 8; j++) {
            for (var i = 0; i < this.width; i++) {
                var byte = this.graphicMemory.read(address++);
                for (var k = 7; k >= 0; k--) {
                    this.writePixel(i, (8*j) + k, (byte & (0x01 << k)));
                }                    
            }
        }
    }
    
    this.setWidth = function(width) {
        this.width = width;
    }
    
    this.setHeight = function(height) {
        this.height = height;
    }
    
    this.getPowered = function() {
        return this.powered;
    }
} 
