var EditorView = {
    
    codeMirror: null,
    assembler: null,
    cache: {},
    
    init: function() {
        var self = this;
        this.initConponents();
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
                self.ELEMENT.editorAssembleStatus.text("Successfully assembled");
            } catch(e) {
                self.ELEMENT.editorAssembleStatus.text(e);
            }
        });
        this.ELEMENT.editorLoadButton.button().click(function() {
            var assembledData = self.assembler.getAssembledData();
            var mem = new Uint8Array(Config.SIMULATOR_MEMORY_SIZE);
            mem.set(assembledData, 0);
            Simulator.getInstance().exchangeMessage(new Message(Message.TYPE.SET_MEMORY_BUFFER, mem), function(message) {
                console.log(message.getContent())
            });
        });
    },
    
    showAssembledData: function(data) {
        this.ELEMENT.editorAssempledAreaDeletableEntry.remove();
        this.ELEMENT.editorAssempledAreaEntry.hide();
        var mnemonicPositions = this.assembler.getMnemonicPositions();
        var mnemonics = this.assembler.getMnemonics();
        var opcodes = this.assembler.getOpcodes();
        for (var i = 0; i < data.length; i++) {
            var value = data[i] & 0xff;
            var entry = this.ELEMENT.editorAssempledAreaEntry.clone(true, true);
            entry.addClass("editor-assempled-area-deletable-entry");
            var parts = entry.find("td");
            parts.eq(0).html(Converter.toString(i));
            parts.eq(1).html(Converter.toString(value));
            if (mnemonicPositions.indexOf(i) >= 0) {
                var mnemonic = this.assembler.getMnemonicFromOpcode(value);
                if (this.assembler.getInstructionHasParam(mnemonic)) {
                     mnemonic += " (" + Converter.toString(data[i + 1]) + ")";
                }
                parts.eq(2).html(mnemonic)
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
        editorAssempledAreaEntry: $("#editor-assempled-area-entry"),
        editorAssempledAreaDeletableEntry: $(".editor-assempled-area-deletable-entry")
    }
};
