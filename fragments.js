var FRAGMENTS = {
  MemoryView: {
    uuid: '7a342ca2-e79f-528e-6302-8f901b0b6888',
    url: "view/memory/memory.html",
    onLoad: function () {
      MemoryView.init();
    }
  },

  CpuView: {
    uuid: '396e0c46-09e4-4b19-97db-bd423774a4b3',
    url: "view/cpu/cpu.html",
    onLoad: function () {
      CpuView.init();
    }
  },

  StackView: {
    uuid: '403aa1ab-9f70-44ec-bc08-5d5ac56bd8a5',
    url: "view/stack/stack.html",
    onLoad: function () {
      StackView.init();
    }
  },

  OscillatorView: {
    uuid: 'f4d7d31f-fa83-431a-b30c-3e6cc37cc6ee',
    url: "view/oscillator/oscillator.html",
    onLoad: function () {
      OscillatorView.init();
    }
  },

  EditorView: {
    uuid: '3d7b7a06-0a67-4b67-825c-e5c43ff8c1e8',
    url: "view/editor/editor.html",
    onLoad: function () {
      EditorView.init();
    }
  },
  SettingsView: {
    uuid: '855f997b-4369-4cdb-b7c9-7142ceaf39e8',
    url: "view/settings/settings.html",
    onLoad: function () {
      SettingsView.init();
    }
  },

  SevenSegmentsView: {
    uuid: 'b835a5b0-9753-498d-99c3-416582e9662c',
    url: "device/sevensegments/sevensegments.html",
    onLoad: function () {
      SevenSegmentsView.init();
    }
  },

  Nokia5110View: {
    uuid: '3d7b7a06-498d-498d-99c3-e5c43ff8c1e8',
    url: "device/nokia5110/nokia5110.html",
    onLoad: function () {
      Nokia5110View.init();
    }
  }
};

var Fragments = {
  forEach: function (callback) {
    this.keys().map(function (key) {
      var fragment = FRAGMENTS[key];
      callback(fragment);
    });
  },

  keys: function () {
    return Object.keys(FRAGMENTS);
  },

  size: function () {
    return this.keys().length;
  }
};
