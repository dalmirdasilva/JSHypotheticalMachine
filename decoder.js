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
 * Decoder class
 */
function Decoder() {
    this.decode = function(opcode) {
        switch(opcode) {
            case 0:
                return new Nop();
                break;
            case 16:
                return new Sta();
                break;
            case 32:
                return new Lda();
                break;
            case 48:
                return new Add();
                break;
            case 64:
                return new Or();
                break;
            case 80:
                return new And();
                break;
            case 96:
                return new Not();
                break;
            case 128:
                return new Jmp();
                break;
            case 144:
                return new Jn();
                break;
            case 160:
                return new Jz();
                break;
            case 240:
                return new Hlt();
                break;
            case 241:
                return new Call();
                break;
            case 242:
                return new Ret();
                break;
            default:
                return new Nop();
        }
    }
}
