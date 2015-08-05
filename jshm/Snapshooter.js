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
 * Snapshooter object
 */
var Snapshooter = function () {
};

Snapshooter.prototype.saveState = function () {
  this.saveCpuState();
  this.saveMemoryState();
  this.saveStackState();
};

Snapshooter.prototype.restoreState = function () {
  this.restoreCpuState();
  this.restoreMemoryState();
  this.restoreStackState();
};

Snapshooter.prototype.resetState = function () {
  this.resetCpuState();
  this.resetMemoryState();
  this.resetStackState();
};

Snapshooter.prototype.restoreCpuState = function () {
};

Snapshooter.prototype.saveCpuState = function () {
};

Snapshooter.prototype.resetCpuState = function () {
};

Snapshooter.prototype.restoreMemoryState = function () {
};

Snapshooter.prototype.saveMemoryState = function () {
};

Snapshooter.prototype.resetMemoryState = function () {
};

Snapshooter.prototype.restoreStackState = function () {
};

Snapshooter.prototype.saveStackState = function () {
};

Snapshooter.prototype.resetStackState = function () {
};
