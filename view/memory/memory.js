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
        $(".memory-cell").removeClass("memory-cell-current");
        $("#memory-reg-" + current).addClass("memory-cell-current");
    },
    
    updateMemoryValues: function(arrayBuffer) {
        var array = new Uint8Array(arrayBuffer);
        for (var i = 0; i < array.length; i++) {
            var byte = array[i];
            if (byte != this.cache[i]) {
                this.cache[i] = byte;
                var text = Converter.toString(byte);
                $("#memory-reg-" + i).text(text);
            }
        }
    },
    
    updateMemoryAccess: function(memoryAccess) {
        if (memoryAccess["write"] != this.access["write"]) {
            this.access["write"] = memoryAccess["write"];
            $("#memory-access-write").text(this.access["write"]);
        }
        if (memoryAccess["read"] != this.access["read"]) {
            this.access["read"] = memoryAccess["read"];
            $("#memory-access-read").text(this.access["read"]);
        }
    },
    
    createMemoryGrid: function() {
        var table = $("<table border='0' cellspacing='0' cellpadding='2' width='100%'></table>");        
        var rows = Config.SIMULATOR_MEMORY_SIZE / 16;
        for (var y = -1; y < rows; y++) {
            var tr = $("<tr></tr>");
            for (var x = -1; x < 16; x++) {
                var td = $("<td></td>");
                if (y < 0) {
                    if (x < 0) {
                        td.html("").addClass("memory-cell-corner");
                    } else {
                        td.html("_" + x.toString(16).toUpperCase()).addClass("memory-cell-top");
                    }
                } else {
                    if (x < 0) {
                        td.html(y.toString(16).toUpperCase() + "_").addClass("memory-cell-side");
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
                                $("#memory-cell-edit-input")
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
        table.appendTo("#memory-body");
    }
    
};
