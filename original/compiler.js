/**
 * Neander simulator - A simple simulator for the Neander hypothetical computer in javascript
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
 * Compiler class
 */
 function Compiler() {
  
    this.commentIndicator = '#';
    this.symbolIndicator = ':';
    this.dataDefinitionIndicator = '.data';
    this.opcodes = [0, 16, 32, 48, 64, 80, 96, 128, 144, 160, 240, 241, 242];
    this.mnemonics = ["nop", "sta", "lda", "add", "or", "and", "not", "jmp", "jn", "jz", "hlt", "call", "ret"];
    this.compiledCode;
    this.dataDefinition;
    this.symbolTable;
    
    this.compile = function(assemblyCode) {
        assemblyCode = this.sanitizeAssembly(assemblyCode);
        this.init();
        var lines = assemblyCode.toLowerCase().split("\n");
        for(var i = 0; i < lines.length; i++) {
            this.compileLine(lines[i]);
        }
        this.addDataDefinition();
        this.addNopInstructionOnGaps();
        this.replaceSymbols();
        return this.compiledCode;
    }
    
    this.compileLine = function(line) {
        line = this.sanitizeAssembly(line);
        if(this.isTheLineEmpty(line) || this.isTheLineAComment(line)) {
            return;
        }
        if(this.isTheLineASymbol(line)) {
            this.addSymbolToTable(line);
            return;
        }
        if(this.isTheLineADataDefinition(line)) {
            this.compileDataDefinition(line);
            return;
        }
        var chunks = line.split(" ");
        for(var i = 0; i < chunks.length; i++) {
            this.compileChunk(chunks[i]);
        }
    }
    
    this.compileChunk = function(chunk) {
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
                if(this.isTheLineASymbol(chunk)) {
                    code = chunk;
                } else {
                    throw "Undefined element: " + chunk + ".";
                }
            } else {
                code = parseInt(chunk);
            }
        }
        this.compiledCode.push(code);
    }
    
    this.compileDataDefinition = function(line) {
        var parts = line.split(" ");
        if(parts.length != 3 || isNaN(parts[1]) || isNaN(parts[2]) || parseInt(parts[1]) < 0) {
            throw "Wrong data definition: " + line;
        }
        this.dataDefinition.push({"address": parseInt(parts[1]), "data": parseInt(parts[2])});
    }
    
    this.replaceSymbols = function() {
        var piece = null;
        for(var i = 0; i < this.compiledCode.length; i++) {
            piece = this.compiledCode[i];
            if(this.isTheLineASymbol(piece)) {
                var symbolAddress = this.symbolTable[piece];
                if(symbolAddress == undefined) {
                    throw "Reference to undifined symbol: " + piece;
                    return;
                }
                this.compiledCode[i] = symbolAddress;
            }
        }
    }
    
    this.addNopInstructionOnGaps = function() {
        for(var i = 0; i < this.compiledCode.length; i++) {
            if(this.compiledCode[i] == undefined) {
               this.compiledCode[i] = 0; 
            }
        }
    }
    
    this.addSymbolToTable = function(symbol) {
        symbol = symbol.split(" ")[0];
        var currentAddress = this.compiledCode.length;
        this.symbolTable[symbol] = currentAddress;
    }
    
    this.addDataDefinition = function() {
        for(var i = 0; i < this.dataDefinition.length; i++) {
            this.compiledCode[this.dataDefinition[i].address] = this.dataDefinition[i].data;
        }
    }
    
    this.sanitizeAssembly = function(assembly) {
        var sanitized = assembly.replace(/ +/g, ' ');
        sanitized = jQuery.trim(sanitized);
        return sanitized;
    }
    
    this.isTheLineADataDefinition = function(line) {
        return (line.slice(0, this.dataDefinitionIndicator.length) == this.dataDefinitionIndicator);
    }
    
    this.isTheLineAComment = function(line) {
        return (line[0] == this.commentIndicator);
    }
    
    this.isTheLineASymbol = function(line) {
        return (line[0] == this.symbolIndicator);
    }
    
    this.isTheLineEmpty = function(line) {
        return (line.length == 0);
    }
    
    this.init = function() {
        this.compiledCode = new Array();
        this.symbolTable = {};
        this.dataDefinition = new Array();
    }
}
