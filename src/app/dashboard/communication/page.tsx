import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sampleAnnouncements } from '@/lib/data';
import { NoticeSummarizer } from './summarizer';

export default function CommunicationPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Latest news and updates from the school.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {sampleAnnouncements.map((announcement) => (
                <AccordionItem value={`item-${announcement.id}`} key={announcement.id}>
                  <AccordionTrigger>
                    <div className="flex flex-col items-start text-left">
                      <span className="font-semibold">{announcement.title}</span>
                      <span className="text-sm text-muted-foreground">{announcement.date}</span>
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
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <NoticeSummarizer />
      </div>
    </div>
  );
}
