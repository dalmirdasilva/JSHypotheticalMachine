var DEFAULT_FRAGMENTS = [
	{url: "view/memory/memory.html", callback: function() { MemoryView.init(); }},
	{url: "view/cpu/cpu.html", callback: function() { CpuView.init(); }},
	{url: "view/stack/stack.html", callback: function() { StackView.init(); }},
	{url: "view/oscillator/oscillator.html", callback: function() { OscillatorView.init(); }},
	
    {url: "view/editor/editor.html", callback: function() { EditorView.init(); }},
	{url: "device/display/display.html", callback: function() { DisplayView.init(); }},
	{url: "device/sevensegments/sevensegments.html", callback: function() { SevenSegmentsView.init(); }}
];
