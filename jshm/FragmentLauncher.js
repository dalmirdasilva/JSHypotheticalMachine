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
	
    launchAll: function(fragments, callback) {
        var self = this;
        var fragmentsCounter = fragments.length;
        fragments.map(function(fragment) {
            self.launch(fragment, function() {
                fragmentsCounter--;
            });
        });
        self.waitFor(function() {
            return (fragmentsCounter <= 0);
        }, callback);
    },

    launch: function(fragment, callback) {
        var self = this;
        var url = self.normalizeUrl(fragment.url);
        var holder = self.ELEMENT.holder.clone();
        self.ELEMENT.fragmentsContainer.append(holder);
        holder.load(url, function() {
            fragment.callback();
            callback();
        });
    },

    waitFor: function(check, callback) {
        var interval;
        interval = setInterval(function() {
            if (check()) {
                clearInterval(interval);
                callback();
            }
        }, 1000);
    },

    normalizeUrl: function(url) {
        return url;
    },

    ELEMENT: {
        fragmentsContainer: $("#fragments-container"),
        holder: $("<div></div>")
    }
};
