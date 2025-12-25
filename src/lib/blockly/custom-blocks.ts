
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';

export const registerCustomBlocks = () => {
    // Check if blocks are already registered to prevent errors on hot reloads
    if ((Blockly as any).__customBlocksRegistered) {
        return;
    }
    (Blockly as any).__customBlocksRegistered = true;

    const customBlocks = [
        {
          "type": "event_whenflagclicked",
          "message0": "when 🏁 clicked",
          "nextStatement": null,
          "colour": "#FFD500",
          "tooltip": "This block starts the script when the green flag is clicked.",
          "helpUrl": ""
        },
        {
          "type": "motion_move",
          "message0": "move %1 steps",
          "args0": [
            {
              "type": "input_value",
              "name": "STEPS",
              "check": "Number"
            }
          ],
          "previousStatement": null,
          "nextStatement": null,
          "colour": "#4C97FF",
          "tooltip": "Moves the sprite forward in the direction it is facing.",
          "helpUrl": ""
        },
        {
          "type": "motion_turnright",
          "message0": "turn ↻ %1 degrees",
          "args0": [
            {
              "type": "input_value",
              "name": "DEGREES",
              "check": "Number"
            }
          ],
          "previousStatement": null,
          "nextStatement": null,
          "colour": "#4C97FF",
          "tooltip": "Turns the sprite to the right.",
          "helpUrl": ""
        },
        {
            "type": "looks_sayforsecs",
            "message0": "say %1 for %2 seconds",
            "args0": [
                { "type": "input_value", "name": "MESSAGE", "check": "String" },
                { "type": "input_value", "name": "SECS", "check": "Number" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#9966FF",
            "tooltip": "Displays a speech bubble for a specified time."
        },
        {
            "type": "looks_say",
            "message0": "say %1",
            "args0": [
                { "type": "input_value", "name": "MESSAGE", "check": "String" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#9966FF",
            "tooltip": "Displays a speech bubble."
        },
        {
            "type": "looks_thinkforsecs",
            "message0": "think %1 for %2 seconds",
            "args0": [
                { "type": "input_value", "name": "MESSAGE", "check": "String" },
                { "type": "input_value", "name": "SECS", "check": "Number" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#9966FF",
            "tooltip": "Displays a thought bubble for a specified time."
        },
        {
            "type": "looks_think",
            "message0": "think %1",
            "args0": [
                { "type": "input_value", "name": "MESSAGE", "check": "String" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#9966FF",
            "tooltip": "Displays a thought bubble."
        },
        {
            "type": "looks_changesizeby",
            "message0": "change size by %1",
            "args0": [
                { "type": "input_value", "name": "CHANGE", "check": "Number" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#9966FF",
            "tooltip": "Changes the sprite's size."
        },
        {
            "type": "looks_setsizeto",
            "message0": "set size to %1 %%",
            "args0": [
                { "type": "input_value", "name": "SIZE", "check": "Number" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#9966FF",
            "tooltip": "Sets the sprite's size to a percentage."
        },
        {
            "type": "looks_nextcostume",
            "message0": "next costume",
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#9966FF",
            "tooltip": "Changes to the next costume."
        },
        {
            "type": "sound_playuntildone",
            "message0": "play sound %1 until done",
            "args0": [
              {
                "type": "field_dropdown",
                "name": "SOUND_MENU",
                "options": [
                  [ "meow", "meow" ],
                  [ "pop", "pop" ]
                ]
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#CF63CF",
            "tooltip": "Plays a sound and waits until it finishes.",
            "helpUrl": ""
          },
        {
            "type": "control_wait",
            "message0": "wait %1 seconds",
            "args0": [
              {
                "type": "input_value",
                "name": "DURATION",
                "check": "Number"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#FFAB19",
            "tooltip": "Waits for a specified amount of time.",
            "helpUrl": ""
        },
        {
            "type": "control_repeat",
            "message0": "repeat %1 %2",
            "args0": [
              {
                "type": "input_value",
                "name": "TIMES",
                "check": "Number"
              },
              {
                "type": "input_statement",
                "name": "SUBSTACK"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#FFAB19",
            "tooltip": "Repeats a stack of blocks a specified number of times.",
            "helpUrl": ""
          },
          {
            "type": "control_forever",
            "message0": "forever %1",
            "args0": [
              {
                "type": "input_statement",
                "name": "SUBSTACK"
              }
            ],
            "previousStatement": null,
            "colour": "#FFAB19",
            "tooltip": "Repeats a stack of blocks forever.",
            "helpUrl": ""
          },
          {
            "type": "sensing_touchingmouse",
            "message0": "touching mouse-pointer?",
            "output": "Boolean",
            "colour": "#4CBFE6",
            "tooltip": "Checks if the sprite is touching the mouse pointer.",
            "helpUrl": ""
          },
          {
            "type": "operator_random",
            "message0": "pick random %1 to %2",
            "args0": [
              { "type": "input_value", "name": "FROM", "check": "Number" },
              { "type": "input_value", "name": "TO", "check": "Number" }
            ],
            "output": "Number",
            "colour": "#40BF4A",
            "tooltip": "Picks a random number in the specified range."
          },
          {
            "type": "pen_clear",
            "message0": "erase all",
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#00B295",
            "tooltip": "Clears all pen marks from the Stage.",
            "helpUrl": ""
          },
          {
            "type": "pen_stamp",
            "message0": "stamp",
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#00B295",
            "tooltip": "Stamps a copy of the sprite onto the Stage.",
            "helpUrl": ""
          },
          {
            "type": "pen_penDown",
            "message0": "pen down",
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#00B295",
            "tooltip": "Puts the sprite's pen down.",
            "helpUrl": ""
          },
          {
            "type": "pen_penUp",
            "message0": "pen up",
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#00B295",
            "tooltip": "Pulls the sprite's pen up.",
            "helpUrl": ""
          },
          {
            "type": "pen_setPenColorToColor",
            "message0": "set pen color to %1",
            "args0": [
              {
                "type": "input_value",
                "name": "COLOR",
                "check": "Colour"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#00B295",
            "tooltip": "Sets the pen color.",
            "helpUrl": ""
          },
          {
            "type": "pen_changePenSizeBy",
            "message0": "change pen size by %1",
            "args0": [
              {
                "type": "input_value",
                "name": "SIZE",
                "check": "Number"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#00B295",
            "tooltip": "Changes the pen size.",
            "helpUrl": ""
          },
          {
            "type": "pen_setPenSizeTo",
            "message0": "set pen size to %1",
            "args0": [
              {
                "type": "input_value",
                "name": "SIZE",
                "check": "Number"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#00B295",
            "tooltip": "Sets the pen size.",
            "helpUrl": ""
          }
      ];

    Blockly.defineBlocksWithJsonArray(customBlocks);

    // Generator stubs for the new blocks
    (javascriptGenerator as any).forBlock['event_whenflagclicked'] = function(block: Blockly.Block) {
      return ''; // This is a starter block, so it generates no code by itself.
    };

    (javascriptGenerator as any).forBlock['motion_move'] = function(block: Blockly.Block) {
      const steps = javascriptGenerator.valueToCode(block, 'STEPS', javascriptGenerator.ORDER_ATOMIC) || '10';
      return `await move(${steps});\n`;
    };

    (javascriptGenerator as any).forBlock['motion_turnright'] = function(block: Blockly.Block) {
      const degrees = javascriptGenerator.valueToCode(block, 'DEGREES', javascriptGenerator.ORDER_ATOMIC) || '15';
      return `turn(${degrees});\n`;
    };

    (javascriptGenerator as any).forBlock['looks_sayforsecs'] = function(block: Blockly.Block) {
      const message = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_ATOMIC) || "'Hello!'";
      const secs = javascriptGenerator.valueToCode(block, 'SECS', javascriptGenerator.ORDER_ATOMIC) || '2';
      return `await say(${message}, ${secs});\n`;
    };

    (javascriptGenerator as any).forBlock['looks_say'] = function(block: Blockly.Block) {
      const message = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_ATOMIC) || "'Hello!'";
      return `say(${message});\n`;
    };
    
    (javascriptGenerator as any).forBlock['looks_thinkforsecs'] = function(block: Blockly.Block) {
        const message = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_ATOMIC) || "'Hmm...'";
        const secs = javascriptGenerator.valueToCode(block, 'SECS', javascriptGenerator.ORDER_ATOMIC) || '2';
        return `await think(${message}, ${secs});\n`;
    };
    
    (javascriptGenerator as any).forBlock['looks_think'] = function(block: Blockly.Block) {
        const message = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_ATOMIC) || "'Hmm...'";
        return `think(${message});\n`;
    };

    (javascriptGenerator as any).forBlock['looks_changesizeby'] = function(block: Blockly.Block) {
        const change = javascriptGenerator.valueToCode(block, 'CHANGE', javascriptGenerator.ORDER_ATOMIC) || '10';
        return `changeSizeBy(${change});\n`;
    };

    (javascriptGenerator as any).forBlock['looks_setsizeto'] = function(block: Blockly.Block) {
        const size = javascriptGenerator.valueToCode(block, 'SIZE', javascriptGenerator.ORDER_ATOMIC) || '100';
        return `setSizeTo(${size});\n`;
    };

    (javascriptGenerator as any).forBlock['looks_nextcostume'] = function(block: Blockly.Block) {
        return 'nextCostume();\n';
    };

    (javascriptGenerator as any).forBlock['sound_playuntildone'] = function(block: Blockly.Block) {
        const sound = block.getFieldValue('SOUND_MENU');
        return `await playSound('${sound}');\n`;
    };
    
    (javascriptGenerator as any).forBlock['control_wait'] = function(block: Blockly.Block) {
        const duration = javascriptGenerator.valueToCode(block, 'DURATION', javascriptGenerator.ORDER_ATOMIC) || '1';
        return `await wait(${duration});\n`;
    };
    
    (javascriptGenerator as any).forBlock['control_repeat'] = function(block: Blockly.Block) {
        const times = javascriptGenerator.valueToCode(block, 'TIMES', javascriptGenerator.ORDER_ATOMIC) || '10';
        const substack = javascriptGenerator.statementToCode(block, 'SUBSTACK') || '';
        return `for (let i = 0; i < ${times}; i++) {\n${substack}}\n`;
    };
    
    (javascriptGenerator as any).forBlock['control_forever'] = function(block: Blockly.Block) {
        const substack = javascriptGenerator.statementToCode(block, 'SUBSTACK') || '';
        return `while (true) {\n${substack} await wait(0.03);\n}\n`; // Small delay to prevent freezing
    };

    (javascriptGenerator as any).forBlock['sensing_touchingmouse'] = function(block: Blockly.Block) {
        return ['isTouching("mouse-pointer")', javascriptGenerator.ORDER_ATOMIC];
    };

    (javascriptGenerator as any).forBlock['operator_random'] = function(block: Blockly.Block) {
        const from = javascriptGenerator.valueToCode(block, 'FROM', javascriptGenerator.ORDER_ATOMIC) || 1;
        const to = javascriptGenerator.valueToCode(block, 'TO', javascriptGenerator.ORDER_ATOMIC) || 10;
        return [`getRandom(${from}, ${to})`, javascriptGenerator.ORDER_FUNCTION_CALL];
    };
    
    (javascriptGenerator as any).forBlock['pen_clear'] = function(block: Blockly.Block) {
        return `penClear();\n`;
    };
    
    (javascriptGenerator as any).forBlock['pen_stamp'] = function(block: Blockly.Block) {
        return '// stamp is not implemented yet\n'; // Placeholder for stamp functionality
    };
    
    (javascriptGenerator as any).forBlock['pen_penDown'] = function(block: Blockly.Block) {
        return 'setPen(true);\n';
    };

    (javascriptGenerator as any).forBlock['pen_penUp'] = function(block: Blockly.Block) {
        return 'setPen(false);\n';
    };

    (javascriptGenerator as any).forBlock['pen_setPenColorToColor'] = function(block: Blockly.Block) {
        const color = javascriptGenerator.valueToCode(block, 'COLOR', javascriptGenerator.ORDER_ATOMIC) || "'#000000'";
        return `setPenColor(${color});\n`;
    };
    
    (javascriptGenerator as any).forBlock['pen_changePenSizeBy'] = function(block: Blockly.Block) {
        return '// changePenSizeBy not implemented yet\n'; 
    };

    (javascriptGenerator as any).forBlock['pen_setPenSizeTo'] = function(block: Blockly.Block) {
        return '// setPenSizeTo not implemented yet\n';
    };
}
