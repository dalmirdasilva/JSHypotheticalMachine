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
function Assembler() {
  
    this.commentIndicator = '#';
    this.symbolIndicator = ':';
    this.dataDefinitionIndicator = ".db";
    this.positionDefinitionIndicator = ".at"
    this.opcodes = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0xff];
    this.mnemonics = ["nop", "sta", "lda", "add", "or", "and", "not", "jmp", "jn", "jz", "call", "ret", "push", "pop", "reti", "hlt"];
    this.instructionHasParam = {"nop": false, "sta": true, "lda": true, "add": true, "or": true, "and": true, "not": true, "jmp": true, "jn": true, "jz": true, "call": true, "ret": false, "push": true, "pop": true, "reti": false, "hlt": false};
    this.assembledData;
    this.dataDefinition;
    this.symbolTable;
    this.currentLineNumber;
    this.mnemonicPositions = [];
    
    this.assemble = function(assemblyCode) {
        assemblyCode = this.sanitizeAssembly(assemblyCode);
        this.init();
        var lines = assemblyCode.toLowerCase().split("\n");
        for(var i = 0; i < lines.length; i++) {
            this.currentLineNumber = i + 1;
            this.assembleLine(lines[i]);
        }
        this.addDataDefinition();
        this.addNopInstructionOnGaps();
        this.replaceSymbols();
        return this.assembledData.content();
    };
    
    this.assembleLine = function(line) {
        line = this.sanitizeAssembly(line);
        if(this.isTheLineEmpty(line) || this.isItAComment(line)) {
            return;
        }
        if(this.isItASymbol(line)) {
            this.addSysmbolToTable(line);
            return;
        }
        if(this.isItADataDefinition(line)) {
            this.assembleDataDefinition(line);
            return;
        }
        if(this.isItAPositionDefinition(line)) {
            this.assemblePositionDefinition(line);
            return;
        }
        var chunks = line.split(" ");
        for(var i = 0; i < chunks.length; i++) {
            this.assembleChunk(chunks[i]);
        }
    };
    
    this.assembleChunk = function(chunk) {
        chunk = this.sanitizeAssembly(chunk);
        if(chunk.length == 0) {
            return;
        }
        var code = null;
        if ((code = this.getOpcodeFromMnemonic(chunk)) > -1) {
            this.mnemonicPositions.push(this.assembledData.getPosition());
        } else {
            if(isNaN(chunk)) {
                if(this.isItASymbol(chunk)) {
                    code = chunk;
                } else {
                    throw "Undefined element: " + chunk + " (line: " + this.currentLineNumber + ").";
                }
            } else {
                code = parseInt(chunk);
            }
        }
        this.assembledData.push(code);
    };
    
    this.assembleDataDefinition = function(line) {
        var parts = line.split(" ");
        if(parts.length != 3 || isNaN(parts[1]) || isNaN(parts[2]) || parseInt(parts[1]) < 0) {
            throw "Wrong data definition: " + line + " (line: " + this.currentLineNumber + ").";
        }
        this.dataDefinition.push({"address": parseInt(parts[1]), "data": parseInt(parts[2])});
    };
    
    this.assemblePositionDefinition = function(line) {
        var parts = line.split(" ");
        if(parts.length != 2 || isNaN(parts[1])) {
            throw "Wrong data definition: " + line + " (line: " + this.currentLineNumber + ").";
        }
        var position = parseInt(parts[1]);
        this.assembledData.seek(position);
    };
    
    this.replaceSymbols = function() {
        var piece = null;
        var assembledDataContent = this.assembledData.content();
        for(var i = 0; i < assembledDataContent.length; i++) {
            piece = assembledDataContent[i];
            if(this.isItASymbol(piece)) {
                var symbolAddress = this.symbolTable[piece];
                if(symbolAddress == undefined) {
                    throw "Reference to undifined symbol: " + piece + " (line: " + this.currentLineNumber + ").";
                    return;
                }
                assembledDataContent[i] = symbolAddress;
            }
        }
    };
    
    this.addNopInstructionOnGaps = function() {
        var assembledDataContent = this.assembledData.content();
        for(var i = 0; i < assembledDataContent.length; i++) {
            if(assembledDataContent[i] == undefined) {
               assembledDataContent[i] = 0; 
            }
        }
    };
    
    this.addSysmbolToTable = function(symbol) {
        var symbol = symbol.split(" ")[0];
        var currentAddress = this.assembledData.content().length;
        this.symbolTable[symbol] = currentAddress;
    };
    
    this.addDataDefinition = function() {
        for(var i = 0; i < this.dataDefinition.length; i++) {
            this.assembledData.content()[this.dataDefinition[i].address] = this.dataDefinition[i].data;
        }
    };
    
    this.sanitizeAssembly = function(assembly) {
        var sanitized = assembly.replace(/ +/g, ' ');
        sanitized = jQuery.trim(sanitized);
        return sanitized;
    };
    
    this.isItADataDefinition = function(line) {
        return (line.slice(0, this.dataDefinitionIndicator.length) == this.dataDefinitionIndicator);
    };
    
    this.isItAPositionDefinition = function(line) {
        return (line.slice(0, this.positionDefinitionIndicator.length) == this.positionDefinitionIndicator);
    };
    
    this.isItAComment = function(line) {
        return (line[0] == this.commentIndicator);
    };
    
    this.isItASymbol = function(line) {
        return (line[0] == this.symbolIndicator);
    };
    
    this.isTheLineEmpty = function(line) {
        return (line.length == 0);
    };
    
    this.init = function() {
        this.assembledData = new SeekableArray();
        this.symbolTable = {};
        this.dataDefinition = new Array();
    };
    
    this.getAssembledData = function() {
        return this.assembledData.content();
    };
    
    this.getMnemonicPositions = function() {
        return this.mnemonicPositions;
    };
    
    this.getMnemonics = function() {
        return this.mnemonics;
    };
    
    this.getOpcodes = function() {
        return this.opcodes;
    };
    
    this.getMnemonicFromOpcode = function(opcode) {
        var opcodeIndex = this.opcodes.indexOf(opcode);
        if(opcodeIndex > -1) {
            return this.mnemonics[opcodeIndex];
        }
        return -1;
    };
    
    this.getOpcodeFromMnemonic = function(mnemonic) {
        var mnemonicIndex = this.mnemonics.indexOf(mnemonic);
        if(mnemonicIndex > -1) {
            return this.opcodes[mnemonicIndex];
        }
        return -1;
    };
    
    this.getInstructionHasParam = function(mnemonic) {
        return this.instructionHasParam[mnemonic];
    };
}
