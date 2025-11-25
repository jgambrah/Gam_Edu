
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useBlocklyWorkspace } from 'react-blockly';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

// --- Custom Block Definition & Generator ---

// 1. Define the block's appearance (the JSON part)
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

// 2. Define the block's code generation logic
javascriptGenerator.forBlock['get_science_fact'] = function(block: Blockly.Block) {
  // This is a simplified generator that returns a static string.
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
          ],
        },
        {
          kind: 'category',
          name: 'Text',
          colour: '%{BKY_TEXTS_HUE}',
          contents: [
            { kind: 'block', type: 'text' },
            { kind: 'block', type: 'text_print' },
            { kind: 'block', type: 'text_prompt_ext' },
          ],
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

  // Redefine javascriptGenerator.forBlock for 'text_print' to use window.alert
  javascriptGenerator.forBlock['text_print'] = function(block: Blockly.Block) {
    const msg = javascriptGenerator.valueToCode(block, 'TEXT', javascriptGenerator.ORDER_ATOMIC) || "''";
    return `window.alert(${msg});\n`;
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
    const code = javascriptGenerator.workspaceToCode(workspace);
    try {
      eval(code);
    } catch (e) {
      console.error(e);
      alert('Error running code: ' + e);
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
