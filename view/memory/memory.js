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
 * MemoryView object
 */
var MemoryView = {
    
    cache: new Uint8Array(Config.SIMULATOR_MEMORY_SIZE),
    access: {"read": 0, "write": 0},
    
    init: function() {
        var self = this;
        self.createMemoryGrid();
        var listener = new UIEventListener(function() {
            self.repaint();
        });
        UI.addEventListener(UI.EVENT.ON_REPAINT, listener);
    },
    
    repaint: function() {
        var self = this;
        Simulator.getInstance().exchangeMessage(new Message(Message.TYPE.GET_CPU_PC), function(message) {
            var pc = message.getContent();
            self.updateCurrentPosition(pc);
        });
        Simulator.getInstance().exchangeMessage(new Message(Message.TYPE.GET_MEMORY_BUFFER), function(message) {
            var arrayBuffer = message.getContent();
            self.updateMemoryValues(arrayBuffer);
        });
        Simulator.getInstance().exchangeMessage(new Message(Message.TYPE.GET_MEMORY_ACCESS), function(message) {
            var memoryAccess = message.getContent();
            self.updateMemoryAccess(memoryAccess);
        });
    },
    
    updateCurrentPosition: function(current) {
        $(".memory-cell-current", this.ELEMENT.memoryHolder).removeClass("memory-cell-current");
        $("#memory-reg-" + current, this.ELEMENT.memoryHolder).addClass("memory-cell-current");
    },
    
    updateMemoryValues: function(arrayBuffer) {
        var array = new Uint8Array(arrayBuffer);
        for (var i = 0; i < array.length; i++) {
            var byte = array[i];
            if (byte != this.cache[i]) {
                this.cache[i] = byte;
                var text = Converter.toString(byte);
                $("#memory-reg-" + i, this.ELEMENT.memoryHolder).text(text);
            }
        }
    },
    
    updateMemoryAccess: function(memoryAccess) {
        if (memoryAccess["write"] != this.access["write"]) {
            this.access["write"] = memoryAccess["write"];
            $("#memory-access-write", this.ELEMENT.memoryHolder).text(this.access["write"]);
        }
        if (memoryAccess["read"] != this.access["read"]) {
            this.access["read"] = memoryAccess["read"];
            $("#memory-access-read", this.ELEMENT.memoryHolder).text(this.access["read"]);
        }
    },
    
    createMemoryGrid: function() {
        var self = this;
        var table = this.ELEMENT.memoryGridTable;
        var rows = Config.SIMULATOR_MEMORY_SIZE / 16;
        for (var y = -1; y < rows; y++) {
            var tr = this.ELEMENT.memoryGridTr.clone();
            for (var x = -1; x < 16; x++) {
                var td = this.ELEMENT.memoryGridTd.clone();
                if (y < 0) {
                    if (x < 0) {
                        td.addClass("memory-cell-corner");
                    } else {
                        td.html(x.toString(16).toUpperCase()).addClass("memory-cell-top");
                    }
                } else {
                    if (x < 0) {
                        td.html(y.toString(16).toUpperCase()).addClass("memory-cell-side");
                    } else {
                        var address = y * 16 + x;
                        var cellId = "memory-reg-" + address;
                        td.html(Converter.toString(0))
                            .addClass("memory-cell-center")
                            .attr("id", cellId)
                            .attr("position", address)
                            .addClass("memory-cell")
                            .click({id: "#" + cellId + ""}, function(event) {
                                var self = $(this);
                                var target = $(event.data.id);
                                self.ELEMENT.memoryCellEditInput
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
        table.appendTo(this.ELEMENT.memoryBody);
    },
    
    ELEMENT: {
        memoryGridTable: $("<table border='0' cellspacing='0' cellpadding='2' width='100%'></table>"),
        memoryGridTr: $("<tr></tr>"),
        memoryGridTd: $("<td></td>"),
        memoryCellEditInput: $("#memory-cell-edit-input"),
        memoryBody: $("#memory-body"),
        memoryHolder: $("#memory-holder")
    }
};
