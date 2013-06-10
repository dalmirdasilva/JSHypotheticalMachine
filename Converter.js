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
 * Converter class
 */ 
var Converter = {
    
    base: Config.UI_DEFAULT_BASE,
    availableBases: new Array(2, 8, 10, 16),
    baseByteLength: new Array(8, 3, 3, 2),
    
    setBase: function(base) {
        if(this.availableBases.indexOf(base) >= 0) {
            this.base = base;
        }
    },
    
    getBase: function() {
        return this.base;
    },
    
    toNumber: function(string) {
        return parseInt(string, this.base);
    },
    
    toString: function(number) {
        var s = number.toString(this.base);
        var v = s;
        for (var i = 0; i < (this.baseByteLength[this.availableBases.indexOf(this.base)] - s.length); i++) {
            v = "0" + v;
        }
        return v;
    }
}