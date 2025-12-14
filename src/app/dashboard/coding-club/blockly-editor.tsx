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
import { Loader2, Code2, Trash2, ZoomIn, ZoomOut, Play, Save, FolderOpen, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSound from 'use-sound';
import confetti from 'canvas-confetti';

// --- CUSTOM BLOCKS ---
Blockly.Blocks['get_science_fact'] = {
  init: function(this: Blockly.Block) {
    this.appendDummyInput()
        .appendField("🧪 get science fact");
    this.setOutput(true, 'String');
    this.setColour(230);
    this.setTooltip("Fetches a random science fact.");
  }
};

javascriptGenerator.forBlock['get_science_fact'] = function(block: Blockly.Block) {
  const facts = [
      "The mitochondria is the powerhouse of the cell.",
      "Honey never spoils.",
      "Octopuses have three hearts.",
      "Bananas are curved because they grow towards the sun."
  ];
  // Select a random fact at runtime
  const code = `[${facts.map(f => `'${f}'`).join(',')}] [Math.floor(Math.random() * ${facts.length})]`;
  return [code, javascriptGenerator.ORDER_ATOMIC];
};

// --- TOOLBOX ---
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
          { kind: 'block', type: 'logic_boolean' },
        ],
      },
      {
        kind: 'category',
        name: 'Loops',
        colour: '%{BKY_LOOPS_HUE}',
        contents: [
          { kind: 'block', type: 'controls_repeat_ext', inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 5 } } } } },
          { kind: 'block', type: 'controls_whileUntil' },
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
          { kind: 'block', type: 'math_random_int' },
        ],
      },
      {
        kind: 'category',
        name: 'Text & Print',
        colour: '%{BKY_TEXTS_HUE}',
        contents: [
          { kind: 'block', type: 'text' },
          { kind: 'block', type: 'text_join' },
          { kind: 'block', type: 'text_print' }, // Crucial block
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
        name: 'Science',
        colour: '230',
        contents: [
          { kind: 'block', type: 'get_science_fact' },
        ],
      },
    ]
};

export function BlocklyEditor() {
  // State
  const [xml, setXml] = useState('');
  const [generatedCode, setGeneratedCode] = useState(''); // New: Real-time code
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Hooks
  const { toast } = useToast();
  const { user } = useAuth();
  const firestore = useFirestore();
  const [playSuccess] = useSound('/sounds/success.mp3'); // Optional

  const blocklyDivRef = useRef<HTMLDivElement>(null);

  // --- WORKSPACE CONFIG ---
  const { workspace } = useBlocklyWorkspace({
    ref: blocklyDivRef,
    toolboxConfiguration: toolboxCategories,
    workspaceConfiguration: {
        grid: {
          spacing: 20,
          length: 3,
          colour: '#e5e7eb', // Light gray
          snap: true,
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
        },
        trashcan: true, // Enable Trashcan
        renderer: 'geras',
    },
    onXmlChange: setXml
  });

  // --- REAL-TIME CODE GENERATION ---
  useEffect(() => {
    if (workspace) {
        // Add Loop Trap to prevent browser freezing
        javascriptGenerator.INFINITE_LOOP_TRAP = 'if(--window.loopTrap < 0) throw "Infinite loop detected!";\n';
        
        const updateCode = () => {
            const code = javascriptGenerator.workspaceToCode(workspace);
            setGeneratedCode(code);
        };

        workspace.addChangeListener(updateCode);
        return () => workspace.removeChangeListener(updateCode);
    }
  }, [workspace]);

  // --- SAVE / LOAD ---
  const handleSave = async () => {
    if (!user || !workspace) {
      toast({ variant: 'destructive', title: 'Login Required', description: 'Please login to save your work.' });
      return;
    }
    const currentXml = Blockly.Xml.workspaceToDom(workspace);
    const xmlText = Blockly.Xml.domToText(currentXml);

    setIsSaving(true);
    try {
      const projectRef = doc(firestore, 'coding-club-projects', user.uid);
      await setDoc(projectRef, { xml: xmlText, updatedAt: serverTimestamp() });
      toast({ title: 'Saved!', description: 'Your blocks are safe in the cloud.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save project.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = useCallback(async () => {
    if (!user || !workspace) return;
    setIsFetching(true);
    try {
      const projectRef = doc(firestore, 'coding-club-projects', user.uid);
      const docSnap = await getDoc(projectRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const dom = Blockly.Xml.textToDom(data.xml);
        Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, workspace);
        toast({ title: 'Loaded!', description: 'Welcome back to your project.' });
      } else {
        toast({ title: 'No Saves', description: 'Start a new project!' });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load project.' });
    } finally {
      setIsFetching(false);
    }
  }, [user, firestore, toast, workspace]);

  // Auto-load on mount
  useEffect(() => {
    if(user && workspace && isLoading) {
        handleLoad().finally(() => setIsLoading(false));
    } else if (!user && !isLoading) {
        setIsLoading(false);
    }
  }, [user, workspace, handleLoad, isLoading]);


  // --- RUN CODE (SANDBOXED) ---
  const runCode = () => {
    if (!workspace) return;

    setLogs([]); // Clear logs
    const code = javascriptGenerator.workspaceToCode(workspace);

    if (!code || code.trim() === "") {
        setLogs(["⚠️ Drag some blocks to the workspace first."]);
        return;
    }

    try {
      let outputCount = 0;
      
      // Custom print function
      const customLogger = (message: any) => {
        outputCount++;
        setLogs((prev) => [...prev, String(message)]);
      };

      // Set Loop Trap Counter (Safety mechanism)
      (window as any).loopTrap = 1000; 

      // Wrap code in a safe execution environment
      const wrappedCode = `
        const window = {}; // Block access to window
        const document = {}; // Block access to DOM
        const alert = customLogger; // Redirect alert to log
        const console = { log: customLogger }; // Redirect console.log to log
        
        ${code}
      `;

      // Execute
      const executionFunction = new Function('customLogger', wrappedCode);
      executionFunction(customLogger);
      
      // Success Handling
      if (outputCount > 0) {
        playSuccess && playSuccess();
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
      } else {
         setLogs((prev) => [...prev, "ℹ️ Code ran successfully, but produced no output."]);
      }

    } catch (error: any) {
      setLogs((prev) => [...prev, `❌ Error: ${error.message}`]);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-100px)]">
        
        {/* --- TOP BAR --- */}
        <div className="flex justify-between items-center bg-white p-2 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-2 rounded text-orange-600 font-bold flex items-center gap-2">
                    <Code2 className="h-5 w-5" /> Block Builder
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => { workspace?.clear(); setLogs([]); }}>
                    <RotateCcw className="h-4 w-4 mr-2"/> Reset
                </Button>
                <Button variant="outline" size="sm" onClick={handleLoad} disabled={isFetching}>
                    <FolderOpen className="h-4 w-4 mr-2"/> Load
                </Button>
                <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2"/> Save
                </Button>
                <Button onClick={runCode} className="bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2 fill-current" /> Run Program
                </Button>
            </div>
        </div>
        
        {/* --- MAIN WORKSPACE AREA --- */}
        <div className="flex-1 flex gap-4 min-h-0">
            
            {/* LEFT: BLOCKLY CANVAS */}
            <div className="flex-1 relative border rounded-lg overflow-hidden shadow-sm bg-slate-50">
                <div ref={blocklyDivRef} className="absolute inset-0" />
            </div>

            {/* RIGHT: TABS (CODE PREVIEW & OUTPUT) */}
            <Card className="w-1/3 flex flex-col shadow-sm border-l-4 border-l-blue-500">
                <Tabs defaultValue="output" className="flex-1 flex flex-col">
                    <div className="px-4 pt-3 border-b">
                        <TabsList className="w-full">
                            <TabsTrigger value="output" className="flex-1">Output Console</TabsTrigger>
                            <TabsTrigger value="code" className="flex-1">JavaScript Preview</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="output" className="flex-1 p-0 m-0 relative">
                        <div className="absolute inset-0 p-4 overflow-y-auto bg-slate-900 text-green-400 font-mono text-sm">
                            {logs.length === 0 ? (
                                <div className="text-slate-500 italic mt-10 text-center">
                                    Ready to run...<br/>
                                    Use the <span className="text-white font-bold">Print</span> block to see results here.
                                </div>
                            ) : (
                                logs.map((line, index) => (
                                    <div key={index} className="mb-1 border-b border-slate-800 pb-1">{line}</div>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="code" className="flex-1 p-0 m-0 relative">
                        <div className="absolute inset-0 p-4 overflow-y-auto bg-slate-50 text-slate-700 font-mono text-xs">
                             <div className="text-xs text-slate-400 mb-2 uppercase font-bold">Generated JavaScript</div>
                            <pre>{generatedCode || "// Add blocks to generate code"}</pre>
                        </div>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    </div>
  );
}
