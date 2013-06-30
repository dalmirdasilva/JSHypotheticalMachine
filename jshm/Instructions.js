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
 * All instruction classes
 */

function Nop() {
    this.exec = function(cpu) {}
}

/**
 * Stores the ACC to a memory address.
 */
function Sta() {
    this.exec = function(cpu) {
        var address = cpu.readMemory(cpu.nextPc());
        cpu.writeMemory(address, cpu.getAc());
        cpu.updateFlags();
    }
}

/**
 * Loads a memory address to the ACC.
 */
function Lda() {
    this.exec = function(cpu) {
        var address = cpu.readMemory(cpu.nextPc());
        var value = cpu.readMemory(address);
        cpu.setAc(value);
        cpu.updateFlags();
    }
}

/**
 * Adds to the ACC the memory address value.
 */
function Add() {
    this.exec = function(cpu) {
        var address = cpu.readMemory(cpu.nextPc());
        var value = cpu.readMemory(address);
        var ac = cpu.getAc();
        cpu.setAc(ac + value);
        cpu.updateFlags();
    }
}

/**
 * Performs a logic AR between a memory address value with the ACC.
 */
function Or() {
    this.exec = function(cpu) {
        var address = cpu.readMemory(cpu.nextPc());
        var value = cpu.readMemory(address);
        var ac = cpu.getAc();
        cpu.setAc(ac | value);
        cpu.updateFlags();
    }
}

/**
 * Performs a logic AND between a memory address value with the ACC.
 */
function And() {
    this.exec = function(cpu) {
        var address = cpu.readMemory(cpu.nextPc());
        var value = cpu.readMemory(address);
        var ac = cpu.getAc();
        cpu.setAc(ac & value);
        cpu.updateFlags();
    }
}

/**
 * Performs a logic NOT with the ACC.
 */
function Not() {
    this.exec = function(cpu) {
        var ac = cpu.getAc();
        cpu.setAc(~ac);
        cpu.updateFlags();
    }
}

function Jmp() {
    this.exec = function(cpu) {
        var to = cpu.readMemory(cpu.nextPc());
        cpu.setPc(to);
    }
}

function Jn() {
    this.exec = function(cpu) {
        var to = cpu.readMemory(cpu.nextPc());
        if(cpu.n) {
            cpu.setPc(to);
        }
    }
}

function Jz() {
    this.exec = function(cpu) {
        var to = cpu.readMemory(cpu.nextPc());
        if(cpu.z) {
            cpu.setPc(to);
        }
    }
}

function Hlt() {
    this.exec = function(cpu) {
        cpu.sleep();
    }
}

function Call() {
    this.exec = function(cpu) {
        var address = cpu.readMemory(cpu.nextPc());
        cpu.stackPush(cpu.getPc());
        cpu.setPc(address);
    }
}

function Ret() {
    this.exec = function(cpu) {
        cpu.setPc(cpu.stackPop());
    }
}

function Push() {
    this.exec = function(cpu) {
        var value = cpu.getAc();
        cpu.stackPush(value);
    }
}

function Pop() {
    this.exec = function(cpu) {
        var value = cpu.stackPop();
        cpu.setAc(value);
    }
}

function Reti() {
    this.exec = function(cpu) {
        cpu.returnFromInterrupt();
    }
}

