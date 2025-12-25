
      import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';

// Event Block: When Flag is Clicked
Blockly.Blocks['event_whenflagclicked'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("when 🏁 clicked");
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip("This block starts the script when the green flag is clicked.");
    this.setHelpUrl("");
  }
};

javascriptGenerator['event_whenflagclicked'] = function(block) {
  // This is the entry point, no code needed here as runCode handles it.
  return '';
};


// Motion: Move Steps
Blockly.Blocks['motion_move'] = {
  init: function() {
    this.appendValueInput("STEPS")
        .setCheck("Number")
        .appendField("move");
    this.appendDummyInput()
        .appendField("steps");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Moves the sprite forward");
 this.setHelpUrl("");
  }
};

javascriptGenerator['motion_move'] = function(block: Blockly.Block) {
  var value_steps = javascriptGenerator.valueToCode(block, 'STEPS', javascriptGenerator.ORDER_ATOMIC) || '10';
  return `await move(${value_steps});\n`;
};


// Motion: Turn Right
Blockly.Blocks['motion_turnright'] = {
  init: function() {
    this.appendValueInput("DEGREES")
        .setCheck("Number")
        .appendField("turn ↻");
    this.appendDummyInput()
        .appendField("degrees");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Turns the sprite to the right");
 this.setHelpUrl("");
  }
};

javascriptGenerator['motion_turnright'] = function(block: Blockly.Block) {
  var value_degrees = javascriptGenerator.valueToCode(block, 'DEGREES', javascriptGenerator.ORDER_ATOMIC) || '15';
  return `turn(${value_degrees});\n`;
};

// Looks: Say for X seconds
Blockly.Blocks['looks_sayforsecs'] = {
  init: function() {
    this.appendValueInput("MESSAGE")
        .setCheck("String")
        .appendField("say");
    this.appendValueInput("SECS")
        .setCheck("Number")
        .appendField("for");
    this.appendDummyInput()
        .appendField("seconds");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(270);
    this.setTooltip("Displays a speech bubble for a specified time.");
  }
};

javascriptGenerator['looks_sayforsecs'] = function(block: Blockly.Block) {
  const message = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_ATOMIC) || '""';
  const seconds = javascriptGenerator.valueToCode(block, 'SECS', javascriptGenerator.ORDER_ATOMIC) || '2';
  return `await say(${message}, ${seconds});\n`;
};

// Looks: Say
Blockly.Blocks['looks_say'] = {
  init: function() {
    this.appendValueInput("MESSAGE")
        .setCheck("String")
        .appendField("say");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(270);
    this.setTooltip("Displays a speech bubble.");
  }
};

javascriptGenerator['looks_say'] = function(block: Blockly.Block) {
  const message = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_ATOMIC) || '""';
  return `say(${message});\n`;
};

// Looks: Think for X seconds
Blockly.Blocks['looks_thinkforsecs'] = {
    init: function() {
      this.appendValueInput("MESSAGE").setCheck("String").appendField("think");
      this.appendValueInput("SECS").setCheck("Number").appendField("for");
      this.appendDummyInput().appendField("seconds");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(270);
      this.setTooltip("Displays a thought bubble for a specified time.");
    }
  };
  
  javascriptGenerator['looks_thinkforsecs'] = function(block: Blockly.Block) {
    const message = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_ATOMIC) || '""';
    const seconds = javascriptGenerator.valueToCode(block, 'SECS', javascriptGenerator.ORDER_ATOMIC) || '2';
    return `await think(${message}, ${seconds});\n`;
  };
  
  // Looks: Think
  Blockly.Blocks['looks_think'] = {
    init: function() {
      this.appendValueInput("MESSAGE").setCheck("String").appendField("think");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(270);
      this.setTooltip("Displays a thought bubble.");
    }
  };
  
  javascriptGenerator['looks_think'] = function(block: Blockly.Block) {
    const message = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_ATOMIC) || '""';
    return `think(${message});\n`;
  };
  
  // Looks: Change Size
  Blockly.Blocks['looks_changesizeby'] = {
    init: function() {
      this.appendValueInput("CHANGE").setCheck("Number").appendField("change size by");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(270);
      this.setTooltip("Changes the sprite's size.");
    }
  };
  
  javascriptGenerator['looks_changesizeby'] = function(block: Blockly.Block) {
    const change = javascriptGenerator.valueToCode(block, 'CHANGE', javascriptGenerator.ORDER_ATOMIC) || '10';
    return `changeSizeBy(${change});\n`;
  };
  
  // Looks: Set Size
  Blockly.Blocks['looks_setsizeto'] = {
    init: function() {
      this.appendValueInput("SIZE").setCheck("Number").appendField("set size to");
      this.appendDummyInput().appendField("%");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(270);
      this.setTooltip("Sets the sprite's size to a percentage.");
    }
  };
  
  javascriptGenerator['looks_setsizeto'] = function(block: Blockly.Block) {
    const size = javascriptGenerator.valueToCode(block, 'SIZE', javascriptGenerator.ORDER_ATOMIC) || '100';
    return `setSizeTo(${size});\n`;
  };

  // Looks: Next Costume
  Blockly.Blocks['looks_nextcostume'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("next costume");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(270);
      this.setTooltip("Changes the sprite's costume to the next one in the list.");
      this.setHelpUrl("");
    }
  };

  javascriptGenerator['looks_nextcostume'] = function(block) {
    return 'nextCostume();\n';
  };
  

// Sound: Play Sound Until Done
Blockly.Blocks['sound_sounds_menu'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["meow", "meow"],
          ["pop", "pop"],
          // Add more sounds here
        ]), "SOUND_MENU");
    this.setOutput(true, "String");
    this.setColour(285);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

javascriptGenerator['sound_sounds_menu'] = function(block: Blockly.Block) {
  var dropdown_sound_menu = block.getFieldValue('SOUND_MENU');
  var code = `'${dropdown_sound_menu}'`;
  return [code, javascriptGenerator.ORDER_ATOMIC];
};


Blockly.Blocks['sound_playuntildone'] = {
  init: function() {
    this.appendValueInput("SOUND_MENU")
        .setCheck("String")
        .appendField("play sound");
    this.appendDummyInput()
        .appendField("until done");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(285);
    this.setTooltip("Plays a sound and waits for it to finish.");
    this.setHelpUrl("");
  }
};

javascriptGenerator['sound_playuntildone'] = function(block: Blockly.Block) {
  var value_sound_menu = javascriptGenerator.valueToCode(block, 'SOUND_MENU', javascriptGenerator.ORDER_ATOMIC) || "'meow'";
  return `await playSound(${value_sound_menu});\n`;
};


// Control Blocks
Blockly.Blocks['control_wait'] = {
  init: function() {
    this.appendValueInput("DURATION")
        .setCheck("Number")
        .appendField("wait");
    this.appendDummyInput()
        .appendField("seconds");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
    this.setTooltip("Waits for a specified amount of time.");
    this.setHelpUrl("");
  }
};

javascriptGenerator['control_wait'] = function(block: Blockly.Block) {
  var value_duration = javascriptGenerator.valueToCode(block, 'DURATION', javascriptGenerator.ORDER_ATOMIC) || '1';
  return `await wait(${value_duration});\n`;
};

Blockly.Blocks['control_repeat'] = {
  init: function() {
    this.appendValueInput("TIMES")
        .setCheck("Number")
        .appendField("repeat");
    this.appendStatementInput("SUBSTACK")
        .appendField("times");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
    this.setTooltip("Repeats the blocks inside a number of times.");
    this.setHelpUrl("");
  }
};

javascriptGenerator['control_repeat'] = function(block: Blockly.Block) {
  var repeats = javascriptGenerator.valueToCode(block, 'TIMES', javascriptGenerator.ORDER_ATOMIC) || '10';
  var branch = javascriptGenerator.statementToCode(block, 'SUBSTACK');
  var code = `for (let i = 0; i < ${repeats}; i++) {\n${branch}}\n`;
  return code;
};

Blockly.Blocks['control_forever'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("forever");
    this.appendStatementInput("SUBSTACK")
        .appendField("do");
    this.setPreviousStatement(true, null);
    this.setColour(30);
    this.setTooltip("Repeats the blocks inside forever.");
    this.setHelpUrl("");
  }
};

javascriptGenerator['control_forever'] = function(block: Blockly.Block) {
  var branch = javascriptGenerator.statementToCode(block, 'SUBSTACK');
  return `while (true) {\n${branch} await wait(0.01);\n}\n`; // Small delay to prevent freezing
};

// Sensing
Blockly.Blocks['sensing_touchingmouse'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("touching mouse-pointer?");
      this.setOutput(true, "Boolean");
      this.setColour(180);
      this.setTooltip("");
      this.setHelpUrl("");
    }
  };

  javascriptGenerator['sensing_touchingmouse'] = function(block: Blockly.Block) {
    // TODO: Add an 'input' to this block to choose what is being touched.
    var code = 'isTouching("mouse-pointer")';
    return [code, javascriptGenerator.ORDER_ATOMIC];
  };

// Operators
Blockly.Blocks['operator_random'] = {
    init: function() {
      this.appendValueInput("FROM")
          .setCheck("Number")
          .appendField("pick random");
      this.appendValueInput("TO")
          .setCheck("Number")
          .appendField("to");
      this.setOutput(true, "Number");
      this.setColour(105);
      this.setTooltip("Returns a random number in the specified range.");
      this.setHelpUrl("");
    }
};
  
javascriptGenerator['operator_random'] = function(block: Blockly.Block) {
    var value_from = javascriptGenerator.valueToCode(block, 'FROM', javascriptGenerator.ORDER_ATOMIC) || '1';
    var value_to = javascriptGenerator.valueToCode(block, 'TO', javascriptGenerator.ORDER_ATOMIC) || '10';
    var code = `getRandom(${value_from}, ${value_to})`;
    return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};

// Pen
Blockly.Blocks['pen_clear'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("erase all");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(135);
      this.setTooltip("Clears all drawings from the stage.");
      this.setHelpUrl("");
    }
  };
  
  javascriptGenerator['pen_clear'] = function(block: Blockly.Block) {
    return 'penClear();\n';
  };
  
  Blockly.Blocks['pen_stamp'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("stamp");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(135);
      this.setTooltip("Leaves a stamp of the sprite on the stage.");
      this.setHelpUrl("");
    }
  };
  
  javascriptGenerator['pen_stamp'] = function(block: Blockly.Block) {
    return '// Stamp functionality not yet implemented\n'; 
  };
  
  Blockly.Blocks['pen_penDown'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("pen down");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(135);
      this.setTooltip("Puts the sprite's pen down, so it will draw as it moves.");
      this.setHelpUrl("");
    }
  };
  
  javascriptGenerator['pen_penDown'] = function(block: Blockly.Block) {
    return 'setPen(true);\n';
  };
  
  Blockly.Blocks['pen_penUp'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("pen up");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(135);
      this.setTooltip("Pulls the sprite's pen up, so it will not draw as it moves.");
      this.setHelpUrl("");
    }
  };
  
  javascriptGenerator['pen_penUp'] = function(block: Blockly.Block) {
    return 'setPen(false);\n';
  };
  
  Blockly.Blocks['pen_setPenColorToColor'] = {
    init: function() {
      this.appendValueInput("COLOR")
          .setCheck("Colour")
          .appendField("set pen color to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(135);
      this.setTooltip("Sets the pen color.");
      this.setHelpUrl("");
    }
  };
  
  javascriptGenerator['pen_setPenColorToColor'] = function(block: Blockly.Block) {
    var value_color = javascriptGenerator.valueToCode(block, 'COLOR', javascriptGenerator.ORDER_ATOMIC) || "'#000000'";
    return `setPenColor(${value_color});\n`;
  };
  
  Blockly.Blocks['pen_changePenSizeBy'] = {
    init: function() {
      this.appendValueInput("SIZE")
          .setCheck("Number")
          .appendField("change pen size by");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(135);
      this.setTooltip("Changes the pen size by a certain amount.");
      this.setHelpUrl("");
    }
  };
  
  javascriptGenerator['pen_changePenSizeBy'] = function(block: Blockly.Block) {
    var value_size = javascriptGenerator.valueToCode(block, 'SIZE', javascriptGenerator.ORDER_ATOMIC) || '1';
    return '// pen_changePenSizeBy not yet implemented\n'; 
  };
  
  Blockly.Blocks['pen_setPenSizeTo'] = {
    init: function() {
      this.appendValueInput("SIZE")
          .setCheck("Number")
          .appendField("set pen size to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(135);
      this.setTooltip("Sets the pen size.");
      this.setHelpUrl("");
    }
  };
  
  javascriptGenerator['pen_setPenSizeTo'] = function(block: Blockly.Block) {
    var value_size = javascriptGenerator.valueToCode(block, 'SIZE', javascriptGenerator.ORDER_ATOMIC) || '1';
    return '// pen_setPenSizeTo not yet implemented\n';
  };

    