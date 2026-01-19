'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Video, FileQuestion, GraduationCap, Users, Banknote, Shield, Brain, Building2 as School } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      
      {/* HERO SECTION */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-blue-900">How can we help you?</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Browse our guides, watch tutorials, or ask our AI Assistant for instant answers.
        </p>
      </div>

      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="guides">User Guides</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* TAB 1: USER GUIDES */}
        <TabsContent value="guides" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <GuideCard 
                icon={School} 
                title="Getting Started" 
                desc="Setting up your school profile, academic year, and classes."
                steps={[
                    "Go to Settings > School Profile to upload your logo.",
                    "Use the Setup Wizard to create your first Class.",
                    "Invite teachers via Staff Management."
                ]}
            />
            <GuideCard 
                icon={Users} 
                title="Managing People" 
                desc="How to add students, parents, and assign roles."
                steps={[
                    "Navigate to Students > Add Student.",
                    "The system auto-generates a Student ID.",
                    "Use Parent Management to link families."
                ]}
            />
            <GuideCard 
                icon={Banknote} 
                title="Finance & Payroll" 
                desc="Invoicing, fee collection, and staff salary processing."
                steps={[
                    "Set up fee structures in Finance > Settings.",
                    "Record payments via the Cash Till (POS).",
                    "Run payroll monthly to generate payslips."
                ]}
            />
            <GuideCard 
                icon={Brain} 
                title="AI Features" 
                desc="Using the AI Tutor and automated content generation."
                steps={[
                    "Teachers can generate Lesson Plans in one click.",
                    "Students can chat with the AI Tutor for homework help.",
                    "Monitor your AI Credit usage in the dashboard header."
                ]}
            />
          </div>
        </TabsContent>

        {/* TAB 2: VIDEOS (Placeholders for now) */}
        <TabsContent value="videos">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Video className="text-red-500"/> Video Library</CardTitle>
                <CardDescription>Watch step-by-step walkthroughs of key features.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <VideoPlaceholder title="Platform Overview (5 min)" />
                <VideoPlaceholder title="How to Run Payroll (3 min)" />
                <VideoPlaceholder title="Using the AI Quiz Generator (2 min)" />
                <VideoPlaceholder title="Director's Guide to Reports (4 min)" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: FAQ */}
        <TabsContent value="faq">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileQuestion className="text-orange-500"/> Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How do I reset a teacher's password?</AccordionTrigger>
                        <AccordionContent>
                            Go to Staff Management, find the teacher, click 'Edit', and you will see a 'Reset Password' option. Alternatively, they can use the 'Forgot Password' link on the login page.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>What happens if I run out of AI Credits?</AccordionTrigger>
                        <AccordionContent>
                            The AI features will pause until your credits renew next month. You can upgrade your plan anytime in the Subscription tab to get more credits instantly.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Is my data secure?</AccordionTrigger>
                        <AccordionContent>
                            Yes. We use enterprise-grade encryption. Your school's data is isolated and cannot be seen by other schools on the platform.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function GuideCard({ icon: Icon, title, desc, steps }: any) {
    return (
        <Card className="hover:shadow-lg transition-all border-t-4 border-t-blue-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Icon className="h-5 w-5"/></div>
                    {title}
                </CardTitle>
                <CardDescription>{desc}</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                    {steps.map((step: string, i: number) => <li key={i}>{step}</li>)}
                </ul>
            </CardContent>
        </Card>
    );
}

function VideoPlaceholder({ title }: { title: string }) {
    return (
        <div className="bg-slate-100 rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors group">
            <div className="bg-white p-4 rounded-full shadow-lg mb-3 group-hover:scale-110 transition-transform">
                <Video className="h-8 w-8 text-blue-600 fill-current" />
            </div>
            <p className="font-medium text-slate-700">{title}</p>
        </div>
    );
}