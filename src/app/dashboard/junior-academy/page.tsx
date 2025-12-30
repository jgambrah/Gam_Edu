
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { generateJuniorStory, generateJuniorScience, generatePhonicsChallenge } from '@/ai/flows/junior-actions';
import { Loader2, BookOpen, FlaskConical, Mic, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function JuniorAcademyPage() {
  const [activeTab, setActiveTab] = useState('story');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<any>(null);
  const { toast } = useToast();

  const loadContent = async (category: string) => {
    setLoading(true);
    setContent(null);
    let result;
    try {
      if (category === 'story') {
        result = await generateJuniorStory("a friendly dinosaur");
      } else if (category === 'science') {
        result = await generateJuniorScience("how flowers grow");
      } else {
        result = await generatePhonicsChallenge('easy');
      }

      if (result.success) {
        setContent(result.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'AI Error',
          description: result.error || 'Failed to load content.',
        });
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: e.message || 'Please try again later.',
      });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent(activeTab);
  }, [activeTab]);

  return (
    <div className="space-y-6">
       <Card className="border-t-4 border-t-yellow-500 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <span className="text-4xl">🎓</span> Junior Academy (Primary)
          </CardTitle>
          <CardDescription>
            Fun and interactive learning modules for Lower Primary students.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
            <div className="space-y-2">
                <Button variant={activeTab === 'story' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" onClick={() => setActiveTab('story')}><BookOpen /> Story Time</Button>
                <Button variant={activeTab === 'science' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" onClick={() => setActiveTab('science')}><FlaskConical/> Science Facts</Button>
                <Button variant={activeTab === 'phonics' ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" onClick={() => setActiveTab('phonics')}><Mic/> Phonics Fun</Button>
            </div>
        </div>

        <div className="md:col-span-3">
            <Card className="min-h-[400px]">
                <CardContent className="p-6">
                    {loading && <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin"/></div>}
                    
                    {!loading && content && activeTab === 'story' && (
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold flex items-center gap-2">{content.emojiIcon} {content.title}</h3>
                            <p className="whitespace-pre-wrap leading-relaxed">{content.content}</p>
                            <div className="pt-4 border-t">
                                <h4 className="font-semibold mb-2">Questions:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    {content.questions.map((q: any, i: number) => <li key={i}>{q.question}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}

                    {!loading && content && activeTab === 'science' && (
                        <div className="text-center p-8">
                             <div className="text-6xl mb-4">{content.emojiIcon}</div>
                             <h3 className="text-3xl font-bold">{content.title}</h3>
                             <p className="text-lg mt-2 text-muted-foreground">{content.fact}</p>
                        </div>
                    )}

                    {!loading && content && activeTab === 'phonics' && (
                         <div className="text-center p-8">
                             <div className="text-6xl mb-4">{content.emoji}</div>
                             <h3 className="text-5xl font-bold tracking-widest uppercase">{content.word}</h3>
                             <p className="text-xl mt-2 text-muted-foreground font-mono">{content.phonetic}</p>
                             <p className="text-lg mt-4 italic">"{content.sentence}"</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
