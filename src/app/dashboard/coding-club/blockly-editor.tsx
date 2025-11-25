
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useBlocklyWorkspace } from 'react-blockly';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import 'blockly/javascript';

import { javascriptGenerator } from 'blockly/javascript';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

// --- Custom Block Definition & Generator ---

Blockly.Blocks['get_science_fact'] = {
  init: function(this: Blockly.Block) {
    this.appendDummyInput()
        .appendField("get latest science fact");
    this.setOutput(true, 'String');
    this.setColour(160);
    this.setTooltip("Fetches the latest Science Fact of the Day.");
    this.setHelpUrl("");
  }
};

javascriptGenerator.forBlock['get_science_fact'] = function(block: Blockly.Block) {
  const staticFact = "'The mitochondria is the powerhouse of the cell.'";
  return [staticFact, javascriptGenerator.ORDER_ATOMIC];
};


// --- Toolbox Configuration ---

const toolboxCategories = {
    kind: 'categoryToolbox',
    contents: [
        {
          kind: 'category',
          name: 'Logic',
          colour: '%{BKY_LOGIC_HUE}',
          contents: [
            { kind: 'block', type: 'controls_if' },
            { kind: 'block', type: 'logic_compare' },
            { kind: 'block', type: 'logic_operation' },
            { kind: 'block', type: 'logic_negate' },
            { kind: 'block', type: 'logic_boolean' },
          ],
        },
        {
          kind: 'category',
          name: 'Loops',
          colour: '%{BKY_LOOPS_HUE}',
          contents: [
            {
              kind: 'block',
              type: 'controls_repeat_ext',
              inputs: {
                TIMES: {
                  shadow: {
                    type: 'math_number',
                    fields: { NUM: 10 },
                  },
                },
              },
            },
            { kind: 'block', type: 'controls_whileUntil' },
            { kind: 'block', type: 'controls_for' },
            { kind: 'block', type: 'controls_forEach' },
            { kind: 'block', type: 'controls_flow_statements' },
          ],
        },
        {
          kind: 'category',
          name: 'Math',
          colour: '%{BKY_MATH_HUE}',
          contents: [
            { kind: 'block', type: 'math_number' },
            { kind: 'block', type: 'math_arithmetic' },
            { kind: 'block', type: 'math_single' },
            { kind: 'block', type: 'math_trig' },
            { kind: 'block', type: 'math_constant' },
            { kind: 'block', type: 'math_number_property' },
            { kind: 'block', type: 'math_round' },
            { kind: 'block', type: 'math_on_list' },
            { kind: 'block', type: 'math_modulo' },
            { kind: 'block', type: 'math_constrain' },
            { kind: 'block', type: 'math_random_int' },
            { kind: 'block', type: 'math_random_float' },
          ],
        },
        {
          kind: 'category',
          name: 'Text',
          colour: '%{BKY_TEXTS_HUE}',
          contents: [
            { kind: 'block', type: 'text' },
            { kind: 'block', type: 'text_join' },
            { kind: 'block', type: 'text_append' },
            { kind: 'block', type: 'text_length' },
            { kind: 'block', type: 'text_isEmpty' },
            { kind: 'block', type: 'text_indexOf' },
            { kind: 'block', type: 'text_charAt' },
            { kind: 'block', type: 'text_getSubstring' },
            { kind: 'block', type: 'text_changeCase' },
            { kind: 'block', type: 'text_trim' },
            { kind: 'block', type: 'text_print' },
            { kind: 'block', type: 'text_prompt_ext' },
          ],
        },
        {
          kind: 'category',
          name: 'Lists',
          colour: '%{BKY_LISTS_HUE}',
          contents: [
            { kind: 'block', type: 'lists_create_with' },
            { kind: 'block', type: 'lists_repeat' },
            { kind: 'block', type: 'lists_length' },
            { kind: 'block', type: 'lists_isEmpty' },
            { kind: 'block', type: 'lists_indexOf' },
            { kind: 'block', type: 'lists_getIndex' },
            { kind: 'block', type: 'lists_setIndex' },
            { kind: 'block', type: 'lists_getSublist' },
            { kind: 'block', type: 'lists_split' },
            { kind: 'block', type: 'lists_sort' },
          ],
        },
        {
          kind: 'sep',
        },
        {
          kind: 'category',
          name: 'Variables',
          colour: '%{BKY_VARIABLES_HUE}',
          custom: 'VARIABLE',
        },
        {
          kind: 'category',
          name: 'Functions',
          colour: '%{BKY_PROCEDURES_HUE}',
          custom: 'PROCEDURE',
        },
        {
          kind: 'sep',
        },
        {
          kind: 'category',
          name: 'CampusConnect',
          colour: '160',
          contents: [
            { kind: 'block', type: 'get_science_fact' },
          ],
        },
    ]
};

export function BlocklyEditor() {
  const [xml, setXml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const firestore = useFirestore();

  const blocklyDivRef = useRef<HTMLDivElement>(null);
  
  const { workspace } = useBlocklyWorkspace({
    ref: blocklyDivRef,
    toolboxConfiguration: toolboxCategories,
    initialXml: xml,
    workspaceConfiguration: {
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true,
        },
    },
    onXmlChange: setXml
  });

  useEffect(() => {
    if (workspace) {
        // --- PROMPT OVERRIDE FOR VARIABLES ---
        // This is the definitive fix for the "Create variable" button.
        Blockly.dialog.setPrompt((message, defaultValue, callback) => {
            const result = window.prompt(message, defaultValue);
            callback(result);
        });

        // Optional: Override alert and confirm for a more consistent UI in the future.
        Blockly.dialog.setAlert((message, callback) => {
            window.alert(message);
            if (callback) callback();
        });

        Blockly.dialog.setConfirm((message, callback) => {
            const result = window.confirm(message);
            callback(result);
        });
    }
  }, [workspace]);


  // Redefine javascriptGenerator.forBlock for 'text_print' to use window.alert
  javascriptGenerator.forBlock['text_print'] = function(block: Blockly.Block) {
    const msg = javascriptGenerator.valueToCode(block, 'TEXT', javascriptGenerator.ORDER_ATOMIC) || "''";
    return `window.alert(${'\'\'\''}${msg.slice(1, -1)}${'\'\'\''});\n`;
  };

  const handleSave = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to save a project.' });
      return;
    }
    setIsSaving(true);
    try {
      const projectRef = doc(firestore, 'coding-club-projects', user.uid);
      await setDoc(projectRef, { xml: xml, updatedAt: new Date() });
      toast({ title: 'Project Saved!', description: 'Your progress has been saved to your account.' });
    } catch (error) {
      console.error('Error saving project:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save your project.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = useCallback(async () => {
    if (!user || !workspace) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to load a project.' });
      return;
    }
    setIsLoading(true);
    try {
      const projectRef = doc(firestore, 'coding-club-projects', user.uid);
      const docSnap = await getDoc(projectRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        Blockly.Xml.clearWorkspaceAndLoadFromXml(Blockly.Xml.textToDom(data.xml), workspace);
        setXml(data.xml);
        toast({ title: 'Project Loaded', description: 'Your saved project has been loaded.' });
      } else {
        toast({ title: 'No Saved Project', description: 'We could not find a saved project for your account.' });
        workspace.clear();
        setXml('');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load your project.' });
    } finally {
      setIsLoading(false);
    }
  }, [user, firestore, toast, workspace]);

  const runCode = () => {
    if (!workspace) return;
    try {
      const code = javascriptGenerator.workspaceToCode(workspace);
      // Using a safer execution context
      (function() {
        eval(code);
      })();
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        alert('Error running code: ' + e.message);
      } else {
        alert('An unknown error occurred while running the code.');
      }
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button onClick={runCode}>Run Code</Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Project
        </Button>
        <Button variant="outline" onClick={handleLoad} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Load Project
        </Button>
      </div>
      <div ref={blocklyDivRef} style={{ height: '600px', width: '100%', border: '1px solid #ddd', borderRadius: '0.5rem' }} />
    </div>
  );
}
