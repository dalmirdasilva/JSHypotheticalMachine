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
 * Decoder class
 */
var Decoder = function () {
};

Decoder.prototype.decode = function (opcode) {
  switch (opcode & 0xff) {
    case Instruction.opcodeMap.NOP:
      return new Instruction.Nop();
      break;
    case Instruction.opcodeMap.STA:
      return new Instruction.Sta();
      break;
    case Instruction.opcodeMap.LDA:
      return new Instruction.Lda();
      break;
    case Instruction.opcodeMap.ADD:
      return new Instruction.Add();
      break;
    case Instruction.opcodeMap.OR:
      return new Instruction.Or();
      break;
    case Instruction.opcodeMap.AND:
      return new Instruction.And();
      break;
    case Instruction.opcodeMap.NOT:
      return new Instruction.Not();
      break;
    case Instruction.opcodeMap.JMP:
      return new Instruction.Jmp();
      break;
    case Instruction.opcodeMap.JN:
      return new Instruction.Jn();
      break;
    case Instruction.opcodeMap.JZ:
      return new Instruction.Jz();
      break;
    case Instruction.opcodeMap.CALL:
      return new Instruction.Call();
      break;
    case Instruction.opcodeMap.RET:
      return new Instruction.Ret();
      break;
    case Instruction.opcodeMap.PUSH:
      return new Instruction.Push();
      break;
    case Instruction.opcodeMap.POP:
      return new Instruction.Pop();
      break;
    case Instruction.opcodeMap.RETI:
      return new Instruction.Reti();
      break;
    case Instruction.opcodeMap.HLT:
      return new Instruction.Hlt();
      break;
    default:
      return new Instruction.Nop();
  }
};