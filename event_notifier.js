
var EventNotifier = {
    
    callbacks: new Array(),
    
    _init: function(name) {
        if (!this.callbacks[name]) {
            this.callbacks[name] = new Array();
        }
    },

    notify: function(name) {
        this._init(name);
        for (var i = 0; i < this.callbacks[name].length; i++) {
            var callback = this.callbacks[name][i];
            try {
                callback(arguments);
            } catch (e) {
            }
        }
    },

    attach: function(name, callback) {
        this._init(name);
        if (this.callbacks[name]) {
            this.callbacks[name].push(callback);
        }
    }
}
