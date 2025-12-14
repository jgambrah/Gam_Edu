
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
import { Loader2, Code2, FolderOpen, Save, RotateCcw, Play } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSound from 'use-sound';
import confetti from 'canvas-confetti';

// --- IMPORTS FOR PLUGINS ---
import { installAllBlocks as installColourBlocks } from '@blockly/field-colour';
import multiLineEditor from '@blockly/field-multilineinput';

// Register the plugins
installColourBlocks({
  javascript: javascriptGenerator,
});


// --- 1. DEFINE CUSTOM BLOCKS (Optional) ---
Blockly.Blocks['get_science_fact'] = {
  init: function(this: Blockly.Block) {
    this.appendDummyInput().appendField("🧪 get science fact");
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
      "Bananas are curved because they grow towards the sun.",
      "Water can boil and freeze at the same time."
  ];
  const code = `[${facts.map(f => `'${f}'`).join(',')}] [Math.floor(Math.random() * ${facts.length})]`;
  return [code, javascriptGenerator.ORDER_ATOMIC];
};

// --- 2. EXHAUSTIVE TOOLBOX CONFIGURATION ---
const toolboxCategories = {
    kind: 'categoryToolbox',
    contents: [
      // 🟢 LOGIC
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
          { kind: 'block', type: 'logic_null' },
          { kind: 'block', type: 'logic_ternary' },
        ],
      },
      // 🔄 LOOPS
      {
        kind: 'category',
        name: 'Loops',
        colour: '%{BKY_LOOPS_HUE}',
        contents: [
          { 
            kind: 'block', 
            type: 'controls_repeat_ext', 
            inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } 
          },
          { kind: 'block', type: 'controls_whileUntil' },
          { 
            kind: 'block', 
            type: 'controls_for',
            inputs: { 
                FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
                TO: { shadow: { type: 'math_number', fields: { NUM: 10 } } },
                BY: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
            }
          },
          { kind: 'block', type: 'controls_forEach' },
          { kind: 'block', type: 'controls_flow_statements' },
        ],
      },
      // 🧮 MATH
      {
        kind: 'category',
        name: 'Math',
        colour: '%{BKY_MATH_HUE}',
        contents: [
          { kind: 'block', type: 'math_number', fields: { NUM: 123 } },
          { kind: 'block', type: 'math_arithmetic', 
            inputs: { 
                A: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
                B: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
            }
          },
          { kind: 'block', type: 'math_single' },
          { kind: 'block', type: 'math_trig' },
          { kind: 'block', type: 'math_constant' },
          { kind: 'block', type: 'math_number_property' },
          { kind: 'block', type: 'math_round' },
          { kind: 'block', type: 'math_on_list' },
          { kind: 'block', type: 'math_modulo' },
          { 
            kind: 'block', 
            type: 'math_constrain',
            inputs: { 
                LOW: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
                HIGH: { shadow: { type: 'math_number', fields: { NUM: 100 } } },
            }
          },
          { kind: 'block', type: 'math_random_int' },
          { kind: 'block', type: 'math_random_float' },
          { kind: 'block', type: 'math_atan2' },
        ],
      },
      // 📝 TEXT
      {
        kind: 'category',
        name: 'Text',
        colour: '%{BKY_TEXTS_HUE}',
        contents: [
          { kind: 'block', type: 'text' },
          { kind: 'block', type: 'text_join' },
          { 
            kind: 'block', 
            type: 'text_append',
            inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: '' } } } }
          },
          { kind: 'block', type: 'text_length' },
          { kind: 'block', type: 'text_isEmpty' },
          { kind: 'block', type: 'text_indexOf' },
          { kind: 'block', type: 'text_charAt' },
          { kind: 'block', type: 'text_getSubstring' },
          { kind: 'block', type: 'text_changeCase' },
          { kind: 'block', type: 'text_trim' },
          { 
            kind: 'block', 
            type: 'text_print', 
            inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'Hello World' } } } }
          },
          { 
            kind: 'block', 
            type: 'text_prompt_ext', 
            inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'What is your name?' } } } }
          },
        ],
      },
      // 📋 LISTS
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
          { kind: 'block', type: 'lists_reverse' },
        ],
      },
      // 🎨 COLOUR (REQUIRES PLUGIN)
      {
        kind: 'category',
        name: 'Colour',
        colour: '%{BKY_COLOUR_HUE}',
        contents: [
          { kind: 'block', type: 'colour_picker' },
          { kind: 'block', type: 'colour_random' },
          { kind: 'block', type: 'colour_rgb' },
          { kind: 'block', type: 'colour_blend' },
        ],
      },
      { kind: 'sep' },
      // 📦 VARIABLES
      {
        kind: 'category',
        name: 'Variables',
        colour: '%{BKY_VARIABLES_HUE}',
        custom: 'VARIABLE',
      },
      // ⚙️ FUNCTIONS / PROCEDURES
      {
        kind: 'category',
        name: 'Functions',
        colour: '%{BKY_PROCEDURES_HUE}',
        custom: 'PROCEDURE',
      },
      { kind: 'sep' },
      // 🚀 EXTRAS
      {
        kind: 'category',
        name: 'Extra',
        colour: '230',
        contents: [
          { kind: 'block', type: 'get_science_fact' },
        ],
      },
    ]
};

export default function BlocklyEditor() {
  const [xml, setXml] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const firestore = useFirestore();
  const [playSuccess] = useSound('/sounds/success.mp3'); 

  const blocklyDivRef = useRef<HTMLDivElement>(null);

  // --- INITIALIZE WORKSPACE ---
  const { workspace } = useBlocklyWorkspace({
    ref: blocklyDivRef,
    toolboxConfiguration: toolboxCategories,
    workspaceConfiguration: {
        grid: { spacing: 20, length: 3, colour: '#e5e7eb', snap: true },
        zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
        trashcan: true,
        renderer: 'geras',
    },
    onXmlChange: setXml
  });

  // --- CODE GENERATION & SAFETY ---
  useEffect(() => {
    if (workspace) {
        javascriptGenerator.INFINITE_LOOP_TRAP = 'if(--window.loopTrap < 0) throw "Infinite loop detected!";\n';
        
        const updateCode = () => {
            const code = javascriptGenerator.workspaceToCode(workspace);
            setGeneratedCode(code);
        };
        workspace.addChangeListener(updateCode);
        return () => workspace.removeChangeListener(updateCode);
    }
  }, [workspace]);

  // --- ACTIONS ---
  const handleSave = async () => {
    if (!user || !workspace) {
      toast({ variant: 'destructive', title: 'Login Required', description: 'Please login to save your work.' });
      return;
    }
    setIsSaving(true);
    try {
      const currentXml = Blockly.Xml.workspaceToDom(workspace);
      const xmlText = Blockly.Xml.domToText(currentXml);
      await setDoc(doc(firestore, 'coding-club-projects', user.uid), { xml: xmlText, updatedAt: serverTimestamp() });
      toast({ title: 'Saved!', description: 'Project saved to cloud.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save.' });
    } finally { setIsSaving(false); }
  };

  const handleLoad = useCallback(async () => {
    if (!user || !workspace) return;
    setIsFetching(true);
    try {
      const docSnap = await getDoc(doc(firestore, 'coding-club-projects', user.uid));
      if (docSnap.exists()) {
        const dom = Blockly.Xml.textToDom(docSnap.data().xml);
        Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, workspace);
        toast({ title: 'Loaded!', description: 'Project loaded successfully.' });
      } else {
        toast({ title: 'No Save Found', description: 'Starting fresh.' });
      }
    } catch (error) { toast({ variant: 'destructive', title: 'Error', description: 'Load failed.' }); } 
    finally { setIsFetching(false); }
  }, [user, firestore, toast, workspace]);

  useEffect(() => {
    if(user && workspace && isLoading) handleLoad().finally(() => setIsLoading(false));
    else if (!user && !isLoading) setIsLoading(false);
  }, [user, workspace, handleLoad, isLoading]);

  const runCode = () => {
    if (!workspace) return;
    setLogs([]); 
    const code = javascriptGenerator.workspaceToCode(workspace);
    if (!code || code.trim() === "") { setLogs(["⚠️ Drag blocks to start!"]); return; }

    try {
      let outputCount = 0;
      const customLogger = (msg: any) => { outputCount++; setLogs(prev => [...prev, String(msg)]); };
      (window as any).loopTrap = 1000; 
      
      const wrappedCode = `
        const window = {}; const document = {}; 
        const alert = customLogger; const console = { log: customLogger };
        ${code}
      `;
      new Function('customLogger', wrappedCode)(customLogger);

      if (outputCount > 0) {
        playSuccess && playSuccess();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
         setLogs(prev => [...prev, "ℹ️ Code ran successfully (No Output)."]);
      }
    } catch (err: any) { setLogs(prev => [...prev, `❌ Error: ${err.message}`]); }
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-100px)]">
        <div className="flex justify-between items-center bg-white p-2 rounded-lg border shadow-sm">
            <div className="bg-orange-100 p-2 rounded text-orange-600 font-bold flex items-center gap-2"><Code2 className="h-5 w-5" /> Block Builder</div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => { workspace?.clear(); setLogs([]); }}><RotateCcw className="h-4 w-4 mr-2"/> Reset</Button>
                <Button variant="outline" size="sm" onClick={handleLoad} disabled={isFetching}><FolderOpen className="h-4 w-4 mr-2"/> Load</Button>
                <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4 mr-2"/> Save</Button>
                <Button onClick={runCode} className="bg-green-600 hover:bg-green-700"><Play className="h-4 w-4 mr-2 fill-current" /> Run Program</Button>
            </div>
        </div>
        
        <div className="flex-1 flex gap-4 min-h-0">
            <div className="flex-1 relative border rounded-lg overflow-hidden shadow-sm bg-slate-50">
                <div ref={blocklyDivRef} className="absolute inset-0" />
            </div>
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
                            {logs.length === 0 ? <div className="text-slate-500 italic mt-10 text-center">Output will appear here...</div> : logs.map((l, i) => <div key={i} className="mb-1 border-b border-slate-800 pb-1">{l}</div>)}
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
