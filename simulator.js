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
 
importScripts("oscillator.js");
importScripts("cpu.js");
importScripts("memory.js");
importScripts("stack.js");
importScripts("decoder.js");
importScripts("instructions.js");
importScripts("message.js");

var oscillator = new Oscillator(1000);
var memory = new Memory(256);
var stack = new Stack(16);
var decoder = new Decoder();
var cpu = new Cpu();

cpu.setOscillator(oscillator);
cpu.setMemory(memory);
cpu.setStack(stack);
cpu.setDecoder(decoder);
oscillator.startClocking();
            
function processMessage(message) {
    var response = new Message();
    response.setType(message.getType());
    switch(message.getType()) {
        case Message.SET_CPU_POWER:
            var power = message.getContent() === true;
            (message.getContent() === true) ? cpu.powerOn() : cpu.powerOff();
            response.setContent(power);
        break;
        case Message.SET_OSC_FREQUENCY:
            var frequency = parseInt(message.getContent());
            oscillator.setFrequency(frequency);
            response.setContent(frequency);
        break;
        case Message.GET_SERIALIZED_CPU:
            response.setContent(JSON.stringify(cpu));
        break;
        case Message.GET_MEMEORY_BUFFER:
            response.setContent(memory.getBuffer());
        break;
        case Message.GET_STACK_BUFFER:
            response.setContent(stack.getBuffer());
        break;
    }
    postMessage(response.toHash());
}

addEventListener("message", function(event) {
    message = Message.newFromHash(event.data)
    processMessage(message);
});
