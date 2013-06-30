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
 * Cpu class
 */
function Cpu(memory, stack, decoder, oscillator) {

    this.pc = 0;
    this.ac = 0;
    this.z = false;
    this.n = false;
    this.sleeping = false;
    this.powered = false;
    this.interruptVector = Config.INTERRUPT_VECTOR;
    this.interruptEnable = true;
    this.interruptStatus = false;
    this.contextStack = [];
    
    this.oscillator = oscillator;
    this.stack = stack;
    this.memory = memory;
    this.decoder = decoder;
    
    this.masks = {
        pc: 0xff,
        ac: 0xff
    };
    
    this.fetchNextInstruction = function() {
        return this.readMemory(this.nextPc());
    };
        
    this.decodeInstruction = function(opcode) {
        return this.decoder.decode(opcode);
    };
    
    this.executeInstruction = function(instruction) {
        instruction.exec(this);
        this.checkInterrupt();
    };
    
    this.nextPc = function() {
        var pc = this.pc++;
        this.pc &= this.masks.pc;
        return pc;
    };
    
    this.clockTick = function() {
        with (this) {
            if(!isSleeping() && isPowered()) {
                try {
                    var opcode = fetchNextInstruction();
                    var instruction = decodeInstruction(opcode);
                    executeInstruction(instruction);
                } catch(e) {
                    sleep();
                    Logger.error(e);
                }
            }
        }
    };
    
    this.returnFromInterrupt = function() {
        with (this) {
            restoreContext();
            enableInterrupt();
        }
    };
    
    this.checkInterrupt = function() {
        with (this) {
            if (wasInterrupted()) {
                saveContext();
                disableInterrupt();
                clearInterruptStatus();
                setPc(interruptVector);
            }
        }
    };
    
    this.saveContext = function() {
        var context = {pc: this.pc, ac: this.ac, z: this.z, n: this.n};
        this.contextStack.push(context);
    };
    
    this.restoreContext = function() {
        var context = this.contextStack.pop();
        if (context) {
            this.pc = context.pc;
            this.ac = context.ac;
            this.z = context.z;
            this.n = context.n;
        }
    };
    
    this.wasInterrupted = function() {
        return this.interruptEnable && this.interruptStatus;
    };
    
    this.interrupt = function() {
        if (this.interruptEnable) {
            this.interruptStatus = true;
        }
    };
    
    this.clearInterruptStatus = function() {
        this.interruptStatus = false;
    };
    
    this.enableInterrupt = function() {
        this.interruptEnable = true;
    };
    
    this.disableInterrupt = function() {
        this.interruptEnable = false;
    };
    
    this.powerOn = function() {
        this.powered = true;
    };

    this.powerOff = function() {
        this.powered = false;
        this.reset();
        this.awake();
        this.memory.resetAccess();
    };
    
    this.isPowered = function() {
        return this.powered;
    };
    
    this.sleep = function() {
        this.sleeping = true;
    };
    
    this.awake = function() {
        this.sleeping = false;
    };
    
    this.isSleeping = function() {
        return this.sleeping;
    };
    
    this.updateFlags = function() {
        cpu.z = (this.ac == 0) ? true : false;
        cpu.n = (this.ac < 0) ? true : false;
    };
    
    this.reset = function(eraseMemory) {
        this.pc = 0;
        this.ac = 0;
        this.z = false;
        this.n = false;
        this.getStack().erase();
        if(eraseMemory) {
            this.getMemory().erase();
        }
    };
    
    this.stackPop = function() {
        return this.stack.pop();
    };
    
    this.stackPush = function(value) {
        return this.stack.push(value);
    };
    
    this.readMemory = function(address) {
        return this.memory.read(address);
    };
    
    this.writeMemory = function(address, value) {
        this.memory.write(address, value);
    };
    
    this.setOscillator = function(oscillator) {
        this.oscillator = oscillator;
        var self = this;
        var listener = new OscillatorEventListener(Config.SIMULATOR_CPU_PRESCALLER, function() {
            self.clockTick();
        });
        this.oscillator.addEventListener(Oscillator.EVENT.ON_CLOCK, listener);
    };
    
    this.getOscillator = function() {
        return this.oscillator;
    };
    
    this.setClockFrequency = function(clockFrequency) {
        this.clockFrequency = clockFrequency;
    };
    
    this.getClockFrequency = function() {
        return this.clockFrequency;
    };
    
    this.setStack = function(stack) {
        this.stack = stack;
    };
    
    this.getStack = function() {
        return this.stack;
    };
    
    this.setMemory = function(memory) {
        this.memory = memory;
    };
    
    this.getMemory = function() {
        return this.memory;
    };
    
    this.setDecoder = function(decoder) {
        this.decoder = decoder;
    };
    
    this.setPc = function(pc) {
        this.pc = (pc & this.masks.pc);
    };
    
    this.setAc = function(ac) {
        this.ac = (ac & this.masks.ac);
    };
    
    this.getPc = function() {
        return (this.pc & this.masks.pc);
    };
    
    this.getAc = function() {
        return (this.ac & this.masks.ac);
    };
    
    this.getFlags = function() {
        return {"z": this.z, "n": this.n};
    };
    
    if (oscillator instanceof Oscillator) {
        this.setOscillator(oscillator);
    }
}

Cpu.packState = function(cpu) {
	return {"pc": cpu.getPc(), "ac": cpu.getAc(), "flags": cpu.getFlags(), "sleeping": cpu.isSleeping(), "powered": cpu.isPowered()};
}
