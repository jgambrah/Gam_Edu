'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ReactBlockly } from 'react-blockly';
import Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

// --- Custom Block Definition & Generator ---

// 1. Define the block's appearance (the JSON part)
Blockly.Blocks['get_science_fact'] = {
  init: function() {
    this.appendValueInput("FACT")
        .setCheck(null)
        .appendField("get latest science fact");
    this.setOutput(true, 'String');
    this.setColour(160);
    this.setTooltip("Fetches the latest Science Fact of the Day.");
    this.setHelpUrl("");
  }
};

// 2. Define the block's code generation logic
javascriptGenerator.forBlock['get_science_fact'] = function(block) {
  // This is an asynchronous operation, so we need to handle it specially.
  // We define an async helper function and call it.
  const functionName = javascriptGenerator.provideFunction_(
    'getLatestScienceFact',
    `
async function ${javascriptGenerator.FUNCTION_NAME_PLACEHOLDER_}() {
  try {
    // This code will run in the browser's JS environment, not in Node.js.
    // It needs a way to access firestore. We'll pass it in.
    // NOTE: For a real app, you'd pass your initialized firestore instance.
    // Since we can't do that directly here, this is a simplified example.
    // In a full implementation, you would inject the firestore instance
    // into the execution context of the generated code.
    
    // The following is a placeholder for where you would query Firestore.
    // For this demo, we'll return a static string.
    return "The mitochondria is the powerhouse of the cell.";

  } catch (e) {
    console.error("Error fetching science fact:", e);
    return "Could not fetch fact.";
  }
}
`
  );
  // Generate code for an async call
  const code = `(await ${functionName}())`;
  return [code, javascriptGenerator.ORDER_ATOMIC];
};


// --- Toolbox Configuration ---

const toolboxCategories = `
<xml>
  <category name="Logic" colour="%{BKY_LOGIC_HUE}">
    <block type="controls_if"></block>
    <block type="logic_compare"></block>
    <block type="logic_operation"></block>
    <block type="logic_negate"></block>
    <block type="logic_boolean"></block>
  </category>
  <category name="Loops" colour="%{BKY_LOOPS_HUE}">
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
    <block type="controls_whileUntil"></block>
  </category>
  <category name="Math" colour="%{BKY_MATH_HUE}">
    <block type="math_number"></block>
    <block type="math_arithmetic"></block>
    <block type="math_single"></block>
  </category>
  <category name="Text" colour="%{BKY_TEXTS_HUE}">
    <block type="text"></block>
    <block type="text_print"></block>
    <block type="text_prompt_ext"></block>
  </category>
  <sep></sep>
  <category name="CampusConnect" colour="160">
      <block type="get_science_fact"></block>
  </category>
</xml>
`;

export function BlocklyEditor() {
  const [xml, setXml] = useState('');
  const [initialXml, setInitialXml] = useState('');
  const [projectKey, setProjectKey] = useState(0); // Key to force re-render
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const firestore = useFirestore();

  // Redefine javascriptGenerator.forBlock for 'text_print' to use window.alert
  javascriptGenerator.forBlock['text_print'] = function(block, generator) {
    const msg = generator.valueToCode(block, 'TEXT', javascriptGenerator.ORDER_ATOMIC) || "''";
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
      await setDoc(projectRef, { xml, updatedAt: new Date() });
      toast({ title: 'Project Saved!', description: 'Your progress has been saved to your account.' });
    } catch (error) {
      console.error('Error saving project:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save your project.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = useCallback(async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to load a project.' });
      return;
    }
    setIsLoading(true);
    try {
      const projectRef = doc(firestore, 'coding-club-projects', user.uid);
      const docSnap = await getDoc(projectRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setInitialXml(data.xml);
        setProjectKey(prevKey => prevKey + 1); // Change key to force re-render
        toast({ title: 'Project Loaded', description: 'Your saved project has been loaded.' });
      } else {
        toast({ title: 'No Saved Project', description: 'We could not find a saved project for your account.' });
        setInitialXml(''); // Load an empty workspace
        setProjectKey(prevKey => prevKey + 1);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load your project.' });
    } finally {
      setIsLoading(false);
    }
  }, [user, firestore, toast]);

  const runCode = () => {
    const code = javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());
    try {
      // The generated code is async, so we wrap it in an async IIFE
      const asyncCode = `(async () => {${code}})();`;
      eval(asyncCode);
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
      <div style={{ height: '600px', width: '100%', border: '1px solid #ddd', borderRadius: '0.5rem' }}>
        <ReactBlockly
          key={projectKey} // Force re-mount when key changes
          toolboxCategories={toolboxCategories}
          initialXml={initialXml}
          workspaceConfiguration={{
            grid: {
              spacing: 20,
              length: 3,
              colour: '#ccc',
              snap: true,
            },
          }}
          onXmlChange={setXml}
        />
      </div>
    </div>
  );
}
