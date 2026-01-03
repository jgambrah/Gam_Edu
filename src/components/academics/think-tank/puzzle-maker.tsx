
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Trash2, Plus } from 'lucide-react';
import { saveNewPuzzle } from '@/app/dashboard/early-years/actions';

interface Clue {
  number: number;
  clue: string;
  answer: string;
  row: number;
  col: number;
}

export function PuzzleMaker({ onPuzzleCreated }: { onPuzzleCreated: () => void }) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [grid, setGrid] = useState<string[][]>(Array(10).fill(null).map(() => Array(10).fill('')));
  const [acrossClues, setAcrossClues] = useState<Partial<Clue>[]>([{ number: 1 }]);
  const [downClues, setDownClues] = useState<Partial<Clue>[]>([{ number: 2 }]);

  const handleGridSizeChange = (r: number, c: number) => {
    const newRows = Math.max(5, Math.min(15, r));
    const newCols = Math.max(5, Math.min(15, c));
    setRows(newRows);
    setCols(newCols);
    setGrid(Array(newRows).fill(null).map(() => Array(newCols).fill('')));
  };

  const handleGridInputChange = (r: number, c: number, value: string) => {
    const newGrid = [...grid];
    newGrid[r][c] = value.toUpperCase().slice(0, 1);
    setGrid(newGrid);
  };
  
  const handleClueChange = (type: 'across' | 'down', index: number, field: keyof Clue, value: any) => {
    const clues = type === 'across' ? [...acrossClues] : [...downClues];
    clues[index] = { ...clues[index], [field]: value };
    if (type === 'across') setAcrossClues(clues);
    else setDownClues(clues);
  };

  const addClue = (type: 'across' | 'down') => {
    const newNumber = Math.max(0, ...acrossClues.map(c => c.number || 0), ...downClues.map(c => c.number || 0)) + 1;
    if (type === 'across') setAcrossClues([...acrossClues, { number: newNumber }]);
    else setDownClues([...downClues, { number: newNumber }]);
  };

  const removeClue = (type: 'across' | 'down', index: number) => {
     if (type === 'across') setAcrossClues(acrossClues.filter((_, i) => i !== index));
     else setDownClues(downClues.filter((_, i) => i !== index));
  };


  const handleSave = async () => {
    setIsSaving(true);
    const puzzleData = {
      title, topic, grid,
      clues: {
        across: acrossClues.filter(c => c.clue && c.answer),
        down: downClues.filter(c => c.clue && c.answer),
      }
    };

    const result = await saveNewPuzzle(puzzleData);
    
    if (result.success) {
      toast({ title: "Success!", description: "Your crossword puzzle has been saved." });
      onPuzzleCreated();
    } else {
      toast({ variant: 'destructive', title: "Error", description: "Could not save the puzzle." });
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="space-y-1"><Label>Topic</Label><Input value={topic} onChange={(e) => setTopic(e.target.value)} /></div>
        </div>

        <div>
            <Label>Grid Editor</Label>
            <div className="p-2 border rounded-md bg-slate-50 overflow-auto">
                {grid.map((row, r) => (
                    <div key={r} className="flex">
                        {row.map((cell, c) => (
                            <Input
                                key={c}
                                value={cell}
                                onChange={e => handleGridInputChange(r, c, e.target.value)}
                                className="w-10 h-10 text-center p-0 rounded-none border-gray-300"
                                maxLength={1}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <h4 className="font-semibold">Across Clues</h4>
                {acrossClues.map((clue, index) => (
                    <div key={index} className="flex items-end gap-1 p-2 border rounded">
                       <Input placeholder="Clue" value={clue.clue || ''} onChange={e => handleClueChange('across', index, 'clue', e.target.value)} />
                       <Input placeholder="Answer" value={clue.answer || ''} onChange={e => handleClueChange('across', index, 'answer', e.target.value)} />
                       <Button size="icon" variant="ghost" onClick={() => removeClue('across', index)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addClue('across')}><Plus className="h-4 w-4 mr-2"/>Add</Button>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold">Down Clues</h4>
                {downClues.map((clue, index) => (
                    <div key={index} className="flex items-end gap-1 p-2 border rounded">
                       <Input placeholder="Clue" value={clue.clue || ''} onChange={e => handleClueChange('down', index, 'clue', e.target.value)} />
                       <Input placeholder="Answer" value={clue.answer || ''} onChange={e => handleClueChange('down', index, 'answer', e.target.value)} />
                       <Button size="icon" variant="ghost" onClick={() => removeClue('down', index)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addClue('down')}><Plus className="h-4 w-4 mr-2"/>Add</Button>
            </div>
        </div>
        
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? <Loader2 className="animate-spin mr-2"/> : <Save className="h-4 w-4 mr-2"/>} Save Puzzle
        </Button>
    </div>
  );
}
