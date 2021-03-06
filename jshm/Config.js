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
 * Config class
 */
var Config = {
  SIMULATOR_OSC_MAX_FREQUENCY: 150,
  SIMULATOR_OSC_INITIAL_FREQUENCY: 30,
  SIMULATOR_CPU_PRESCALLER: 1,
  SIMULATOR_MEMORY_SIZE: 256,
  SIMULATOR_MEMORY_ADDRESS_MASK: 0xff,
  SIMULATOR_STACK_SIZE: 16,
  UI_DEFAULT_RADIX: 16,
  UI_REFRESH_FREQUENCY: 15,
  INTERRUPT_VECTOR: 4,
  MACHINE_FILE: 'jshm/Machine.js',
  DEVICES : {
    NOKIA_5110: {
      MAP_ADDRESS: {
        FIRST: 0xeb,
        LAST: 0xec
      }
    },
    SEVEN_SEGMENTS: {
      MAP_ADDRESS: {
        FIRST: 0xeb,
        LAST: 0xed
      }
    }
  }
};
