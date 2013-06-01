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
 * Message class
 */
function Message(type, content) {
    
    this.type = type;
    this.content = content;
        
    this.getType = function() {
        return this.type;
    };
    
    this.setType = function(type) {
        this.type = type;
    };
        
    this.getContent = function() {
        return this.content;
    };
    
    this.setContent = function(content) {
        this.content = content;
    };
    
    this.toHash = function() {
        return {"type": this.type, "content": this.content};
    };
    
    this.fromHash = function(hash) {
        this.setType(hash["type"]);
        this.setContent(hash["content"]);
    };
}

Message.newFromHash = function(hash) {
    var message = new Message();
    message.fromHash(hash);
    return message;
}

Message.GET_MEMEORY_BUFFER = 0x00;
Message.GET_STACK_BUFFER = 0x01;
Message.SET_CPU_POWER = 0x02;
Message.GET_SERIALIZED_CPU = 0x03;
Message.SET_OSC_FREQUENCY = 0x04;
