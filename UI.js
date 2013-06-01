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
        ui.setBase();
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
        $("input").change(function() {
            ui.saveMemory();
        });
        $("#power-button").click(function() {
            ui.powerClick();
        });
        $("#sleep-button").click(function() {
            ui.sleepClick();
        });
        $("#memory-grid").draggable({
            handle: "#memory-grid-title",
            stack: ".draggable-item"
        });
        $("#stack-grid").draggable({
            handle:"#stack-grid-title",
            stack: ".draggable-item"
        });
        $("#memery-cell-edit-input")
            .keyup(function(event) {
                if (event.which == 13) {
                    ui.commitMemoryEdition();
                }
                if (event.which == 27) {
                    ui.dismissMemoryEdition();
                }
            }).blur(function(event){
                ui.dismissMemoryEdition();
            });
        $("#memory-grid-tooltip").draggable({});
        $("#cpu-settings").draggable({
            handle: "#cpu-settings-title",
            stack: ".draggable-item"
        });
        $(".draggable-item").disableSelection();
        $("#base-selector-radio").buttonset()
        $("input[name=radio]:radio").click(function() {
            ui.setBase(parseInt($(this).val()));
        }); 
        $("#cpu-frequency-spinner").spinner({
            min: 1,
            max: 1000,
            step: 1,
            start: 100,
            change: function(event, ui) {
                var value = parseInt($(event.target).spinner("value"));
                $("#cpu-frequency-slider").slider({"value": value});
                cpu.setClockFrequency(value);
            },
            spin: function(event, ui) {
                var value = parseInt($(event.target).spinner("value"));
                $("#cpu-frequency-slider").slider({"value": value});
                cpu.setClockFrequency(value);
            }
        });
        $("#cpu-frequency-slider").slider({
            value: 100,
            min: 1,
            max: 1000,
            step: 1,
            slide: function(event, ui) {
                $("#cpu-frequency-spinner").val(ui.value).trigger("change");
            }
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
        }, 1000 / 30);
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
        if(!cpu.isSleeping()) {
            this.updateButtons();
            this.updateMemoryGrid();
            this.updateStackGrid();
            this.updateCpuInfo();
            this.updateFlags();
            this.updateMemoryAccess();
            this.updateExecutionPosition();
            this.updateTopOfStackPosition();
            
        }
    }
    
    this.updateButtons = function() {
        var powerButton = $("#power-button");
        var sleepButton = $("#sleep-button");
        if(this.cpuPowered) {
            if(powerButton.text() == "Power on") {
                powerButton.text("Power off");
            }
        } else {
            powerButton.text("Power on");
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
    
    this.isEditingMemoryCell = function() {
        return $("#memery-cell-edit-input").attr("editing") == "true";
    }
    
    this.setEditingMemoryCell = function(is) {
        $("#memery-cell-edit-input").attr("editing", is ? "true" : "false");
    }
    
    this.commitMemoryEdition = function() {
        var input = $("#memery-cell-edit-input");
        input.hide();
        this.setEditingMemoryCell(false);
        var memoryPosition = parseInt(input.attr("position"));
        var value = parseInt(input.val(), Converter.getBase());
        cpu.getMemory().write(memoryPosition, value);
        this.update();
    }
    
    this.dismissMemoryEdition = function() {
        $("#memery-cell-edit-input").hide();
    }
    
    this.updateExecutionPosition = function() {
        $(".memery-cell-center").removeClass("memery-cell-current");
        $("#memory-reg-" + cpu.getPc()).addClass("memery-cell-current");
    }
    
    this.updateTopOfStackPosition = function() {
        var tos = cpu.getStack().getTop();
        for (var i = 0; i < cpu.getStack().getSize(); i++) {
            var stackReg = $("#stack-reg-" +  i);
            stackReg.removeClass("stack-cell-used")
                .removeClass("stack-cell-empty")
                .removeClass("stack-cell-current");
            if (i == tos) {
                stackReg.addClass("stack-cell-current");
            } else if(i < tos) {
                stackReg.addClass("stack-cell-used");
            } else {
                stackReg.addClass("stack-cell-empty");
            }
        }
    }
    
    this.updateMemoryAccess = function() {
        var memoryAccess = cpu.getMemory().getAccess();
        $("#memory-read-access").text(Converter.toString(memoryAccess.read));
        $("#memory-write-access").text(Converter.toString(memoryAccess.write));
        
    }
    
    this.updateMemoryGrid = function() {
        for(var i = 0; i < cpu.getMemory().getSize(); i++) {
            $("#memory-reg-"+i).text(Converter.toString(cpu.getMemory().read(i), 2));
        }
    }
    
    this.updateStackGrid = function() {
        var stack = cpu.getStack();
        for(var i = 0; i < stack.getSize(); i++) {
            $("#stack-reg-" + i).text(Converter.toString(stack.read(i), 2));
        }
    }
    
    this.updateCpuInfo = function() {
        $("#ac-box").val(Converter.toString(cpu.getAc()));
        $("#pc-box").val(Converter.toString(cpu.getPc()));
    }
    
    this.updateFlags = function() {
        $("#z-box").val(cpu.z ? "1" : "0");
        $("#n-box").val(cpu.n ? "1" : "0");
    }
    
    this.createMemoryGrid = function() {
        var table = $("<table border='0' cellspacing='0' cellpadding='2'></table>");        
        var rows = cpu.getMemory().getSize() / 16;
        for (var y = -1; y < rows; y++) {
            var tr = $("<tr></tr>");
            for (var x = -1; x < 16; x++) {
                var td = $("<td></td>");
                if (y < 0) {
                    if (x < 0) {
                        td.html("").addClass("memery-cell-corner");
                    } else {
                        td.html("_" + x.toString(16).toUpperCase()).addClass("memery-cell-top");
                    }
                } else {
                    if (x < 0) {
                        td.html(y.toString(16).toUpperCase() + "_").addClass("memery-cell-side");
                    } else {
                        var address = y * 16 + x;
                        var cellId = "memory-reg-" + address;
                        td.html("")
                            .addClass("memery-cell-center")
                            .attr("id", cellId)
                            .attr("position", address)
                            .addClass("memery-cell")
                            .click({id: "#" + cellId + ""}, function(event) {
                                var self = $(this);
                                var target = $(event.data.id);
                                $("#memery-cell-edit-input")
                                    .show()
                                    .val(self.text())
                                    .attr("editing", "true")
                                    .attr("position", self.attr("position"))
                                    .offset(target.offset())
                                    .width(target.innerWidth()-4)
                                    .focus()
                                    .select();
                            });
                    }
                }
                tr.append(td);
            }
            table.append(tr);
        }
        table.appendTo("#memory-grid-body");
    }
    
    this.createStackGrid = function() {
        var table = $("<table border='0' cellspacing='0' cellpadding='2' width='100%'></table>");        
        var stackSize = cpu.getStack().getSize();
        var tr = $("<tr>s</tr>");
        var positionTd = $("<td></td>");
        var valueTd = $("<td>&nbsp;</td>");
            valueTd.addClass("stack-cell-side");
            tr.append(positionTd);
            tr.append(valueTd);
            table.append(tr);
        for (var i = stackSize - 1; i >= 0; i--) {
            tr = $("<tr></tr>");
            positionTd = $("<td>" + i.toString(16).toUpperCase() + "</td>");
            positionTd.addClass("stack-cell-side");
            valueTd = $("<td>00</td>");
            var stackCellId = "stack-reg-" + i;
            valueTd.attr("id", stackCellId)
                .attr("position", i)
                .addClass("stack-cell");
            tr.append(positionTd);
            tr.append(valueTd);
            table.append(tr);
        }
        table.appendTo("#stack-grid-body");
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
            assembledCodeString += Converter.toString(assembledCode[i]) + "\n";
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
            cpu.getMemory().write(i, Converter.toNumber(lines[i]));
        }
        this.update();
    } 
    
    this.saveMemory = function() {
        for(var i = 0; i < cpu.getMemory().getSize(); i++) {
            var value = Converter.toNumber($("#memory-reg-"+i).text());
            cpu.getMemory().write(i, value);
        }
        cpu.setAc(Converter.toNumber($("#ac-box").val()));
        cpu.setPc(Converter.toNumber($("#pc-box").val()));
        cpu.setClockFrequency(Converter.toNumber($("#cpu-frequency-spinner").val()));
    }
    
    this.eraseMemory = function() {
        cpu.getMemory().erase();
        this.update();
    }
    
    this.eraseStack = function() {
        cpu.getStack().erase();
        this.update();
    }
    
    this.setBase = function(base) {
        Converter.setBase(base);
        this.update();
    }
} 
