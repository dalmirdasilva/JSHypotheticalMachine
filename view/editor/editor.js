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
 * EditorView object
 */
var EditorView = {

  codeMirror: null,
  assembler: null,
  cache: {},

  init: function () {
    var self = this;
    this.initComponents();
    this.restoreProgram();
    setTimeout(function () {
      self.codeMirror = CodeMirror.fromTextArea(document.getElementById('editor-code-area'), {
        lineNumbers: true,
        mode: {
          name: 'jshm'
        }
      });
    }, 500);
  },

  initComponents: function () {
    var self = this;
    this.ELEMENT.editorAssembleButton.button().click(function () {
      self.codeMirror.save();
      var code = self.ELEMENT.editorCodeArea.val();
      self.assembler = new Assembler();
      try {
        var data = self.assembler.assemble(code);
        self.showAssembledData(data);
        self.ELEMENT.editorAssembleStatus.text('Successfully assembled.');
      } catch (e) {
        self.ELEMENT.editorAssembleStatus.text(e);
      }
    });
    this.ELEMENT.editorLoadButton.button().click(function () {
      if (!self.assembler) {
        self.ELEMENT.editorAssembleStatus.text('No data to load.');
        return;
      }
      var assembledData = self.assembler.getAssembledData();
      var mem = new Uint8Array(Config.SIMULATOR_MEMORY_SIZE);
      mem.set(assembledData, 0);
      Simulator.getInstance().exchangeMessage(new Message(Message.TYPE.SET_MEMORY_BUFFER, mem), function (message) {
        var status = '';
        if (message.getPayload()) {
          status = 'Successfully loaded.';
        } else {
          status = 'Failed to load.';
        }
        self.ELEMENT.editorAssembleStatus.text(status);
      });
    });
    $(document).keydown(function (event) {
      if (!(String.fromCharCode(event.which).toLowerCase() == 's' && event.ctrlKey) && !(event.which == 19)) {
        return true;
      }
      self.saveProgram();
      event.preventDefault();
      return false;
    });
  },

  restoreProgram: function () {
    var uuid = UI.getFragmentUuid(this.ELEMENT.editorHolder);
    var item = Storage.getItem(uuid);
    if (item.programText != null && item.programText != '') {
      this.ELEMENT.editorCodeArea.val(item.programText);
    }
  },

  saveProgram: function () {
    var uuid = UI.getFragmentUuid(this.ELEMENT.editorHolder);
    this.codeMirror.save();
    var programText = this.ELEMENT.editorCodeArea.val();
    var item = Storage.getItem(uuid);
    item.programText = programText;
    Storage.setItem(uuid, item);
    this.ELEMENT.editorAssembleStatus.text('Program successfully saved.');
  },

  showAssembledData: function (data) {
    $('.editor-assembled-area-deletable-entry').remove();
    this.ELEMENT.editorAssembledAreaEntry.hide();
    var mnemonicPositions = this.assembler.getMnemonicPositions();
    for (var i = 0; i < data.length; i++) {
      var value = data[i] & 0xff;
      var entry = this.ELEMENT.editorAssembledAreaEntry.clone(true, true);
      entry.addClass('editor-assembled-area-deletable-entry');
      var parts = entry.find('td');
      parts.eq(0).html(i.toString(16));
      parts.eq(1).html(Converter.toString(value));
      if (mnemonicPositions.indexOf(i) >= 0) {
        var mnemonic = this.assembler.getMnemonicFromOpcode(value);
        if (this.assembler.getInstructionHasParam(mnemonic)) {
          mnemonic += ' (' + (data[i + 1]).toString(16) + ')';
        }
        parts.eq(2).html(mnemonic);
      }
      this.ELEMENT.editorAssembledAreaEntries.append(entry);
      entry.show();
    }
  },

  ELEMENT: {
    editorHolder: $('#editor-holder'),
    editorAssembleButton: $('#editor-assemble-button'),
    editorLoadButton: $('#editor-load-button'),
    editorCodeArea: $('#editor-code-area'),
    editorAssembledArea: $('#editor-assembled-area'),
    editorAssembleStatus: $('#editor-assemble-status'),
    editorAssembledAreaEntries: $('#editor-assembled-area-entries'),
    editorAssembledAreaEntry: $('#editor-assembled-area-entry')
  }
};
