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
 
importScripts("Config.js");
importScripts("OscillatorEventListener.js");
importScripts("Oscillator.js");
importScripts("Cpu.js");
importScripts("Memory.js");
importScripts("Stack.js");
importScripts("Decoder.js");
importScripts("Instructions.js");
importScripts("MemoryEventListener.js");
importScripts("Message.js");

var oscillator = new Oscillator(Config.SIMULATOR_OSC_INITIAL_FREQUENCY);
var memory = new Memory(Config.SIMULATOR_MEMORY_SIZE);
var stack = new Stack(Config.SIMULATOR_STACK_SIZE);
var decoder = new Decoder();
var cpu = new Cpu();

cpu.setOscillator(oscillator);
cpu.setMemory(memory);
cpu.setStack(stack);
cpu.setDecoder(decoder);

function processRequest(request, port) {

    var response = new Message(request.getType(), true);

    switch(request.getType()) {
        
        case Message.TYPE.GET_SERIALIZED_CPU:
            response.setContent(JSON.stringify(cpu));
        break;
        
        case Message.TYPE.RESET_CPU:
            cpu.reset();
        break;
        
        case Message.TYPE.GET_CPU_PC:
            response.setContent(cpu.getPc());
        break;
        
        case Message.TYPE.GET_CPU_INFORMATION:
            var information = {"pc": cpu.getPc(), "ac": cpu.getAc(), "flags": cpu.getFlags(), "sleeping": cpu.isSleeping(), "powered": cpu.isPowered()};
            response.setContent(information);
        break;
        
        case Message.TYPE.SET_CPU_POWER:
            var power = request.getContent() === true;
            power ? cpu.powerOn() : cpu.powerOff();
        break;
        
        case Message.TYPE.SET_OSC_FREQUENCY:
            var frequency = parseInt(request.getContent());
            oscillator.setFrequency(frequency);
            response.setContent(frequency);
        break;
        
        case Message.TYPE.SET_OSC_CLOCK:
            var op = request.getContent();
            switch(op) {
                case Oscillator.ACTION.RESUME_CLOCKING:
                    oscillator.startClocking();
                break;
                case Oscillator.ACTION.STOP_CLOCKING:
                    oscillator.stopClocking();
                break;
                case Oscillator.ACTION.CLOCKOUT_NOW:
                    oscillator.clockOut();
                break;
            }
        break;
        
        case Message.TYPE.GET_MEMORY_BUFFER:
            response.setContent(memory.getBuffer());
        break;
        
        case Message.TYPE.SET_MEMORY_BUFFER:
            var buffer = request.getContent();
            memory.setBuffer(buffer);
        break;
        
        case Message.TYPE.SET_MEMORY_CELL:
            var content = request.getContent();
            var address = content["address"];
            var value = content["value"];
            var dataView = new DataView(memory.getBuffer());
            dataView.setUint8(address, value);
        break;
        
        case Message.TYPE.GET_STACK_BUFFER:
            response.setContent(stack.getBuffer());
        break;
        
        case Message.TYPE.SET_STACK_BUFFER:
            var buffer = request.getContent();
            stack.setBuffer(buffer);
        break;
        
        case Message.TYPE.GET_TOP_OF_STACK:
            response.setContent(stack.getTop());
        break;
        
        case Message.TYPE.ADD_MEMORY_EVENT_LISTENER:
            var channel = request.getChannel();
            var content = request.getContent();
            var listener = new MemoryEventListener(content["begin"], content["end"], function(slice) {
                var asyncResponse = new Message(Message.TYPE.MEMORY_WRITE_EVENT_NOTIFICATION, slice, channel, true);
                port.postMessage(asyncResponse.toHash());
            });
            memory.addEventListener(content["event"], listener);
        break;
        
        case Message.TYPE.GET_MEMORY_ACCESS:
            var access = memory.getAccess();
            response.setContent(access);
        break;
        
        case Message.TYPE.SET_CPU_SLEEP:
            var sleep = request.getContent() === true;
            sleep ? cpu.sleep() : cpu.awake();
        break;
    }
    port.postMessage(response.toHash());
}

var connections = 0;
self.addEventListener("connect", function (event) {
	var port = event.ports[0];
    connections++;
	port.addEventListener("message", function (event) {
        request = Message.newFromHash(event.data)
        processRequest(request, port);
	}, false);
	port.start();
}, false);

oscillator.startClocking();