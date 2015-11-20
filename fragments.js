var DEFAULT_FRAGMENTS = [
  {
    uuid: '7a342ca2-e79f-528e-6302-8f901b0b6888',
    url: "view/memory/memory.html",
    callback: function () {
      MemoryView.init();
    }
  }, {
    uuid: '396e0c46-09e4-4b19-97db-bd423774a4b3',
    url: "view/cpu/cpu.html",
    callback: function () {
      CpuView.init();
    }
  }, {
    uuid: '403aa1ab-9f70-44ec-bc08-5d5ac56bd8a5',
    url: "view/stack/stack.html",
    callback: function () {
      StackView.init();
    }
  }, {
    uuid: 'f4d7d31f-fa83-431a-b30c-3e6cc37cc6ee',
    url: "view/oscillator/oscillator.html",
    callback: function () {
      OscillatorView.init();
    }
  }, {
    uuid: '3d7b7a06-0a67-4b67-825c-e5c43ff8c1e8',
    url: "view/editor/editor.html",
    callback: function () {
      EditorView.init();
    }
  }, {
    uuid: '855f997b-4369-4cdb-b7c9-7142ceaf39e8',
    url: "view/settings/settings.html",
    callback: function () {
      SettingsView.init();
    }
  }, {
    uuid: 'b835a5b0-9753-498d-99c3-416582e9662c',
    url: "device/sevensegments/sevensegments.html",
    callback: function () {
      SevenSegmentsView.init();
    }
  }, {
    uuid: '3d7b7a06-498d-498d-99c3-e5c43ff8c1e8',
    url: "device/nokia5110/nokia5110.html",
    callback: function () {
      Nokia5110View.init();
    }
  }
];
