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
 * FragmentLauncher object
 */
var FragmentLauncher = {

  launchAll: function (onFinished) {
    var self = this;
    var remainingFragments = Fragments.size();
    Fragments.forEach(function (fragment) {
      self.launch(fragment, function () {
        remainingFragments--;
        if (remainingFragments <= 0) {
          onFinished();
        }
      });
    });
  },

  launch: function (fragment, onFinished) {
    var self = this;
    var url = self.normalizeUrl(fragment.url);
    var holder = self.ELEMENT.holder.clone().addClass('fragment-holder').attr('uuid', fragment.uuid);
    self.ELEMENT.fragmentsContainer.append(holder);
    holder.load(url, function () {
      fragment.onLoad();
      onFinished();
    });
  },

  normalizeUrl: function (url) {
    return url;
  },

  getFragmentUuidFromChild: function (child) {
    return $(child).closest('.fragment-holder').attr('uuid');
  },

  ELEMENT: {
    fragmentsContainer: $('#fragments-container'),
    holder: $('<div></div>')
  }
};
