
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Video, FileQuestion, GraduationCap, Users, Banknote, Shield, Brain, Building2 as School, UserPlus, Calculator, ClipboardCheck, BookCopy } from 'lucide-react';

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
           <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-bold">Getting Started</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                <GuideCard 
                    icon={School} 
                    title="Setting Up Your School" 
                    desc="Configure your school's profile and core academic settings."
                    steps={[
                        "Navigate to System > School Profile to set your school's name, address, and upload a logo. This information appears on all official documents.",
                        "Navigate to Academics > Subjects to create the subjects taught at your school (e.g., Mathematics, Integrated Science).",
                        "Navigate to Academics > Classes to create your classrooms (e.g., JHS 1, Grade 5A)."
                    ]}
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-bold">People Management</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                <GuideCard 
                    icon={UserPlus} 
                    title="Adding Staff & Students" 
                    desc="Onboard your team and students to the platform."
                    steps={[
                        "Go to People > Staff Management and click 'Add Staff'. Fill in their details and assign a role (e.g., Teacher, Accountant). An email with login credentials will be sent automatically.",
                        "Go to People > Students and click 'Add Student'. Fill in their details and assign them to a class. This also creates a parent account if the email is new.",
                    ]}
                />
                 <GuideCard 
                    icon={Users} 
                    title="Managing Parents & Linking Students" 
                    desc="Connect parents to their children's accounts."
                    steps={[
                        "When adding a student, if the parent's email already exists, the student will be automatically linked.",
                        "To manually link students, go to People > Parents, click 'Edit' on a parent, and use the 'Link Students' search to find and add their children.",
                    ]}
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-bold">Academics</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                <GuideCard 
                    icon={ClipboardCheck} 
                    title="Assignments, Quizzes & Grading" 
                    desc="Manage classwork and evaluate student performance."
                    steps={[
                        "As a teacher, go to Assignments and use the 'Create Assignment' button to set tasks for your class.",
                        "Use the 'Generate with AI' option within the assignment form to quickly create quizzes on any topic.",
                        "To grade, open the Gradebook, select your class, and click 'Enter Grades' to input scores from your physical records."
                    ]}
                />
                <GuideCard 
                    icon={FileText} 
                    title="Report Cards" 
                    desc="Generate and publish official student report cards."
                    steps={[
                        "From the Gradebook, teachers can enter comments for each student by subject.",
                        "Once all comments and grades are in, teachers submit the report card for final approval.",
                        "The Administrator or Director can then 'Publish' the report card, which notifies parents and makes it visible in their portal."
                    ]}
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-bold">Financials</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                <GuideCard 
                    icon={Banknote} 
                    title="Student Billing & Payments" 
                    desc="Manage student fees and record payments."
                    steps={[
                        "Go to Financials > Student Billing. Use 'Bulk Bill' to apply tuition fees to an entire class.",
                        "Use 'Single Bill' for individual charges like library fines or damages.",
                        "The Accountant can use the 'Cash Till' page to record cash payments received for fees."
                    ]}
                />
                 <GuideCard 
                    icon={Calculator} 
                    title="Payroll Management" 
                    desc="Set up staff salaries and run monthly payroll."
                    steps={[
                        "Go to Financials > Staff Payroll Config. Select a staff member and fill in their basic salary, allowances, and bank details.",
                        "Go to Financials > Payroll. Select the month and click 'Calculate Payroll' to generate a preview.",
                        "Review the preview, and if correct, click 'Approve & Save Payroll' to finalize and generate payslips for all staff."
                    ]}
                />
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-bold">AI Features</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                 <GuideCard 
                    icon={Brain} 
                    title="AI Tutor & Assistant" 
                    desc="Leverage the power of AI for learning and productivity."
                    steps={[
                        "The purple robot icon in the bottom-right opens the AI Assistant. It can answer questions about how to use the app or help draft documents.",
                        "Students can access the AI Tutor in the 'Study Club' to get personalized help with their homework on any subject.",
                        "Your school's AI Credit balance is shown in the header. Each AI action consumes credits."
                    ]}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
                <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Icon className="h-5 w-5"/></div>
                    {title}
                </CardTitle>
                <CardDescription>{desc}</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="list-decimal pl-5 space-y-2 text-sm text-slate-600">
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
                <Video className="h-8 w-8 text-blue-600" />
            </div>
            <p className="font-medium text-slate-700">{title}</p>
        </div>
    );
}
