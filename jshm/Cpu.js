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
var Cpu = function (memory, stack, decoder, oscillator) {
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

  this.eventNotifier = new EventNotifier();

  if (oscillator instanceof Oscillator) {
    this.setOscillator(oscillator);
  }
};

Cpu.prototype.fetchNextInstruction = function () {
  return this.readMemory(this.nextPc());
};

Cpu.prototype.decodeInstruction = function (opcode) {
  return this.decoder.decode(opcode);
};

Cpu.prototype.executeInstruction = function (instruction) {
  instruction.exec(this);
  this.checkInterrupt();
};

Cpu.prototype.nextPc = function () {
  var pc = this.pc++;
  this.pc &= this.masks.pc;
  return pc;
};

Cpu.prototype.clockTick = function () {
  if (!this.isSleeping() && this.isPowered()) {
    try {
      var opcode = this.fetchNextInstruction();
      var instruction = this.decodeInstruction(opcode);
      this.executeInstruction(instruction);
    } catch (e) {
      this.sleep();
      Logger.error(e);
    }
  }
};

Cpu.prototype.returnFromInterrupt = function () {
  this.restoreContext();
  this.enableInterrupt();
};

Cpu.prototype.checkInterrupt = function () {
  if (this.wasInterrupted()) {
    this.saveContext();
    this.disableInterrupt();
    this.clearInterruptStatus();
    this.setPc(this.interruptVector);
  }
};

Cpu.prototype.saveContext = function () {
  var context = {
    pc: this.pc,
    ac: this.ac,
    z: this.z,
    n: this.n
  };
  this.contextStack.push(context);
};

Cpu.prototype.restoreContext = function () {
  var context = this.contextStack.pop();
  if (context) {
    this.pc = context.pc;
    this.ac = context.ac;
    this.z = context.z;
    this.n = context.n;
  }
};

Cpu.prototype.wasInterrupted = function () {
  return this.interruptEnable && this.interruptStatus;
};

Cpu.prototype.interrupt = function () {
  if (this.interruptEnable) {
    this.interruptStatus = true;
    this.eventNotifier.notifyEvent(Cpu.EVENT.ON_INTERRUPT, this);
  }
};

Cpu.prototype.clearInterruptStatus = function () {
  this.interruptStatus = false;
};

Cpu.prototype.enableInterrupt = function () {
  this.interruptEnable = true;
};

Cpu.prototype.disableInterrupt = function () {
  this.interruptEnable = false;
};

Cpu.prototype.powerOn = function () {
  this.powered = true;
  this.eventNotifier.notifyEvent(Cpu.EVENT.ON_POWER_ON, this);
};

Cpu.prototype.powerOff = function () {
  this.powered = false;
  this.reset();
  this.memory.resetAccess();
  this.eventNotifier.notifyEvent(Cpu.EVENT.ON_POWER_OFF, this);
};

Cpu.prototype.isPowered = function () {
  return this.powered;
};

Cpu.prototype.sleep = function () {
  this.sleeping = true;
  this.eventNotifier.notifyEvent(Cpu.EVENT.ON_SLEEP, this);
};

Cpu.prototype.awake = function () {
  this.sleeping = false;
  this.eventNotifier.notifyEvent(Cpu.EVENT.ON_AWAKE, this);
};

Cpu.prototype.isSleeping = function () {
  return this.sleeping;
};

Cpu.prototype.updateFlags = function () {
  cpu.z = (this.ac == 0);
  cpu.n = (this.ac < 0);
};

Cpu.prototype.reset = function (eraseMemory) {
  this.pc = 0;
  this.ac = 0;
  this.z = false;
  this.n = false;
  this.getStack().erase();
  if (eraseMemory) {
    this.getMemory().erase();
  }
};

Cpu.prototype.stackPop = function () {
  return this.stack.pop();
};

Cpu.prototype.stackPush = function (value) {
  return this.stack.push(value);
};

Cpu.prototype.readMemory = function (address) {
  return this.memory.read(address);
};

Cpu.prototype.writeMemory = function (address, value) {
  this.memory.write(address, value);
};

Cpu.prototype.setOscillator = function (oscillator) {
  this.oscillator = oscillator;
  var self = this;
  var listener = new OscillatorEventListener(Config.SIMULATOR_CPU_PRESCALLER, function () {
    self.clockTick();
  });
  this.oscillator.addEventListener(Oscillator.EVENT.ON_CLOCK, listener);
};

Cpu.prototype.getOscillator = function () {
  return this.oscillator;
};

Cpu.prototype.setClockFrequency = function (clockFrequency) {
  this.clockFrequency = clockFrequency;
};

Cpu.prototype.getClockFrequency = function () {
  return this.clockFrequency;
};

Cpu.prototype.setStack = function (stack) {
  this.stack = stack;
};

Cpu.prototype.getStack = function () {
  return this.stack;
};

Cpu.prototype.setMemory = function (memory) {
  this.memory = memory;
};

Cpu.prototype.getMemory = function () {
  return this.memory;
};

Cpu.prototype.setDecoder = function (decoder) {
  this.decoder = decoder;
};

Cpu.prototype.setPc = function (pc) {
  this.pc = (pc & this.masks.pc);
};

Cpu.prototype.setAc = function (ac) {
  this.ac = (ac & this.masks.ac);
};

Cpu.prototype.getPc = function () {
  return (this.pc & this.masks.pc);
};

Cpu.prototype.getAc = function () {
  return (this.ac & this.masks.ac);
};

Cpu.prototype.getFlags = function () {
  return {
    z: this.z,
    n: this.n
  };
};

Cpu.prototype.addEventListener = function (event, listener) {
  this.eventNotifier.addEventListener(event, listener);
};

Cpu.packState = function (cpu) {
  return {
    pc: cpu.getPc(),
    ac: cpu.getAc(),
    flags: cpu.getFlags(),
    sleeping: cpu.isSleeping(),
    powered: cpu.isPowered()
  };
};

Cpu.unpackState = function (cpu, state) {
  cpu.pc = state.pc;
  cpu.ac = state.ac;
  cpu.flags = state.flags;
  cpu.sleeping = state.sleeping;
  cpu.powered = state.powered;
};

Cpu.EVENT = {
  ON_SLEEP: 0x00,
  ON_AWAKE: 0x01,
  ON_POWER_OFF: 0x02,
  ON_POWER_ON: 0x03,
  ON_INTERRUPT: 0x04
};
