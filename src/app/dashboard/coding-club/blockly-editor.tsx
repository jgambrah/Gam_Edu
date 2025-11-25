
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
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  return ["'The powerhouse of the cell is the mitochondria.'", javascriptGenerator.ORDER_ATOMIC];
};

const toolboxCategories = {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: 'Output',
        colour: '#5ba55b',
        contents: [
            { kind: 'block', type: 'text_print' },
        ],
      },
      {
        kind: 'sep',
      },
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const firestore = useFirestore();

  const blocklyDivRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  
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
    workspaceRef.current = workspace;
    Blockly.dialog.setPrompt(function(message, defaultValue, callback) {
        callback("my_variable"); 
    });
  }, [workspace]);

  const handleSave = async () => {
    if (!user || !workspace) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to save a project.' });
      return;
    }
    const currentXml = Blockly.Xml.workspaceToDom(workspace);
    const xmlText = Blockly.Xml.domToText(currentXml);

    setIsSaving(true);
    try {
      const projectRef = doc(firestore, 'coding-club-projects', user.uid);
      await setDoc(projectRef, { xml: xmlText, updatedAt: serverTimestamp() });
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
      return;
    }
    setIsFetching(true);
    try {
      const projectRef = doc(firestore, 'coding-club-projects', user.uid);
      const docSnap = await getDoc(projectRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const dom = Blockly.Xml.textToDom(data.xml);
        Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, workspace);
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
      setIsFetching(false);
    }
  }, [user, firestore, toast, workspace]);

  useEffect(() => {
    if(user && workspace) {
        setIsLoading(true);
        handleLoad().finally(() => setIsLoading(false));
    } else {
        setIsLoading(false);
    }
  }, [user, workspace, handleLoad]);

 const runCode = () => {
    if (!workspaceRef.current) {
        setLogs(["❌ Error: Workspace not found."]);
        return;
    }

    const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
    
    console.log("--- GENERATED JAVASCRIPT ---");
    console.log(code);
    console.log("----------------------------");

    if (!code || code.trim() === "") {
        setLogs(["⚠️ No code generated. Did you connect your blocks?"]);
        return;
    }

    setLogs(["> Running..."]);

    try {
      let outputCount = 0;
      
      const customLogger = (message: any) => {
        outputCount++;
        setLogs((prev) => [...prev, String(message)]);
      };

      const wrappedCode = `
        const alert = customLogger;
        var window = { alert: customLogger };
        var console = { log: customLogger };
        
        ${code}
      `;

      const executionFunction = new Function('customLogger', wrappedCode);
      executionFunction(customLogger);
      
      if (outputCount === 0) {
        setLogs((prev) => [
            ...prev, 
            "✅ Finished.", 
            "⚠️ Note: No output was produced.", 
            "   (Did you forget a 'Print' block?)"
        ]);
      } else {
        setLogs((prev) => [...prev, "✅ Finished."]);
      }

    } catch (error: any) {
      setLogs((prev) => [...prev, `❌ Runtime Error: ${error.message}`]);
    }
  };

  return (
    <div className="space-y-4">
        <div className="relative">
            <div className="absolute top-2 right-2 z-10 flex gap-2">
                <Button onClick={runCode}>Run Code ▶</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Project
                </Button>
                <Button variant="outline" onClick={handleLoad} disabled={isFetching}>
                {isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Load Project
                </Button>
                <Button variant="secondary" onClick={() => setLogs([])}>Clear Output</Button>
            </div>
            <div ref={blocklyDivRef} style={{ height: '600px', width: '100%', border: '1px solid #ddd', borderRadius: '0.5rem' }} />
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Program Output</CardTitle>
            </CardHeader>
            <CardContent>
                <pre className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap h-48 overflow-y-auto font-mono">
                    {logs.length === 0 ? (
                        <span className="text-gray-500 italic">// Code output will appear here...</span>
                    ) : (
                        logs.map((line, index) => (
                            <div key={index}>{line}</div>
                        ))
                    )}
                </pre>
            </CardContent>
        </Card>
    </div>
  );
}
