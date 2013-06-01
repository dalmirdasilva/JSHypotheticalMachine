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
 * WebWorkerLauncher class
 */ 
function WebWorkerLauncher(path) {
    
    this.messageHandler = null;
    this.worker = null;
    this.launched = false;
    
    this.launch = function(path) {
        if (!this.launched) {
            var self = this;
            this.worker = new Worker(path);
            this.worker.addEventListener("message", function(event) {
                if (self.messageHandler != null && typeof self.messageHandler === "function") {
                    message = Message.newFromHash(event.data)
                    self.messageHandler(message);
                }
            });
            this.launched = true;
        }
    }

    this.exchangeMessage = function(message, responseHandler) {
        if (!this.launched) {
            return false;
        }
        this.messageHandler = responseHandler;
        this.worker.postMessage(message.toHash());
        return true;
    }
    
    if (path != null) {
        this.launch(path);
    }
}
