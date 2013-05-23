/**
 * JS Hypothetical Machine
 * 
 * Copyright (C) 2011  Dalmir da Silva <dalmirdasilva@gmail.com>
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
 * UI class
 */
function UI(cpu) {
    
    this.cpu = cpu;
    this.cpuPowered;
    this._interval;
    
    this.init = function() {
        var ui = this;
        ui.createMemoryGrid();
        ui.createStackGrid();
        $("#save-memory-button").click(function() {
            ui.saveMemory();
        });
        $("#erase-memory-button").click(function() {
            ui.eraseMemory();
        });
        $("#assemble-button").click(function() {
            ui.assemble();
        });
        $("#load-assembled-button").click(function() {
            ui.loadAssembled();
        });
        $("#clock-tick-button").click(function() {
            ui.clockTick();
        });
        $("#reset-button").click(function() {
            ui.reset();
        });
        $("#base-selector-dropbox").change(function() {
            ui.setBase();
        });
        $("input").change(function() {
            ui.saveMemory();
        });
        $("#power-button").click(function() {
            ui.powerClick();
        });
        $("#sleep-button").click(function() {
            ui.sleepClick();
        });
        this.update();
    }
    
    this.powerClick = function() {
        if(this.cpuPowered) {
            this.cpuPowered = false;
            ui.powerCpuOff();
        } else {
            this.cpuPowered = true;
            ui.powerCpuOn();
        }
        this.update();
    }
    
    this.sleepClick = function() {
        if(cpu.isSleeping()) {
            cpu.awake();
        } else {
            cpu.sleep();
        }
        this.update();
    }
    
    this.powerCpuOn = function() {
        var self = this;
        cpu.powerOn();
        this._interval = setInterval(function() {
            self.update();
        }, 1000 / cpu.getClockFrequency());
    }
    
    this.powerCpuOff = function() {
        cpu.powerOff();
        clearInterval(this._interval);
    }
    
    this.clockTick = function() {
        cpu.clockTick();
        this.update();
    }
    
    this.reset = function() {
        cpu.reset();
        this.update();
    }
    
    this.update = function() {
        this.updateMemoryGrid();
        this.updateStackGrid();
        this.updateCpuInfo();
        this.updateFlags();
        this.updateMemoryAccess();
        this.updateButtons();
        this.updateExecutionPosition();
        this.updateTopOfStackPosition();
        this.updateMemoryHolderScroll();
    }
    
    this.updateButtons = function() {
        var powerButton = $("#power-button");
        var sleepButton = $("#sleep-button");
        if(this.cpuPowered) {
            if(powerButton.text() == "Power on") {
                powerButton.text("Power off");
            }
            $("#clock-frequency").attr("disabled", "disabled");
        } else {
            powerButton.text("Power on");
            $("#clock-frequency").removeAttr("disabled");
        }
        if(cpu.isSleeping()) {
            if(sleepButton.text() == "Sleep") {
                sleepButton.text("Awake");
            }
            $("#clock-tick-button").attr("disabled", "disabled");
        } else {
            if(sleepButton.text() == "Awake") {
                sleepButton.text("Sleep");
            }
            $("#clock-tick-button").removeAttr("disabled");
        }
    }
    
    this.updateExecutionPosition = function() {
        $(".memory-reg-position").html("");
        $("#memory-reg-position-" + cpu.getPc()).html("&gt;");
    }
    
    this.updateTopOfStackPosition = function() {
        $(".stack-reg-position").html("");
        $("#stack-reg-position-" + cpu.getStack().getTop()).html("&gt;");
    }
    
    this.updateMemoryHolderScroll = function() {
        var firstMemoryPosition = $("#memory-reg-position-0");
        var secondMemoryPosition = $("#memory-reg-position-1");
        var memoryPositionHeight = secondMemoryPosition.offset().top - firstMemoryPosition.offset().top;
        var memoryHolderScrollTop = $("#memory-grid-holder").scrollTop();
        var memoryHolderHeight = parseInt($("#memory-grid-holder").css("height"));
        if(memoryHolderScrollTop > (cpu.getPc() * memoryPositionHeight) || (cpu.getPc() * memoryPositionHeight) > memoryHolderScrollTop + memoryHolderHeight) {
            $("#memory-grid-holder").scrollTop(cpu.getPc() * memoryPositionHeight);
        }
    }
    
    this.updateMemoryAccess = function() {
        var memoryAccess = cpu.getMemoryAccess();
        $("#memory-read-access").text(converter.toString(memoryAccess.read));
        $("#memory-write-access").text(converter.toString(memoryAccess.write));
        
    }
    
    this.updateMemoryGrid = function() {
        for(var i = 0; i < cpu.getMemory().getSize(); i++) {
            $("#memory-reg-"+i).val(converter.toString(cpu.getMemory().read(i)));
        }
    }
    
    this.updateStackGrid = function() {
        var stack = cpu.getStack();
        for(var i = 0; i < stack.getSize(); i++) {
            $("#stack-reg-"+i).val(converter.toString(stack.read(i)));
        }
    }
    
    this.updateCpuInfo = function() {
        $("#ac-box").val(converter.toString(cpu.getAc()));
        $("#pc-box").val(converter.toString(cpu.getPc()));
    }
    
    this.updateFlags = function() {
        $("#z-box").val(cpu.z ? "1" : "0");
        $("#n-box").val(cpu.n ? "1" : "0");
    }
    
    this.createMemoryGrid = function() {
        var grid = "<table>";
        for(var i = 0; i < cpu.getMemory().getSize(); i++) {
            grid += "<tr>"
                 + "<td class='memory-reg-address'>"+i+": </td>"
                 + "<td id='memory-reg-position-"+i+"' class='memory-reg-position'></td>"
                 + "<td><input type='text' id='memory-reg-"+i+"' class='short-input' value='0' /></td>"
                 + "</tr>";
        }
        grid += "</table>";
        $("#memory-grid-holder").html(grid);
    }
    
    this.createStackGrid = function() {
        var grid = "<table>";
        for(var i = cpu.getStack().getSize() - 1; i >= 0; i--) {
            grid += "<tr>"
                 + "<td class='stack-reg-address'>"+i+": </td>"
                 + "<td id='stack-reg-position-"+i+"' class='stack-reg-position'></td>"
                 + "<td><input type='text' id='stack-reg-"+i+"' class='short-input' value='0' /></td>"
                 + "</tr>";
        }
        grid += "</table>";
        $("#stack-grid-holder").html(grid);
    }
    
    this.assemble = function() {
        var assemblyCode = $("#assembly-code-box").val();
        $("#assembly-code-box-message").text("");
        if(assemblyCode.length == 0) {
            $("#assembly-code-box-message").text("Error: Empty code.");
            return;
        }
        var assembledCode = null;
        try {
            assembledCode = assembler.assemble(assemblyCode);
        } catch(e) {
            $("#assembly-code-box-message").text("Error: " + e);
            throw e;
        }
        var assembledCodeString = "";
        for(var i = 0; i < assembledCode.length; i++) {
            assembledCodeString += converter.toString(assembledCode[i]) + "\n";
        }
        $("#assembled-code-box").val(assembledCodeString);
    }
    
    this.loadAssembled = function() {
        var assembledCode = $("#assembled-code-box").val();
        $("#assembled-code-box-message").text("");
        if(assembledCode.length == 0) {
            $("#assembled-code-box-message").text("Error.");
            return;
        }
        var lines = assembledCode.split("\n");
        for(var i = 0; i < lines.length; i++) {
            cpu.getMemory().write(i, converter.toNumber(lines[i]));
        }
        this.update();
    } 
    
    this.saveMemory = function() {
        for(var i = 0; i < cpu.getMemory().getSize(); i++) {
            cpu.getMemory().write(i, converter.toNumber($("#memory-reg-"+i).val()));
        }
        cpu.setAc(converter.toNumber($("#ac-box").val()));
        cpu.setPc(converter.toNumber($("#pc-box").val()));
        cpu.setClockFrequency(converter.toNumber($("#clock-frequency").val()));
    }
    
    this.eraseMemory = function() {
        cpu.getMemory().erase();
        this.update();
    }
    
    this.eraseStack = function() {
        cpu.getStack().erase();
        this.update();
    }
    
    this.setBase = function() {
        var base = parseInt($("#base-selector-dropbox").val());
        converter.setBase(base);
        this.update();
    }
} 
