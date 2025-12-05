
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NoticeSummarizer } from './summarizer';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useRole } from '@/context/role-context';
import { useEffect, useState } from 'react';

type Announcement = {
  id: string;
  title: string;
  content: string;
  publishedAt: any;
  audience: string[];
};

export default function CommunicationPage() {
  const firestore = useFirestore();
  const { role } = useRole();
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const announcementsQuery = useMemoFirebase(() => {
    if (!firestore || !role) return null;
    // Switching to v2 to bypass cache/permission issues
    return query(
        collection(firestore, 'announcements_v2'),
        where('audience', 'array-contains-any', ['Everybody', role]),
        orderBy('publishedAt', 'desc')
    );
  }, [firestore, role]);

  const { data } = useCollection<Announcement>(announcementsQuery);

  useEffect(() => {
    if (data) {
        setAnnouncements(data);
        setIsLoading(false);
    }
  }, [data]);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Latest news and updates from the school.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : announcements && announcements.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {announcements.map((announcement) => (
                  <AccordionItem value={announcement.id} key={announcement.id}>
                    <AccordionTrigger>
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold">{announcement.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {announcement.publishedAt ? format(announcement.publishedAt.toDate(), 'PPP') : 'Posting...'}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-sm max-w-none">
                      {announcement.content.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
                <p className="text-center text-muted-foreground py-8">No announcements have been posted yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <NoticeSummarizer />
      </div>
    </div>
  );
}
