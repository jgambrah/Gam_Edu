'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { generateTTSAction } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';

const TutorSession: React.FC = () => {
  const { user } = useUser();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isTutorSpeaking, setIsTutorSpeaking] = useState(false);
  const { toast } = useToast();

  const handleStartSession = () => {
    setIsSessionActive(true);
    speakWelcome();
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
  };
  
  const speakWelcome = async () => {
    setIsTutorSpeaking(true);
    const text = `Hello ${user?.displayName || 'friend'}! I am still under development, but I am excited to learn with you soon.`;
    try {
        const result = await generateTTSAction({ text, voice: 'Puck' });
        if (!result.success) {
            throw new Error(result.error);
        }
        // In a real scenario, you'd use the result.data (the audio) here.
        // For now, we'll just show a toast.
        toast({ title: "AI Tutor says hello!", description: "Real-time audio coming soon." });

    } catch(e: any) {
        console.error("TTS Failed", e);
        toast({
            variant: "destructive",
            title: "Audio Feature Offline",
            description: "The AI Tutor's voice is currently unavailable. Please check your API key setup."
        });
    } finally {
        setIsTutorSpeaking(false);
    }
  }

  return (
    <div className="flex flex-col items-center p-6 md:p-10 bg-gradient-to-b from-blue-50 to-white rounded-[4rem] shadow-2xl max-w-5xl mx-auto border-8 border-white relative overflow-hidden">
        <h2 className="text-3xl font-black text-blue-600 mb-4">AI Tutor Session</h2>
        <p className="text-muted-foreground mb-8">Live voice interaction coming soon!</p>
        
        {isSessionActive ? (
            <div className="text-center">
                <p className="font-bold text-green-600 mb-4 animate-pulse">Session Active</p>
                <Button onClick={handleEndSession} variant="destructive">
                    End Session
                </Button>
            </div>
        ) : (
            <Button onClick={handleStartSession} size="lg" disabled={isTutorSpeaking}>
                {isTutorSpeaking ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                Start Live Session
            </Button>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground p-4 bg-slate-50 rounded-lg">
            <p><strong>Note:</strong> Real-time audio features are currently in development. This is a placeholder for the live tutoring experience.</p>
        </div>
    </div>
  );
};

export default TutorSession;