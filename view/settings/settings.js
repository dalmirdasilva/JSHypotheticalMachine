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
 * SettingsView object
 */
var SettingsView = {

  snapshooter: new Snapshooter(Simulator.getInstance()),

  init: function () {
    this.initComponents();
    this.restoreRadix();
  },

  initComponents: function () {
    var self = this;
    this.ELEMENT.resetSavedPositionButton.button().click(function () {
      self.resetSavedPosition();
    });
    this.ELEMENT.radixButtonSet.buttonset().change(function (item) {
      var radix = parseInt($(item.target).attr('radix'));
      Converter.setRadix(radix);
      self.saveRadix(radix);
    });
    this.ELEMENT.snapshotButtonSet.buttonset();
    this.ELEMENT.createSnapshotButton.click(function () {
      self.snapshooter.saveState();
    });
    this.ELEMENT.restoreSnapshotButton.click(function () {
      self.snapshooter.restoreState();
    });
    this.ELEMENT.discardSnapshotButton.click(function () {
      self.snapshooter.discardState();
    });
  },

  resetSavedPosition: function () {
    UI.resetSavedElementPosition();
  },

  getStorageItem: function () {
    return Storage.getItem(FRAGMENTS.SettingsView.uuid);
  },

  setStorageItem: function (item) {
    Storage.setItem(FRAGMENTS.SettingsView.uuid, item);
  },

  saveRadix: function (radix) {
    var item = this.getStorageItem();
    item.radix = radix;
    this.setStorageItem(item);
  },

  restoreRadix: function () {
    var item = this.getStorageItem();
    if (item.radix) {
      Converter.setRadix(item.radix);
      this.ELEMENT.radixButton[item.radix].attr('checked', 'checked').button('refresh');
    }
  },

  ELEMENT: {
    resetSavedPositionButton: $('#settings-reset-saved-position-button'),
    radixButtonSet: $('#settings-radix-button-set'),
    radixButton: {
      2: $('#settings-radix-2'),
      8: $('#settings-radix-8'),
      10: $('#settings-radix-10'),
      16: $('#settings-radix-16')
    },
    snapshotButtonSet: $('#settings-snapshot-button-set'),
    createSnapshotButton: $('#settings-create-snapshot-button'),
    restoreSnapshotButton: $('#settings-restore-snapshot-button'),
    discardSnapshotButton: $('#settings-discard-snapshot-button'),
    settingsBody: $('#settings-body'),
    settingsHolder: $('#settings-holder')
  }
};
