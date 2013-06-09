var StackView = {
    
    cache: new Uint8Array(Config.SIMULATOR_STACK_SIZE),
    lastTos: -1,
    
    init: function() {
        var self = this;
        self.createStackGrid();
        var listener = new UIEventListener(function() {
            self.repaint();
        });
        UI.addEventListener(UI.EVENT.ON_REPAINT, listener);
    },
    
    repaint: function() {
        var self = this;
        Simulator.getInstance().exchangeMessage(new Message(Message.TYPE.GET_TOP_OF_STACK), function(message) {
            var topOfStack = message.getContent();
            self.updateTopOfStack(topOfStack);
        });
        Simulator.getInstance().exchangeMessage(new Message(Message.TYPE.GET_STACK_BUFFER), function(message) {
            var arrayBuffer = message.getContent();
            self.updateStackValues(arrayBuffer);
        });
    },
    
    updateTopOfStack: function(topOfStack) {
        if (topOfStack != this.lastTos) {
            this.lastTos = topOfStack;
            $(".stack-cell").removeClass("stack-cell-current");
            $("#stack-reg-" + topOfStack).addClass("stack-cell-current");
        }
    },
    
    updateStackValues: function(arrayBuffer) {
        var array = new Uint8Array(arrayBuffer);
        for (var i = 0; i < array.length; i++) {
            var byte = array[i];
            if (byte != this.cache[i]) {
                this.cache[i] = byte;
                var text = Converter.toString(byte);
                $("#stack-reg-" + i).text(text);
            }
        }
    },
    
    createStackGrid: function() {
        var table = $("<table border='0' cellspacing='0' cellpadding='1' width='100%'></table>");
        var stackSize = Config.SIMULATOR_STACK_SIZE;
        var tr = $("<tr></tr>");
        var positionTd = $("<td></td>");
        positionTd.addClass("stack-cell-corner");
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
        table.appendTo("#stack-body");
    }
};
