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

importScripts('Config.js');
importScripts('Logger.js');
importScripts('EventNotifier.js');
importScripts('OscillatorEventListener.js');
importScripts('Oscillator.js');
importScripts('Cpu.js');
importScripts('Memory.js');
importScripts('Stack.js');
importScripts('Decoder.js');
importScripts('Instruction.js');
importScripts('MemoryEventListener.js');
importScripts('Message.js');
importScripts('Simulator.js');

var oscillator = new Oscillator(Config.SIMULATOR_OSC_INITIAL_FREQUENCY);
var memory = new Memory(Config.SIMULATOR_MEMORY_SIZE);
var stack = new Stack(Config.SIMULATOR_STACK_SIZE);
var decoder = new Decoder();
var cpu = new Cpu();

cpu.setOscillator(oscillator);
cpu.setMemory(memory);
cpu.setStack(stack);
cpu.setDecoder(decoder);

function processRequest(request) {
  var response = new Message(request.getType(), true);
  try {
    switch (request.getType()) {

      case Message.TYPE.GET_SERIALIZED_CPU:
        response.setPayload(JSON.stringify(cpu));
        break;

      case Message.TYPE.RESET_CPU:
        cpu.reset();
        break;

      case Message.TYPE.GET_CPU_PC:
        response.setPayload(cpu.getPc());
        break;

      case Message.TYPE.GET_CPU_INFORMATION:
        var information = Cpu.packState(cpu);
        response.setPayload(information);
        break;

      case Message.TYPE.SET_CPU_POWER:
        var power = request.getPayload() === true;
        power ? cpu.powerOn() : cpu.powerOff();
        break;

      case Message.TYPE.SET_OSC_FREQUENCY:
        var frequency = parseInt(request.getPayload());
        oscillator.setFrequency(frequency);
        response.setPayload(frequency);
        break;

      case Message.TYPE.SET_OSC_CLOCK:
        var op = request.getPayload();
        switch (op) {
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
        response.setPayload(memory.getBuffer());
        break;

      case Message.TYPE.SET_MEMORY_BUFFER:
        var buffer = request.getPayload();
        memory.setBuffer(buffer);
        break;

      case Message.TYPE.SET_MEMORY_CELL:
        var content = request.getPayload();
        var memoryBuffer = memory.getBuffer();
        memoryBuffer[parseInt(content.address)] = parseInt(content.value);
        break;

      case Message.TYPE.WRITE_MEMORY_CELL:
        var content = request.getPayload();
        memory.write(parseInt(content.address), parseInt(content.value));
        break;

      case Message.TYPE.GET_STACK_BUFFER:
        response.setPayload(stack.getBuffer());
        break;

      case Message.TYPE.SET_STACK_BUFFER:
        var buffer = request.getPayload();
        stack.setBuffer(buffer);
        break;

      case Message.TYPE.GET_TOP_OF_STACK:
        response.setPayload(stack.getTop());
        break;

      case Message.TYPE.ADD_MEMORY_EVENT_LISTENER:
        var channel = request.getChannel();
        var payload = request.getPayload();
        var listener = new MemoryEventListener(payload.begin, payload.end, function (slice) {
          var response = new Message(Message.TYPE.MEMORY_WRITE_EVENT_NOTIFICATION, slice, channel, true);
          self.postMessage(response.toHash());
        });
        memory.addEventListener((payload.event || Memory.EVENT.AFTER_WRITE), listener);
        break;

      case Message.TYPE.GET_MEMORY_ACCESS:
        var access = memory.getAccess();
        response.setPayload(access);
        break;

      case Message.TYPE.SET_CPU_SLEEP:
        var sleep = request.getPayload() === true;
        sleep ? cpu.sleep() : cpu.awake();
        break;

      case Message.TYPE.INTERRUPT_CPU:
        cpu.interrupt();
        break;

      case Message.TYPE.ERASE_MEMORY:
        memory.erase();
        break;
    }
    self.postMessage(response.toHash());
  } catch (e) {
    response.setType(Message.TYPE.EXCEPTION_REPORT);
    response.setPayload(e.message);
    self.postMessage(response.toHash());
  }
}

self.addEventListener(Simulator.EVENT.MESSAGE_RECEIVED, function (event) {
  var request = Message.newFromHash(event.data);
  processRequest(request);
}, false);

oscillator.startClocking();
