var SelectorAccessor = {
    
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
    $("#memory-grid").draggable({
        handle:"#memory-grid-title"
    });
    $("#memery-cell-edit-input").blur(function(event){
        ui.commitMemoryEdition();
    });
    $("#memery-cell-edit-input").keypress(function(event) {
        if (event.which == 13) {
            ui.commitMemoryEdition();
        }
    });
    $("#memory-grid-tooltip").draggable({});
};
