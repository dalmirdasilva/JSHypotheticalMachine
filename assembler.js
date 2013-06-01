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
 
 function SeekableArray() {
    
    this.pos = 0;
    this.buf = new Array();
    
    this.push = function(b) {
        if (this.pos >= this.buf.length) {
            this.buf.push(b);
        } else {
            this.buf[this.pos] = b;
        }
        this.pos++;
    }
    
    this.pop = function() {
        if (this.pos <= 0) {
            throw "SeekableStack underflow.";
        }
        return this.buf[--this.pos];
    }
    
    this.seek = function(position) {
        if (position > this.buf.length) {
            var count = position - this.buf.length;
            while (count-- != 0) {
                this.buf.push(0);
            }
        }
        this.pos = position;
    }

    this.content = function() {
        return this.buf;
    }
 }
 
/**
 * Assembler class
 */
 function Assembler() {
  
    this.commentIndicator = '#';
    this.symbolIndicator = ':';
    this.dataDefinitionIndicator = ".data";
    this.positionDefinitionIndicator = "_at"
    this.opcodes = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0xff];
    this.mnemonics = ["nop", "sta", "lda", "add", "or", "and", "not", "jmp", "jn", "jz", "call", "ret", "push", "pop", "hlt"];
    this.assembledCode;
    this.dataDefinition;
    this.symbolTable;
    this.currentLineNumber;
    
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
        return this.assembledCode.content();
    }
    
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
    }
    
    this.assembleChunk = function(chunk) {
        chunk = this.sanitizeAssembly(chunk);
        if(chunk.length == 0) {
            return;
        }
        var code = null;
        var mnemonicIndex = this.mnemonics.indexOf(chunk);
        if(mnemonicIndex != -1) {
            code = this.opcodes[mnemonicIndex];
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
        this.assembledCode.push(code);
    }
    
    this.assembleDataDefinition = function(line) {
        var parts = line.split(" ");
        if(parts.length != 3 || isNaN(parts[1]) || isNaN(parts[2]) || parseInt(parts[1]) < 0) {
            throw "Wrong data definition: " + line + " (line: " + this.currentLineNumber + ").";
        }
        this.dataDefinition.push({"address": parseInt(parts[1]), "data": parseInt(parts[2])});
    }
    
    this.assemblePositionDefinition = function(line) {
        var parts = line.split(" ");
        if(parts.length != 2 || isNaN(parts[1])) {
            throw "Wrong data definition: " + line + " (line: " + this.currentLineNumber + ").";
        }
        var position = parseInt(parts[1]);
        this.assembledCode.seek(position);
    }
    
    this.replaceSymbols = function() {
        var piece = null;
        var assembledCodeContent = this.assembledCode.content();
        for(var i = 0; i < assembledCodeContent.length; i++) {
            piece = assembledCodeContent[i];
            if(this.isItASymbol(piece)) {
                var symbolAddress = this.symbolTable[piece];
                if(symbolAddress == undefined) {
                    throw "Reference to undifined symbol: " + piece + " (line: " + this.currentLineNumber + ").";
                    return;
                }
                assembledCodeContent[i] = symbolAddress;
            }
        }
    }
    
    this.addNopInstructionOnGaps = function() {
        var assembledCodeContent = this.assembledCode.content();
        for(var i = 0; i < assembledCodeContent.length; i++) {
            if(assembledCodeContent[i] == undefined) {
               assembledCodeContent[i] = 0; 
            }
        }
    }
    
    this.addSysmbolToTable = function(symbol) {
        var symbol = symbol.split(" ")[0];
        var currentAddress = this.assembledCode.content().length;
        this.symbolTable[symbol] = currentAddress;
    }
    
    this.addDataDefinition = function() {
        for(var i = 0; i < this.dataDefinition.length; i++) {
            this.assembledCode.content()[this.dataDefinition[i].address] = this.dataDefinition[i].data;
        }
    }
    
    this.sanitizeAssembly = function(assembly) {
        var sanitized = assembly.replace(/ +/g, ' ');
        sanitized = jQuery.trim(sanitized);
        return sanitized;
    }
    
    this.isItADataDefinition = function(line) {
        return (line.slice(0, this.dataDefinitionIndicator.length) == this.dataDefinitionIndicator);
    }
    
    this.isItAPositionDefinition = function(line) {
        return (line.slice(0, this.positionDefinitionIndicator.length) == this.positionDefinitionIndicator);
    }
    
    this.isItAComment = function(line) {
        return (line[0] == this.commentIndicator);
    }
    
    this.isItASymbol = function(line) {
        return (line[0] == this.symbolIndicator);
    }
    
    this.isTheLineEmpty = function(line) {
        return (line.length == 0);
    }
    
    this.init = function() {
        this.assembledCode = new SeekableArray();
        this.symbolTable = {};
        this.dataDefinition = new Array();
    }
}
