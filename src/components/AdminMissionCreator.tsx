'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { PlusCircle, Loader2, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function AdminMissionCreator() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [section, setSection] = useState('Mission 1: Introduction');
  const [task, setTask] = useState('');
  const [theory, setTheory] = useState('### New Concept\nExplain here...');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [blocksInput, setBlocksInput] = useState(''); // Comma separated

  const ADMIN_UID = "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";

  useEffect(() => {
    if (user && user.uid === ADMIN_UID) setIsAdmin(true);
  }, [user]);

  const handleCreate = async () => {
    if (!title || !task || !expectedOutput || !firestore) return;
    setLoading(true);

    try {
      // Create array from comma-separated string
      const availableBlocks = blocksInput.split(',').map(b => b.trim()).filter(b => b !== '');

      // Generate a random high ID to avoid conflict with static IDs (0-100)
      const randomId = Math.floor(Math.random() * 10000) + 100;

      await addDoc(collection(firestore, 'logic_lab_curriculum'), {
        id: randomId,
        section,
        title,
        category: 'Extra', // Default category
        theory,
        task,
        expectedOutput,
        hint: 'Check your spelling!',
        availableBlocks
      });

      alert('✅ Mission Created Successfully!');
      setIsOpen(false);
      // Reset Form
      setTitle('');
      setTask('');
      setExpectedOutput('');
      setBlocksInput('');
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mt-4 bg-indigo-900 hover:bg-indigo-800 text-white border border-indigo-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Mission
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin: Create New Mission</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-bold">Section Name</label>
            <Input value={section} onChange={e => setSection(e.target.value)} placeholder="e.g. Mission 1: Introduction" />
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-bold">Mission Title</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Practice: Printing Names" />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">Task Instruction</label>
            <Textarea value={task} onChange={e => setTask(e.target.value)} placeholder="What should the student do?" />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">Expected Output (Exact Match)</label>
            <Input value={expectedOutput} onChange={e => setExpectedOutput(e.target.value)} placeholder="e.g. Alex" />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">Available Blocks (Comma Separated)</label>
            <Textarea 
                value={blocksInput} 
                onChange={e => setBlocksInput(e.target.value)} 
                placeholder="print(, 'Alex', 'Sam', ), =" 
            />
            <p className="text-xs text-slate-500">Separate blocks with commas.</p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">Theory (Markdown)</label>
            <Textarea value={theory} onChange={e => setTheory(e.target.value)} rows={5} />
          </div>

          <Button onClick={handleCreate} disabled={loading} className="bg-green-600 hover:bg-green-700 w-full">
            {loading ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>}
            Save Mission to Database
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
