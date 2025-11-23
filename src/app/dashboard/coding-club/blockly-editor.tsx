'use client';

import React, { useState } from 'react';
import { ReactBlockly } from 'react-blockly';
import Blockly from 'blockly';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Define the XML for the toolbox with specified categories.
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
</xml>
`;

export function BlocklyEditor() {
  const [xml, setXml] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    // For now, this just logs the XML to the console and shows a toast.
    // In a future step, this function can be modified to save the `xml` string to Firebase Storage.
    console.log('Current Workspace XML:', xml);
    toast({
      title: 'Project "Saved"',
      description: 'Your project XML has been logged to the console. Firebase integration is next!',
    });
  };

  const handleLoad = () => {
    // This is a placeholder for loading from Firebase Storage.
    toast({
        variant: 'destructive',
        title: 'Not Implemented',
        description: 'Loading from Firebase is not yet connected.',
    });
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button onClick={handleSave}>Save Project</Button>
        <Button variant="outline" onClick={handleLoad}>Load Project</Button>
      </div>
      <div style={{ height: '600px', width: '100%', border: '1px solid #ddd', borderRadius: '0.5rem' }}>
        <ReactBlockly
          toolboxCategories={toolboxCategories}
          initialXml={''}
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
