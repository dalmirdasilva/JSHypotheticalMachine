/**
 * Neander simulator - A simple simulator for the Neander hypothetical computer in javascript
 *
 * Copyright (C) 2011  Dalmir da Silva <dalmirdasilva@gmail.com>
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
function UI(cpu) {

  this.cpu = cpu;
  this.cpuPowered;
  this.refreshInterval;

  this.init = function () {
    this.createMemoryGrid();
    var ui = this;
    $("#save-memory-button").click(function () {
      ui.saveMemory();
    });
    $("#erase-memory-button").click(function () {
      ui.eraseMemory();
    });
    $("#compile-button").click(function () {
      ui.compile();
    });
    $("#load-compiled-button").click(function () {
      ui.loadCompiled();
    });
    $("#clock-tick-button").click(function () {
      ui.clockTick();
    });
    $("#reset-button").click(function () {
      ui.reset();
    });
    $("#base-selector-dropbox").change(function () {
      ui.setBase();
    });
    $("input").change(function () {
      ui.saveMemory();
    });
    $("#power-button").click(function () {
      ui.powerClick();
    });
    $("#sleep-button").click(function () {
      ui.sleepClick();
    });
    this.update();
  };

  this.powerClick = function () {
    if (this.cpuPowered) {
      this.cpuPowered = false;
      ui.powerCpuOff();
    } else {
      this.cpuPowered = true;
      ui.powerCpuOn();
    }
    this.update();
  };

  this.sleepClick = function () {
    if (cpu.isSleeping()) {
      cpu.awake();
    } else {
      cpu.sleep();
    }
    this.update();
  };

  this.powerCpuOn = function () {
    var self = this;
    cpu.powerOn(cpu);
    this.refreshInterval = setInterval(function () {
      self.update();
    }, 1000 / cpu.getClockFrequency());
  };

  this.powerCpuOff = function () {
    cpu.powerOff();
    clearInterval(this.refreshInterval);
  };

  this.clockTick = function () {
    cpu.clockTick();
    this.update();
  };

  this.reset = function () {
    cpu.reset();
    this.update();
  };

  this.update = function () {
    this.updateMemoryGrid();
    this.updateCpuInfo();
    this.updateFlags();
    this.updateMemoryAccess();
    this.updateButtons();
    this.updateExecutionPosition();
    this.updateMemoryHolderScroll();
  };

  this.updateButtons = function () {
    var powerButton = $("#power-button");
    var sleepButton = $("#sleep-button");
    if (this.cpuPowered) {
      if (powerButton.text() == "Power on") {
        powerButton.text("Power off");
      }
      $("#clock-frequency").attr("disabled", "disabled");
    } else {
      powerButton.text("Power on");
      $("#clock-frequency").removeAttr("disabled");
    }
    if (cpu.isSleeping()) {
      if (sleepButton.text() == "Sleep") {
        sleepButton.text("Awake");
      }
      $("#clock-tick-button").attr("disabled", "disabled");
    } else {
      if (sleepButton.text() == "Awake") {
        sleepButton.text("Sleep");
      }
      $("#clock-tick-button").removeAttr("disabled");
    }
  };

  this.updateExecutionPosition = function () {
    $(".memory-reg-position").html("");
    $("#memory-reg-position-" + cpu.getPc()).html("&gt;");
  };

  this.updateMemoryHolderScroll = function () {
    var firstMemoryPosition = $("#memory-reg-position-0");
    var secondMemoryPosition = $("#memory-reg-position-1");
    var memoryPositionHeight = secondMemoryPosition.offset().top - firstMemoryPosition.offset().top;
    var memoryHolderScrollTop = $("#memory-grid-holder").scrollTop();
    var memoryHolderHeight = parseInt($("#memory-grid-holder").css("height"));
    if (memoryHolderScrollTop > (cpu.getPc() * memoryPositionHeight) || (cpu.getPc() * memoryPositionHeight) > memoryHolderScrollTop + memoryHolderHeight) {
      $("#memory-grid-holder").scrollTop(cpu.getPc() * memoryPositionHeight);
    }
  };

  this.updateMemoryAccess = function () {
    var memoryAccess = cpu.getMemoryAccess();
    $("#memory-read-access").text(converter.toString(memoryAccess.read));
    $("#memory-write-access").text(converter.toString(memoryAccess.write));

  }

  this.updateMemoryGrid = function () {
    for (var i = 0; i < cpu.getMemory().size(); i++) {
      $("#memory-reg-" + i).val(converter.toString(cpu.getMemory().read(i)));
    }
  }

  this.updateCpuInfo = function () {
    $("#ac-box").val(converter.toString(cpu.getAc()));
    $("#pc-box").val(converter.toString(cpu.getPc()));
  }

  this.updateFlags = function () {
    $("#z-box").val(cpu.z ? "1" : "0");
    $("#n-box").val(cpu.n ? "1" : "0");
  }

  this.createMemoryGrid = function () {
    var grid = "<table>";
    for (var i = 0; i < cpu.getMemory().size(); i++) {
      grid += "<tr><td class='memory-reg-address'>" + i + ": </td>"
        + "<td id='memory-reg-position-" + i + "' class='memory-reg-position'></td>"
        + "<td><input type='text' id='memory-reg-" + i + "' value='0' /></td>"
        + "</tr>";
    }
    grid += "</table>";
    $("#memory-grid-holder").html(grid);
  }

  this.compile = function () {
    var assemblyCode = $("#assembly-code-box").val();
    $("#assembly-code-box-message").text("");
    if (assemblyCode.length == 0) {
      $("#assembly-code-box-message").text("Error: Empty code.");
      return;
    }
    try {
      var compiledCode = compiler.compile(assemblyCode);
    } catch (e) {
      $("#assembly-code-box-message").text("Error: " + e);
      return;
    }
    var compiledCodeString = "";
    for (var i = 0; i < compiledCode.length; i++) {
      compiledCodeString += converter.toString(compiledCode[i]) + "\n";
    }
    $("#compiled-code-box").val(compiledCodeString);
  }

  this.loadCompiled = function () {
    var compiledCode = $("#compiled-code-box").val();
    $("#compiled-code-box-message").text("");
    if (compiledCode.length == 0) {
      $("#compiled-code-box-message").text("Error.");
      return;
    }
    var lines = compiledCode.split("\n");
    for (var i = 0; i < lines.length; i++) {
      cpu.getMemory().write(i, converter.toNumber(lines[i]));
    }
    this.update();
  }

  this.saveMemory = function () {
    for (var i = 0; i < cpu.getMemory().size(); i++) {
      cpu.getMemory().write(i, converter.toNumber($("#memory-reg-" + i).val()));
    }
    cpu.setAc(converter.toNumber($("#ac-box").val()));
    cpu.setPc(converter.toNumber($("#pc-box").val()));
    cpu.setClockFrequency(converter.toNumber($("#clock-frequency").val()));
  }

  this.eraseMemory = function () {
    cpu.getMemory().erase();
    this.update();
  }

  this.setBase = function () {
    var base = parseInt($("#base-selector-dropbox").val());
    converter.setBase(base);
    this.update();
  }
} 
