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
 * UI class
 */
var UI = {
    
    _interval: null,
    eventListeners: {},
    
    addEventListener: function(event, listener) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(listener);
    },
    
    notifyEvent: function(event) {
        var self = this;
        var listeners = this.eventListeners[event];
        if (listeners) {
            listeners.map(function(listener) {
                listener.notify();
            });
        }
    },
    
    startRefreshing: function() {
        var period = 1000 / Config.UI_REFRESH_FREQUENCY;
        var self = this;
        self._interval = setInterval(function() {
            self.notifyEvent(UI.EVENT.ON_REPAINT);
        }, period);
    },
    
    init: function() {
        var self = this;
        Simulator.getInstance().simulate(Config.MACHINE_FILE);
		GlassOverlay.add();
        FragmentLauncher.launchAll(DEFAULT_FRAGMENTS, function() {
            self.notifyEvent(UI.EVENT.ON_INITIALIZE);
            self.startRefreshing();
            GlassOverlay.remove();
        });
    },
    
    updateDraggableItems: function() {
        $(".draggable-item").draggable({
            handle: ".draggable-handler",
            stack: ".draggable-item"
        });
    },

    EVENT: {
        ON_INITIALIZE: 0x00,
        ON_REPAINT: 0x01
    },

    ELEMENT: {
        glassLayer: $("#glass-layer")
    }
};
