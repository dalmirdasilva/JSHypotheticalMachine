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

  init: function () {
    this.initComponents();
  },

  initComponents: function () {
    var self = this;
    this.ELEMENT.resetPositionButton.button().click(function () {
      self.resetPosition();
    });
    this.ELEMENT.decimalBaseSelect.selectmenu({
      select: function (item) {
        var base = $(item.target).val();
        Converter.setBase(parseInt(base));
      }
    });
  },

  resetPosition: function () {
    UI.applyCustomPosition(true);
  },

  ELEMENT: {
    resetPositionButton: $('#settings-reset-position-button'),
    decimalBaseSelect: $('#settings-decimal-base-select'),
    settingsBody: $('#settings-body'),
    settingsHolder: $('#settings-holder')
  }
};
