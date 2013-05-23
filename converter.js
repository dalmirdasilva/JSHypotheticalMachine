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
 * Converter class
 */
function Converter() {
    
    this.base = 10;
    this.availableBases = new Array(2, 8, 10, 16);
    
    this.setBase = function(base) {
        if(this.availableBases.indexOf(base) >= 0) {
            this.base = base;
        }
    }
    
    this.toNumber = function(string) {
        return parseInt(string, this.base);
    }
    
    this.toString = function(number) {
        return number.toString(this.base);
    }
}
