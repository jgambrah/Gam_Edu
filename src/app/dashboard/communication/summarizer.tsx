"use client";

import { useState } from 'react';
import { summarizeSchoolNotices } from '@/ai/flows/summarize-school-notices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sampleAnnouncements } from '@/lib/data';
import { Loader2, Wand2 } from 'lucide-react';
import { useRole } from '@/context/role-context';

export function NoticeSummarizer() {
  const [noticeText, setNoticeText] = useState(sampleAnnouncements[0].content);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { role } = useRole();

  const handleSummarize = async () => {
    if (!noticeText.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please enter some text to summarize.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSummary('');

    try {
      const result = await summarizeSchoolNotices({ announcements: noticeText });
      setSummary(result.summary);
    } catch (error) {
      console.error('Error summarizing notice:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-accent-foreground" />
          Intelligent Notice Summarizer
        </CardTitle>
        <CardDescription>
          AI-powered summaries tailored for you as a <span className='font-bold'>{role}</span>. Paste a notice below to get a quick overview.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste school announcement here..."
          value={noticeText}
          onChange={(e) => setNoticeText(e.target.value)}
          rows={10}
        />
        <Button onClick={handleSummarize} disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Generate Summary'
          )}
        </Button>

        {summary && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{summary}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
