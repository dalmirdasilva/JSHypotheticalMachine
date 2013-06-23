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
 * Snapshoter object
 */
var Snapshoter = {
    
    saveState: function() {
        saveCpuState();
        saveMemoryState();
        saveStackState();
    },

    restoreState: function() {
        restoreCpuState();
        restoreMemoryState();
        restoreStackState();
    },
    
    resetState = function() {
        resetCpuState();
        resetMemoryState();
        resetStackState();
    },
    
    restoreCpuState = function() {
    },
    
    saveCpuState = function() {
    },
    
    resetCpuState = function() {
    },
    
    restoreMemoryState = function() {
    },
    
    saveMemoryState = function() {
    },
    
    resetMemoryState = function() {
    },
    
    restoreStackState = function() {
    },
    
    saveStackState = function() {
    },
    
    resetStackState = function() {
    },
};
