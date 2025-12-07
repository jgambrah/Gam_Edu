'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Paradox, DebateTopic } from '@/lib/types';

// --- PARADOX CARD ---
interface ParadoxCardProps {
  paradox: Paradox;
  onComplete: () => void;
  onDelete?: () => void; // New prop for deleting
  isStaff?: boolean;     // New prop to check permissions
}

export function ParadoxCard({ paradox, onComplete, onDelete, isStaff }: ParadoxCardProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
    onComplete(); // Mark as "attempted" locally
  };

  return (
    <Card className="border-t-4 border-t-indigo-500 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold text-slate-800">
                Daily Challenge
            </CardTitle>
            {isStaff && onDelete && (
                <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
        <div className="flex gap-2 mt-2">
            <Badge variant="outline">{paradox.difficulty || 'General'}</Badge>
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">Logic</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* The Riddle/Question */}
        <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-lg font-medium leading-relaxed text-slate-800">
                {paradox.question}
            </p>
        </div>

        {/* Answer Section */}
        <div className="space-y-3">
            <Input 
                placeholder="Type your answer here..." 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={isRevealed}
                className="bg-white"
            />
            
            {!isRevealed ? (
                <Button 
                    onClick={handleReveal} 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    <Eye className="mr-2 h-4 w-4" /> Reveal Answer
                </Button>
            ) : (
                <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800 font-bold">Answer: {paradox.answer || "No answer provided"}</AlertTitle>
                    <AlertDescription className="text-green-700 mt-1">
                        {paradox.explanation || "No explanation provided."}
                    </AlertDescription>
                </Alert>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

// --- DEBATE ARENA (Placeholder for now) ---
export function DebateArena({ topic }: { topic: DebateTopic }) {
    return (
        <Card>
            <CardHeader><CardTitle>Debate: {topic.topic}</CardTitle></CardHeader>
            <CardContent><p>Debate features coming soon.</p></CardContent>
        </Card>
    );
}
