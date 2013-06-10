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
function Decoder() {

    /**
     * Decode table
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
     * 0x0e retfie
     * 
     * 0xff hlt
     */
    this.decode = function(opcode) {
        switch(opcode & 0xff) {
            case 0x00:
                return new Nop();
                break;
            case 0x01:
                return new Sta();
                break;
            case 0x02:
                return new Lda();
                break;
            case 0x03:
                return new Add();
                break;
            case 0x04:
                return new Or();
                break;
            case 0x05:
                return new And();
                break;
            case 0x06:
                return new Not();
                break;
            case 0x07:
                return new Jmp();
                break;
            case 0x08:
                return new Jn();
                break;
            case 0x09:
                return new Jz();
                break;
            case 0x0a:
                return new Call();
                break;
            case 0x0b:
                return new Ret();
                break;
            case 0x0c:
                return new Push();
                break;
            case 0x0d:
                return new Pop();
                break;
            case 0xff:
                return new Hlt();
                break;
            default:
                return new Nop();
        }
    }
}
