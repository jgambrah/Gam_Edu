'use client';

import React, { useState, useCallback } from 'react';
import { ReactBlockly } from 'react-blockly';
import Blockly from 'blockly';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

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
  const [initialXml, setInitialXml] = useState('');
  const [projectKey, setProjectKey] = useState(0); // Key to force re-render
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const firestore = useFirestore();

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

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
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
