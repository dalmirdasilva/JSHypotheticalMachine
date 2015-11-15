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
 * Assembler class
 */
var Assembler = function () {
  this.commentIndicator = '#';
  this.symbolIndicator = ':';
  this.dataDefinitionIndicator = '.db';
  this.defineIndicator = '.def';
  this.positionDefinitionIndicator = '.at';
  this.opcodes = Instruction.getOpcodes();
  this.mnemonics = Instruction.getMnemonics();
  this.assembledData = null;
  this.dataDefinition = null;
  this.symbolTable = null;
  this.defineTable = null;
  this.currentLineNumber = null;
  this.mnemonicPositions = null;
};

Assembler.prototype.assemble = function (code) {
  code = this.sanitizeAssembly(code);
  this.init();
  var lines = code.toLowerCase().split('\n');
  for (var i = 0; i < lines.length; i++) {
    this.currentLineNumber = i + 1;
    this.assembleLine(lines[i]);
  }
  this.addDataDefinition();
  this.addNopInstructionOnGaps();
  this.replaceSymbols();
  return this.assembledData.content();
};

Assembler.prototype.assembleLine = function (line) {
  line = this.sanitizeAssembly(line);
  if (this.isTheLineEmpty(line) || this.isItAComment(line)) {
    return;
  }
  if (this.isItASymbol(line)) {
    this.addSymbolToTable(line);
    return;
  }
  if (this.isItADataDefinition(line)) {
    this.assembleDataDefinition(line);
    return;
  }
  if (this.isItAPositionDefinition(line)) {
    this.assemblePositionDefinition(line);
    return;
  }
  if (this.isItADefine(line)) {
    this.assembleDefine(line);
    return;
  }
  var chunks = line.split(" ");
  for (var i = 0; i < chunks.length; i++) {
    this.assembleChunk(chunks[i]);
  }
};

Assembler.prototype.assembleChunk = function (chunk) {
  chunk = this.sanitizeAssembly(chunk);
  if (chunk.length == 0) {
    return;
  }
  var code;
  if ((code = this.getOpcodeFromMnemonic(chunk)) > -1) {
    this.mnemonicPositions.push(this.assembledData.getPosition());
  } else {
    if (isNaN(chunk)) {
      if (this.isItASymbol(chunk)) {
        code = chunk;
      } else if ((code = this.tryGetFromDefine(chunk)) == undefined) {
        throw new Error('Undefined element: ' + chunk + ' (line: ' + this.currentLineNumber + ').');
      }
    } else {
      code = parseInt(chunk);
    }
  }
  this.assembledData.push(code);
};

Assembler.prototype.assembleDataDefinition = function (line) {
  var parts = line.split(' ');
  if (parts.length != 3) {
    throw new Error('Wrong data definition: ' + line + ' (line: ' + this.currentLineNumber + ').');
  }
  for (var i = 1; i <= 2; i++) {
    if (isNaN(parts[i])) {
      parts[i] = this.tryGetFromDefine(parts[i]);
      if (parts[i] == undefined) {
        throw new Error('Wrong data definition: ' + line + ' (line: ' + this.currentLineNumber + ').');
      }
    }
  }
  this.dataDefinition.push({
    address: parseInt(parts[1]),
    data: parseInt(parts[2])
  });
};

Assembler.prototype.assemblePositionDefinition = function (line) {
  var parts = line.split(' ');
  if (parts.length != 2 || isNaN(parts[1])) {
    throw new Error('Wrong data definition: ' + line + ' (line: ' + this.currentLineNumber + ').');
  }
  var position = parseInt(parts[1]);
  this.assembledData.seek(position);
};

Assembler.prototype.assembleDefine = function (line) {
  var parts = line.split(' ');
  if (parts.length != 3 || !(isNaN(parts[1])) || isNaN(parts[2])) {
    throw new Error('Wrong define usage: ' + line + ' (line: ' + this.currentLineNumber + ').');
  }
  this.defineTable[parts[1]] = parseInt(parts[2]);
};

Assembler.prototype.replaceSymbols = function () {
  var piece = null;
  var assembledDataContent = this.assembledData.content();
  for (var i = 0; i < assembledDataContent.length; i++) {
    piece = assembledDataContent[i];
    if (this.isItASymbol(piece)) {
      var symbolAddress = this.symbolTable[piece];
      if (symbolAddress == undefined) {
        throw new Error('Reference to undefined symbol: ' + piece + ' (line: ' + this.currentLineNumber + ').');
        return;
      }
      assembledDataContent[i] = symbolAddress;
    }
  }
};

Assembler.prototype.addNopInstructionOnGaps = function () {
  var assembledDataContent = this.assembledData.content();
  for (var i = 0; i < assembledDataContent.length; i++) {
    if (assembledDataContent[i] == undefined) {
      assembledDataContent[i] = 0;
    }
  }
};

Assembler.prototype.addSymbolToTable = function (symbol) {
  var symbol = symbol.split(' ')[0];
  var currentAddress = this.assembledData.content().length;
  this.symbolTable[symbol] = currentAddress;
};

Assembler.prototype.addDataDefinition = function () {
  for (var i = 0; i < this.dataDefinition.length; i++) {
    this.assembledData.content()[this.dataDefinition[i].address] = this.dataDefinition[i].data;
  }
};

Assembler.prototype.sanitizeAssembly = function (assembly) {
  var sanitized = assembly.replace(/ +/g, ' ');
  sanitized = jQuery.trim(sanitized);
  return sanitized;
};

Assembler.prototype.isItADataDefinition = function (line) {
  return (line.slice(0, this.dataDefinitionIndicator.length) == this.dataDefinitionIndicator);
};

Assembler.prototype.isItADefine = function (line) {
  return (line.slice(0, this.defineIndicator.length) == this.defineIndicator);
};

Assembler.prototype.isItAPositionDefinition = function (line) {
  return (line.slice(0, this.positionDefinitionIndicator.length) == this.positionDefinitionIndicator);
};

Assembler.prototype.isItAComment = function (line) {
  return (line[0] == this.commentIndicator);
};

Assembler.prototype.isItASymbol = function (line) {
  return (line[0] == this.symbolIndicator);
};

Assembler.prototype.isTheLineEmpty = function (line) {
  return (line.length == 0);
};

Assembler.prototype.init = function () {
  this.assembledData = new SeekableArray();
  this.symbolTable = {};
  this.dataDefinition = new Array();
  this.defineTable = new Array();
  this.mnemonicPositions = [];
};

Assembler.prototype.getAssembledData = function () {
  return this.assembledData.content();
};

Assembler.prototype.getMnemonicPositions = function () {
  return this.mnemonicPositions;
};

Assembler.prototype.getMnemonics = function () {
  return this.mnemonics;
};

Assembler.prototype.getOpcodes = function () {
  return this.opcodes;
};

Assembler.prototype.getMnemonicFromOpcode = function (opcode) {
  var opcodeIndex = this.opcodes.indexOf(opcode);
  if (opcodeIndex > -1) {
    return this.mnemonics[opcodeIndex];
  }
  return -1;
};

Assembler.prototype.tryGetFromDefine = function (def) {
  return this.defineTable[def];
};

Assembler.prototype.getOpcodeFromMnemonic = function (mnemonic) {
  var mnemonicIndex = this.mnemonics.indexOf(mnemonic);
  if (mnemonicIndex > -1) {
    return this.opcodes[mnemonicIndex];
  }
  return -1;
};

Assembler.prototype.getInstructionHasParam = function (mnemonic) {
  for (var i in Instruction.nameMap) {
    if (Instruction.nameMap[i] == mnemonic) {
      return Instruction.hasParam[i];
    }
  }
  return false;
};
