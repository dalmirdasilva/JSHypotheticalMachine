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
 * Cpu class
 */
function Cpu() {
  
    this.pc = 0;
    this.ac = 0;
    this.z = false;
    this.n = false;
    this.sleeping = false;
    this.powered = false;

    this.memoryAccess = {read: 0, write: 0};
    
    this.stack;
    this.memory;
    this.decoder;
    
    this.clockFrequency = 10;
  
    this.masks = {
        pc: 0xff,
        ac: 0xff
    };
    this._interval;
    
    this.fetchInstruction = function() {
        return this.readMemory(this.nextPc());
    }
    
    this.decodeInstruction = function(opcode) {
        return this.decoder.decode(opcode);
    }
    
    this.executeInstruction = function(instruction) {
        instruction.exec(this);
    }
    
    this.nextPc = function() {
        var pc = this.pc++;
        this.pc &= this.masks.pc;
        return pc;
    }
    
    this.clockTick = function() {
        if(!this.isSleeping()) {
            var opcode = this.fetchInstruction();
            var instruction = this.decodeInstruction(opcode);
            try {
                this.executeInstruction(instruction);
            } catch(e) {
                this.sleep();
                throw e;
            }
        }
    }

    this.powerOn = function() {
        var tcy = 1000 / this.clockFrequency;
        var self = this;
        this._interval = setInterval(function() {
            self.clockTick();
        }, tcy);
        this.powered = true;
    }

    this.powerOff = function() {
        clearInterval(this._interval);
        this.reset();
        this.awake();
        this.powered = false;
    }
    
    this.isPowered = function() {
        return this.powered;
    }
    
    this.sleep = function() {
        this.sleeping = true;
    }
    
    this.awake = function() {
        this.sleeping = false;
    }
    
    this.isSleeping = function() {
        return this.sleeping;
    }
    
    this.updateFlags = function() {
        cpu.z = (this.ac == 0) ? true : false;
        cpu.n = (this.ac < 0) ? true : false;
    }
    
    this.reset = function(eraseMemory) {
        this.pc = 0;
        this.ac = 0;
        this.z = false;
        this.n = false;
        this.memoryAccess = {read: 0, write: 0};
        this.getStack().erase();
        if(eraseMemory) {
            this.getMemory().erase();
        }
    }
    
    this.popStack = function() {
        return this.stack.pop();
    }
    
    this.pushStack = function(value) {
        return this.stack.push(value);
    }
    
    this.readMemory = function(address) {
        this.memoryAccess.read++;
        return this.memory.read(address);
    }
    
    this.writeMemory = function(address, value) {
        this.memoryAccess.write++;
        this.memory.write(address, value);
    }
    
    this.setClockFrequency = function(clockFrequency) {
        this.clockFrequency = clockFrequency;
    }
    
    this.getClockFrequency = function() {
        return this.clockFrequency;
    }
    
    this.setStack = function(stack) {
        this.stack = stack;
    }
    
    this.getStack = function() {
        return this.stack;
    }
    
    this.setMemory = function(memory) {
        this.memory = memory;
    }
    
    this.getMemory = function() {
        return this.memory;
    }
    
    this.setDecoder = function(decoder) {
        this.decoder = decoder;
    }
    
    this.setPc = function(pc) {
        this.pc = (pc & this.masks.pc);
    }
    
    this.setAc = function(ac) {
        this.ac = (ac & this.masks.ac);
    }
    
    this.getPc = function() {
        return (this.pc & this.masks.pc);
    }
    
    this.getAc = function() {
        return (this.ac & this.masks.ac);
    }
    
    this.getMemoryAccess = function() {
        return this.memoryAccess;
    }
}
