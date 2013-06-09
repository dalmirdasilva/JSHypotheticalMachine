var ConsoleView = {
    
    init: function() {
        var self = this;
        $("#console-holder").draggable({
            handle:"#console-title",
            memory: ".draggable-item"
        });
        $("#console-edit")
    }
};
