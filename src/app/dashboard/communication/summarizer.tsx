"use client";

import { useState } from 'react';
import { summarizeSchoolNotices } from '@/ai/flows/summarize-school-notices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Send } from 'lucide-react';
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const AUDIENCE_OPTIONS = ['Everybody', 'Staff', 'Students', 'Parents'] as const;
type AudienceOption = typeof AUDIENCE_OPTIONS[number];

export function NoticeSummarizer() {
  const [title, setTitle] = useState('');
  const [noticeText, setNoticeText] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [audience, setAudience] = useState<AudienceOption[]>(['Everybody']);
  const { toast } = useToast();
  const { role } = useRole();
  const { user } = useUser();
  const firestore = useFirestore();

  const canPost = role === 'Administrator' || role === 'Director';

  const handleAudienceChange = (option: AudienceOption) => {
    setAudience(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option) 
        : [...prev, option]
    );
  };

  const handleSummarize = async () => {
    if (!noticeText.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please enter some text to summarize.',
        variant: 'destructive',
      });
      return;
    }

    setIsSummarizing(true);
    setSummary('');

    try {
      const result = await summarizeSchoolNotices({ announcements: noticeText });
      setSummary(result.summary);
      toast({
        title: 'Summary Generated',
        description: 'The AI summary is now available below.',
      });
    } catch (error) {
      console.error('Error summarizing notice:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handlePost = async () => {
    if (!firestore || !user) {
      toast({ variant: 'destructive', title: 'Error', description: 'User not authenticated or database not available.' });
      return;
    }
    if (!title.trim() || !noticeText.trim() || audience.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide a title, content, and select an audience for the announcement.',
      });
      return;
    }
    setIsPosting(true);

    const announcementData = {
      title: title,
      content: noticeText,
      authorId: user.uid,
      publishedAt: serverTimestamp(),
      audience: audience,
    };

    const announcementsRef = collection(firestore, 'announcements');

    addDoc(announcementsRef, announcementData)
      .then(() => {
        toast({
          title: 'Announcement Posted!',
          description: 'The announcement is now live for all users.',
        });
        setTitle('');
        setNoticeText('');
        setSummary('');
        setAudience(['Everybody']);
      })
      .catch((error) => {
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: announcementsRef.path,
            operation: 'create',
            requestResourceData: announcementData,
          })
        );
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not post announcement. Check permissions.',
        });
      })
      .finally(() => {
        setIsPosting(false);
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-accent-foreground" />
          AI Notice Assistant
        </CardTitle>
        <CardDescription>
          {canPost
            ? 'Draft, summarize, and post school-wide announcements.'
            : 'Paste a notice below to get a quick overview tailored for you.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {canPost && (
          <>
            <Input
              placeholder="Announcement Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="space-y-2">
                <Label>Target Audience</Label>
                <div className="flex flex-wrap gap-4">
                    {AUDIENCE_OPTIONS.map(option => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`audience-${option}`} 
                                checked={audience.includes(option)}
                                onCheckedChange={() => handleAudienceChange(option)}
                            />
                            <Label htmlFor={`audience-${option}`}>{option}</Label>
                        </div>
                    ))}
                </div>
            </div>
          </>
        )}
        <Textarea
          placeholder="Paste or write school announcement here..."
          value={noticeText}
          onChange={(e) => setNoticeText(e.target.value)}
          rows={10}
        />
        <div className="flex flex-col sm:flex-row gap-2">
           <Button onClick={handleSummarize} disabled={isSummarizing || !noticeText.trim()} className="w-full sm:w-auto">
            {isSummarizing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Summarize
          </Button>
          {canPost && (
             <Button onClick={handlePost} disabled={isPosting || !title.trim() || !noticeText.trim()} className="w-full sm:w-auto">
                {isPosting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                <Send className="mr-2 h-4 w-4" />
                )}
                Post Announcement
            </Button>
          )}
        </div>

        {summary && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">AI-Generated Summary</CardTitle>
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

    