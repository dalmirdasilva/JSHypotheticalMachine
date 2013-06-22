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
 * CpuView object
 */
var CpuView = {
    
    cache: {
        ac: null, 
        pc: null, 
        z: null, 
        n: null, 
        sleeping: null, 
        powered: null
    },
    
    init: function() {
        var self = this;
        var listener = new UIEventListener(function() {
            self.repaint();
        });
        UI.addEventListener(UI.EVENT.ON_REPAINT, listener);
        self.initConponents();
    },
    
    repaint: function() {
        var self = this;
        Simulator.getInstance().exchangeMessage(new Message(Message.TYPE.GET_CPU_INFORMATION), function(message) {
            var information = message.getContent();
            self.updateCpuFlags(information["flags"]);
            self.updateCpuPc(information["pc"]);
            self.updateCpuAc(information["ac"]);
            self.updateButtons(information["sleeping"], information["powered"]);
        });
    },
    
    updateCpuFlags: function(flags) {
        if (this.cache.z != flags["z"]) {
            this.cache.z = flags["z"];
            this.ELEMENT.zBox.text(this.cache.z ? "1" : "0");
        }
        if (this.cache.n != flags["n"]) {
            this.cache.n = flags["n"];
            this.ELEMENT.nBox.text(this.cache.n ? "1" : "0");
        }
    },
    
    updateCpuPc: function(pc) {
        this.ELEMENT.pcBox.text(Converter.toString(pc));
    },
    
    updateCpuAc: function(ac) {
        this.ELEMENT.acBox.text(Converter.toString(ac));
    },
    
    updateButtons: function(sleeping, powered) {
    },
    
    initConponents: function() {
        var self = this;
        $(".cpu-button").buttonset();
        this.ELEMENT.cpuResetButton.button().click(function() {
            Simulator.getInstance().exchangeMessage(
                new Message(Message.TYPE.RESET_CPU, null),
                function(message) {
                    if (!message.getContent()) {
                        console.log("Could not reset the CPU.");
                    }
                }
            );
        });
        this.ELEMENT.cpuSleepButton.button().click(function() {
            Simulator.getInstance().exchangeMessage(
                new Message(Message.TYPE.SET_CPU_SLEEP, !self.cache.sleeping),
                function(message) {
                    if (message.getContent()) {
                        self.cache.sleeping = !self.cache.sleeping;
                    }
                }
            );
        });
        this.ELEMENT.cpuPowerButton.button({
              icons: {
                primary: "ui-icon-power"
              }
            }).click(function() {
            Simulator.getInstance().exchangeMessage(
                new Message(Message.TYPE.SET_CPU_POWER, !self.cache.powered),
                function(message) {
                    if (message.getType() == Message.TYPE.SET_CPU_POWER) {
                        self.cache.powered = !self.cache.powered;
                    }
                }
            );
        });
    },
    
    ELEMENT: {
        zBox: $("#z-box"),
        nBox: $("#n-box"),
        pcBox: $("#pc-box"),
        acBox: $("#ac-box"),
        cpuResetButton: $("#cpu-reset-button"),
        cpuSleepButton: $("#cpu-sleep-button"),
        cpuPowerButton: $("#cpu-power-button")
    }
};
