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
    availableFragments: [
		"view/memory/memory.html",
		"view/cpu/cpu.html",
		"view/stack/stack.html",
		"view/oscillator/oscillator.html",
		"view/editor/editor.html",
		"device/display/display.html"
    ],
    launchedFragments: 0,
    glassLayerStack: 0,
    
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
    
    init: function() {
        var interval = 1000 / Config.UI_REFRESH_FREQUENCY;
        var self = this;
        self._interval = setInterval(function() {
            self.notifyEvent(UI.EVENT.ON_REPAINT);
        }, interval);
        self.notifyEvent(UI.EVENT.ON_INITIALIZE);
    },
    
    setup: function() {
		var self = this;
        Simulator.getInstance().simulate(Config.MACHINE_FILE);
        self.addGlassLayer();
		self.launchFragments();
		self.waitLoad(function() {
			self.init();
			self.removeGlassLayer();
		});
	},
    
    launchFragments: function() {
		with (this) {
			availableFragments.map(function(fragment) {
				var url = makeUrl(fragment);
				var holder = ELEMENT.holder.clone();
				ELEMENT.fragmentsContainer.append(holder);
				holder.load(url, function() {
					launchedFragments++;
				});
			});
		}
	},
	
	waitLoad: function(onLoaded) {
		with (this) {
			var interval;
			interval = setInterval(function() {
				if (launchedFragments == availableFragments.length) {
					clearInterval(interval);
					if (typeof onLoaded == "function") {
						onLoaded();
					}
				}
			}, 1000);
		}
	},
	
	makeUrl: function(fragment) {
		return fragment;
	},
	
	addGlassLayer: function() {
		if (this.glassLayerStack == 0) {
			this.ELEMENT.glassLayer.show();
		}
		this.glassLayerStack++;
	},
	
	removeGlassLayer: function() {
		this.glassLayerStack--;
		if (this.glassLayerStack <= 0) {
			this.ELEMENT.glassLayer.hide();
			this.glassLayerStack = 0;
		}
	},
    
	EVENT: {
		ON_INITIALIZE: 0x00,
		ON_REPAINT: 0x01
	},
	
	ELEMENT: {
		fragmentsContainer: $("#fragments-container"),
		holder: $("<div></div>"),
		glassLayer: $("#glass-layer")
	}
};

(function($){
    $(document).ready(function(){
		UI.setup();
		var listener = new UIEventListener(function() {
			$(".draggable-item").draggable({
				handle: ".draggable-handler",
				stack: ".draggable-item"
			});
		});
		UI.addEventListener(UI.EVENT.ON_INITIALIZE, listener);
    });
})(jQuery);
