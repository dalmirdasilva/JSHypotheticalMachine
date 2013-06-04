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
function Message(type, content, channel, async) {
    
    this.type = type;
    this.content = content;
    this.channel = channel || 0;
    this.async = async || false;
        
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
        
    this.getChannel = function() {
        return this.channel;
    };
    
    this.setChannel = function(channel) {
        this.channel = channel;
    };
    
    this.setAsync = function(async) {
        this.async = async;
    };
    
    this.isAsync = function() {
        return this.async;
    };
    
    this.toHash = function() {
        return {"type": this.type, "content": this.content, "channel": this.channel};
    };
    
    this.fromHash = function(hash) {
        this.setType(hash["type"]);
        this.setContent(hash["content"]);
        this.setChannel(hash["channel"]);
    };
}

Message.newFromHash = function(hash) {
    var message = new Message();
    message.fromHash(hash);
    return message;
};

Message.TYPE = {
    GET_MEMORY_BUFFER: 0x00,
    SET_MEMORY_BUFFER: 0x01,
    GET_STACK_BUFFER: 0x02,
    SET_STACK_BUFFER: 0x03,
    SET_CPU_POWER: 0x04,
    GET_SERIALIZED_CPU: 0x05,
    SET_OSC_FREQUENCY: 0x06,
    SET_MEMORY_CELL: 0x07,
    ADD_MEMORY_EVENT_LISTENER: 0x08,
    MEMORY_EVENT_NOTIFICATION: 0x09,
    RESET_CPU: 0x0a,
    GET_TOP_OF_STACK: 0x0b
};
