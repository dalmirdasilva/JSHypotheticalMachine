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
 * OscillatorEventListener class
 */
function OscillatorEventListener(prescaller, handler) {
    
    this.counter = 0;
    this.prescaller = prescaller || 1;
    this.handler = handler;
    
    this.notify = function() {
        this.handler();
    };
    
    this.getPrescaller = function() {
        return this.prescaller;
    };
    
    this.setPrescaller = function(prescaller) {
        this.prescaller = prescaller;
    };
    
    this.getCounter = function() {
        return this.counter;
    };
    
    this.setCounter = function(counter) {
        this.counter = counter;
    };
    
    this.increaseCounterBy = function(n) {
        this.counter += n;
    };
}
