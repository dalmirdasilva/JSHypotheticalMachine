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
 * Instruction table
 *
 * 0x00 nop
 * 0x01 sta
 * 0x02 lda
 * 0x03 add
 * 0x04 or
 * 0x05 and
 * 0x06 not
 * 0x07 jmp
 * 0x08 jn
 * 0x09 jz
 *
 * 0x0a call
 * 0x0b ret
 * 0x0c push
 * 0x0d pop
 *
 * 0x0e reti
 *
 * 0xff hlt
 */
var Instruction = function () {
};

Instruction.opcodeMap = {
  NOP: 0x00,
  STA: 0x01,
  LDA: 0x02,
  ADD: 0x03,
  OR: 0x04,
  AND: 0x05,
  NOT: 0x06,
  JMP: 0x07,
  JN: 0x08,
  JZ: 0x09,
  CALL: 0x0a,
  RET: 0x0b,
  PUSH: 0x0c,
  POP: 0x0d,
  RETI: 0x0e,
  HLT: 0xff
};

Instruction.nameMap = {
  NOP: 'nop',
  STA: 'sta',
  LDA: 'lda',
  ADD: 'add',
  OR: 'or',
  AND: 'and',
  NOT: 'not',
  JMP: 'jmp',
  JN: 'jn',
  JZ: 'jz',
  CALL: 'call',
  RET: 'ret',
  PUSH: 'push',
  POP: 'pop',
  RETI: 'reti',
  HLT: 'hlt'
};

Instruction.hasParam = {
  NOP: false,
  STA: true,
  LDA: true,
  ADD: true,
  OR: true,
  AND: true,
  NOT: true,
  JMP: true,
  JN: true,
  JZ: true,
  CALL: true,
  RET: false,
  PUSH: true,
  POP: true,
  RETI: false,
  HLT: false
};

Instruction.getOpcodes = function () {
  var opcodes = [];
  for (var i in Instruction.opcodeMap) {
    opcodes.push(Instruction.opcodeMap[i]);
  }
  return opcodes;
};

Instruction.getMnemonics = function () {
  var names = [];
  for (var i in Instruction.nameMap) {
    names.push(Instruction.nameMap[i]);
  }
  return names;
};

Instruction.Nop = function () {
};

Instruction.Nop.prototype.exec = function (cpu) {
};

Instruction.Sta = function () {
};

Instruction.Sta.prototype.exec = function (cpu) {
  var address = cpu.readMemory(cpu.nextPc());
  cpu.writeMemory(address, cpu.getAc());
  cpu.updateFlags();
};

Instruction.Lda = function () {
};

Instruction.Lda.prototype.exec = function (cpu) {
  var address = cpu.readMemory(cpu.nextPc());
  var value = cpu.readMemory(address);
  cpu.setAc(value);
  cpu.updateFlags();
};

Instruction.Add = function () {
};

Instruction.Add.prototype.exec = function (cpu) {
  var address = cpu.readMemory(cpu.nextPc());
  var value = cpu.readMemory(address);
  var ac = cpu.getAc();
  cpu.setAc(ac + value);
  cpu.updateFlags();
};

Instruction.Or = function () {
};

Instruction.Or.prototype.exec = function (cpu) {
  var address = cpu.readMemory(cpu.nextPc());
  var value = cpu.readMemory(address);
  var ac = cpu.getAc();
  cpu.setAc(ac | value);
  cpu.updateFlags();
};

Instruction.And = function () {
};

Instruction.And.prototype.exec = function (cpu) {
  var address = cpu.readMemory(cpu.nextPc());
  var value = cpu.readMemory(address);
  var ac = cpu.getAc();
  cpu.setAc(ac & value);
  cpu.updateFlags();
};

Instruction.Not = function () {
};

Instruction.Not.prototype.exec = function (cpu) {
  var ac = cpu.getAc();
  cpu.setAc(~ac);
  cpu.updateFlags();
};

Instruction.Jmp = function () {
};

Instruction.Jmp.prototype.exec = function (cpu) {
  var to = cpu.readMemory(cpu.nextPc());
  cpu.setPc(to);
};

Instruction.Jn = function () {
};

Instruction.Jn.prototype.exec = function (cpu) {
  var to = cpu.readMemory(cpu.nextPc());
  if (cpu.n) {
    cpu.setPc(to);
  }
};

Instruction.Jz = function () {
};

Instruction.Jz.prototype.exec = function (cpu) {
  var to = cpu.readMemory(cpu.nextPc());
  if (cpu.z) {
    cpu.setPc(to);
  }
};

Instruction.Hlt = function () {
};

Instruction.Hlt.prototype.exec = function (cpu) {
  cpu.sleep();
};

Instruction.Call = function () {
};

Instruction.Call.prototype.exec = function (cpu) {
  var address = cpu.readMemory(cpu.nextPc());
  cpu.stackPush(cpu.getPc());
  cpu.setPc(address);
};

Instruction.Ret = function () {
};

Instruction.Ret.prototype.exec = function (cpu) {
  cpu.setPc(cpu.stackPop());
};

Instruction.Push = function () {
};

Instruction.Push.prototype.exec = function (cpu) {
  var value = cpu.getAc();
  cpu.stackPush(value);
};

Instruction.Pop = function () {
};

Instruction.Pop.prototype.exec = function (cpu) {
  var value = cpu.stackPop();
  cpu.setAc(value);
};

Instruction.Reti = function () {
};

Instruction.Reti.prototype.exec = function (cpu) {
  cpu.returnFromInterrupt();
};

