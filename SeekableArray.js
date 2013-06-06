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
 * SeekableArray class
 */
function SeekableArray() {
    
    this.pos = 0;
    this.buf = new Array();
    
    this.push = function(b) {
        if (this.pos >= this.buf.length) {
            this.buf.push(b);
        } else {
            this.buf[this.pos] = b;
        }
        this.pos++;
    }
    
    this.pop = function() {
        if (this.pos <= 0) {
            throw "SeekableStack underflow.";
        }
        return this.buf[--this.pos];
    }
    
    this.seek = function(position) {
        if (position > this.buf.length) {
            var count = position - this.buf.length;
            while (count-- != 0) {
                this.buf.push(0);
            }
        }
        this.pos = position;
    }

    this.content = function() {
        return this.buf;
    }
 }
