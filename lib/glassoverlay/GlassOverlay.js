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
 * GlassOverlay object
 */
var GlassOverlay = {
    
    overlay: $("<div></div>"),
    counter: 0,
    wasInitilizes: false,
    
    init: function() {
        if (!this.wasInitilizes) {
            this.overlay.hide();
            this.overlay.addClass("glass-overlay");
            $("body").append(this.overlay);
            this.wasInitilizes = true;
        }
    },
    
    add: function() {
        this.init();
        if (this.counter == 0) {
            this.overlay.show();
        }
        this.counter++;
    },
    
    remove: function() {
        this.init();
        this.counter--;
        if (this.counter <= 0) {
            this.overlay.hide();
            this.counter = 0;
        }
    }
};
