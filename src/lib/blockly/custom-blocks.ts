
'use client';

import * as Blockly from 'blockly';

// Define the "Move 10 Steps" Block
Blockly.Blocks['motion_move'] = {
  init: function(this: Blockly.Block) {
    this.appendValueInput("STEPS")
        .setCheck("Number")
        .appendField("move");
    this.appendField("steps");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230); // Motion Blue
    this.setTooltip("");
  }
};

// Define a "Speak" Block (TTS)
Blockly.Blocks['speech_speak'] = {
  init: function(this: Blockly.Block) {
    this.appendValueInput("TEXT")
        .setCheck("String")
        .appendField("speak");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160); // Speech Purple
  }
};

const javascriptGenerator = Blockly.getGenerator('javascript');

javascriptGenerator.forBlock['motion_move'] = function(block) {
  const steps = javascriptGenerator.valueToCode(block, 'STEPS', javascriptGenerator.ORDER_ATOMIC) || '0';
  // We use a global 'sprite' object provided to the p5 context
  return `sprite.move(${steps});\n`;
};

javascriptGenerator.forBlock['speech_speak'] = function(block) {
  const text = javascriptGenerator.valueToCode(block, 'TEXT', javascriptGenerator.ORDER_ATOMIC) || "''";
  return `speakText(${text});\n`;
};
