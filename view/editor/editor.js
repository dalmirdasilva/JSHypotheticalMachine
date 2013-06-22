var EditorView = {
    
    codeMirror: null,
    assembler: null,
    cache: {},
    
    init: function() {
        var self = this;
        this.initConponents();
        this.restoreProgram();
        setTimeout(function() {
            self.codeMirror = CodeMirror.fromTextArea(document.getElementById("editor-code-area"), {
                lineNumbers: true,
                mode: {name: "jshm"}
            });
        }, 100);
    },
    
    initConponents: function() {
        var self = this;
        this.ELEMENT.editorAssembleButton.button().click(function() {
            self.codeMirror.save();
            var code = self.ELEMENT.editorCodeArea.val();
            self.assembler = new Assembler();
            try {
                var data = self.assembler.assemble(code);
                self.showAssembledData(data);
                self.ELEMENT.editorAssembleStatus.text("Successfully assembled.");
            } catch(e) {
                self.ELEMENT.editorAssembleStatus.text(e);
            }
        });
        this.ELEMENT.editorLoadButton.button().click(function() {
            var assembledData = self.assembler.getAssembledData();
            var mem = new Uint8Array(Config.SIMULATOR_MEMORY_SIZE);
            mem.set(assembledData, 0);
            Simulator.getInstance().exchangeMessage(new Message(Message.TYPE.SET_MEMORY_BUFFER, mem), function(message) {
                var status = "";
                if (message.getContent()) {
                    status = "Successfully loaded.";
                } else {
                    status = "Faild to load.";
                }
                self.ELEMENT.editorAssembleStatus.text(status);
            });
        });
        $(document).keydown(function(event) {
            if (!(String.fromCharCode(event.which).toLowerCase() == 's' && event.ctrlKey) && !(event.which == 19)) {
                return true;
            }
            self.saveProgram();
            event.preventDefault();
            return false;
        });
    },
    
    restoreProgram: function() {
        var programText = Storage.getItem("program");
        if (programText != null) {
            this.ELEMENT.editorCodeArea.val(programText);
        }
    },
    
    saveProgram: function() {
        this.codeMirror.save();
        var programText = this.ELEMENT.editorCodeArea.val();
        Storage.setItem("program", programText);
        this.ELEMENT.editorAssembleStatus.text("Program successfully saved.");
    },
    
    showAssembledData: function(data) {
        $(".editor-assempled-area-deletable-entry").remove();
        this.ELEMENT.editorAssempledAreaEntry.hide();
        var mnemonicPositions = this.assembler.getMnemonicPositions();
        var mnemonics = this.assembler.getMnemonics();
        var opcodes = this.assembler.getOpcodes();
        for (var i = 0; i < data.length; i++) {
            var value = data[i] & 0xff;
            var entry = this.ELEMENT.editorAssempledAreaEntry.clone(true, true);
            entry.addClass("editor-assempled-area-deletable-entry");
            var parts = entry.find("td");
            parts.eq(0).html(i.toString(16));
            parts.eq(1).html(Converter.toString(value));
            if (mnemonicPositions.indexOf(i) >= 0) {
                var mnemonic = this.assembler.getMnemonicFromOpcode(value);
                if (this.assembler.getInstructionHasParam(mnemonic)) {
                     mnemonic += " (" + (data[i + 1]).toString(16) + ")";
                }
                parts.eq(2).html(mnemonic);
            }
            this.ELEMENT.editorAssempledAreaEntries.append(entry);
            entry.show();
        }
    },
    
    ELEMENT: {
        editorAssembleButton: $("#editor-assemble-button"),
        editorLoadButton: $("#editor-load-button"),
        editorCodeArea: $("#editor-code-area"),
        editorAssembledArea: $("#editor-assempled-area"),
        editorAssembleStatus: $("#editor-assemble-status"),
        editorAssempledAreaEntries: $("#editor-assempled-area-entries"),
        editorAssempledAreaEntry: $("#editor-assempled-area-entry")
    }
};
