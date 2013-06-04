var StackView = {
    
    init: function() {
        var self = this;
        $("#stack-grid").draggable({
            handle:"#stack-grid-title",
            stack: ".draggable-item"
        });
        self.createStackGrid();
        UI.addEventListener(UI.EVENT.ON_REPAINT, function(launcher) {
            self.repaint(launcher);
        };
    },
    
    repaint: function(launcher) {
        var self = this;
        launcher.exchangeMessage(new Message(Message.TYPE.GET_STACK_BUFFER), function(message) {
            var arrayBuffer = message.getContent();
            self.updateStackValues(arrayBuffer);
        });
        launcher.exchangeMessage(new Message(Message.TYPE.GET_TOP_OF_STACK), function(message) {
            var topOfStack = message.getContent();
            self.updateTopOfStack(topOfStack);
        });
    },
    
    updateTopOfStack: function(topOfStack) {
        $(".stack-cell").removeClass("stack-cell-current");
        $("#stack-reg-" + topOfStack).addClass("stack-cell-current");
    },
    
    updateStackValues: function(arrayBuffer) {
        var dv = new DataView(arrayBuffer);
        for (var i = 0; i < arrayBuffer.byteLength; i++) {
            var byte = dv.readInt8(i);
            var text = Converter.toString(byte);
            $("#stack-reg-" + i).text(text);
        }
    },
    
    createStackGrid: function() {
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
}
