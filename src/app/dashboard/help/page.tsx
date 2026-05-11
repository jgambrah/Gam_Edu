'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { 
    BookOpen, Video, FileQuestion, GraduationCap, Users, Banknote, Shield, Brain, School, 
    UserPlus, Calculator, ClipboardCheck, BookCopy, Library, Bus, Boxes, BarChart, 
    MessageSquare, Activity, FileText, UserCog, Loader2, Search, Keyboard
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Tutorial } from '@/lib/types';

function GuideCard({ icon: Icon, title, desc, steps }: any) {
    return (
        <Card className="hover:shadow-lg transition-all border-t-4 border-t-blue-500 h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
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

export default function HelpPage() {
  const firestore = useFirestore();
  
  const tutorialsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'tutorials'), orderBy('createdAt', 'desc')) : null, 
  [firestore]);
  
  const { data: tutorials, isLoading: tutorialsLoading } = useCollection<Tutorial>(tutorialsQuery);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HERO SECTION */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Campus <span className="text-indigo-600">Support</span></h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Master the GAM Edu platform with our comprehensive guides and video tutorials.
        </p>
      </div>

      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100 p-1 rounded-2xl">
          <TabsTrigger value="guides" className="rounded-xl font-bold py-3">Interactive Guides</TabsTrigger>
          <TabsTrigger value="videos" className="rounded-xl font-bold py-3">Video Tutorials</TabsTrigger>
          <TabsTrigger value="faq" className="rounded-xl font-bold py-3">General FAQ</TabsTrigger>
        </TabsList>

        {/* TAB 1: USER GUIDES */}
        <TabsContent value="guides" className="space-y-6">
           <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-0">
              <AccordionTrigger className="text-lg font-bold text-indigo-600">Global Search & Shortcuts</AccordionTrigger>
              <AccordionContent className="pt-4 grid md:grid-cols-2 gap-6">
                <GuideCard 
                    icon={Search} 
                    title="Quick Navigation" 
                    desc="Save time by using the system-wide command palette."
                    steps={[
                        "Press Cmd + K (Mac) or Ctrl + K (Windows) from any screen to open the Search Palette.",
                        "Type a student's name, email, or Student ID (e.g., SS-2025-0001) to find them instantly.",
                        "Search for specific classrooms or teachers to jump directly to their management dashboards.",
                        "Use the built-in 'System Shortcuts' at the bottom of the search results to quickly post announcements or go to billing."
                    ]}
                />
                 <GuideCard 
                    icon={Keyboard} 
                    title="Power User Shortcuts" 
                    desc="Navigate the platform faster than ever."
                    steps={[
                        "The search bar in the header isn't just for looking up data; it's a command center.",
                        "Use the Arrow Keys to navigate results and 'Enter' to select.",
                        "On small screens, tap the Search icon in the header to expand the palette."
                    ]}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-bold">Getting Started</AccordionTrigger>
              <AccordionContent className="pt-4 grid md:grid-cols-2 gap-6">
                <GuideCard 
                    icon={School} 
                    title="Setting Up Your School" 
                    desc="Configure your school's profile and core academic settings."
                    steps={[
                        "Navigate to System > School Profile to set your school's name, address, and upload a logo. This information appears on all official documents.",
                        "Navigate to Academics > Subjects to create the subjects taught at your school (e.g., Mathematics, Integrated Science).",
                        "Navigate to Academics > Classes to create your classrooms (e.g., JHS 1, Grade 5A) and assign teachers."
                    ]}
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-bold">People Management</AccordionTrigger>
              <AccordionContent className="pt-4 grid md:grid-cols-2 gap-6">
                <GuideCard 
                    icon={UserPlus} 
                    title="Onboarding Staff & Students" 
                    desc="Add users to the platform and manage their roles."
                    steps={[
                        "Go to People > Staff Management and click 'Add Staff'. Fill in their details and assign a role (e.g., Teacher, Accountant). An email with login credentials will be sent automatically.",
                        "Go to People > Students and click 'Add Student'. Fill in their details and assign them to a class. This also creates a parent account if the email is new.",
                        "Use People > Parents to link existing students to their parents or guardians."
                    ]}
                />
                 <GuideCard 
                    icon={UserCog} 
                    title="Admissions & Alumni" 
                    desc="Manage the full student lifecycle from application to graduation."
                    steps={[
                        "Parents can apply for admission via the 'Apply for Admission' tab. Administrators review these in People > Admissions.",
                        "Approve applications to automatically create student profiles and enroll them in a class.",
                        "Once a student completes their final year, use the Alumni module to graduate them, moving them to the alumni directory."
                    ]}
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-bold">Academics</AccordionTrigger>
              <AccordionContent className="pt-4 grid md:grid-cols-2 gap-6">
                <GuideCard 
                    icon={ClipboardCheck} 
                    title="Assignments, Quizzes & Grading" 
                    desc="Manage classwork and evaluate student performance."
                    steps={[
                        "As a teacher, go to Academics > Assignments & Quizzes. Use 'Create Assignment' for manual tasks or 'Generate with AI' for quick quizzes.",
                        "Students submit work through their portal. Teachers can view submissions by expanding the assignment and grade them.",
                        "For formal assessments, go to Academics > Gradebook, select your class, and click 'Enter Grades' to input scores from your physical records."
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
              <AccordionContent className="pt-4 grid md:grid-cols-2 gap-6">
                <GuideCard 
                    icon={Banknote} 
                    title="Student Billing & Payments" 
                    desc="Manage student fees and record payments."
                    steps={[
                        "Go to Financials > Settings to set daily rates for services like Canteen and Transport.",
                        "Use Financials > Student Billing to apply bulk fees (e.g., Tuition) or single charges (e.g., Library Fines).",
                        "The Accountant can use the 'Cash Till' page to record cash payments received for fees.",
                        "Parents can view and pay bills online via the 'My Bills' page."
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
          </Accordion>
        </TabsContent>

        {/* TAB 2: VIDEOS (NOW DYNAMIC) */}
        <TabsContent value="videos" className="space-y-6">
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-8">
                <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tight">
                    <Video className="text-red-500 h-8 w-8"/> Video Training Library
                </CardTitle>
                <CardDescription className="text-slate-400 font-medium">Master the platform with these step-by-step visual guides.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
                {tutorialsLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                        <p className="font-bold uppercase tracking-widest text-xs">Loading training modules...</p>
                    </div>
                ) : tutorials && tutorials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {tutorials.map(t => (
                            <div key={t.id} className="group space-y-4">
                                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-slate-100 aspect-video bg-black relative group-hover:scale-[1.02] transition-transform duration-500">
                                    <iframe 
                                        width="100%" height="100%" 
                                        src={`https://www.youtube.com/embed/${t.youtubeId}?rel=0&modestbranding=1`} 
                                        title={t.title} frameBorder="0" allowFullScreen
                                        className="absolute inset-0"
                                    ></iframe>
                                </div>
                                <div className="px-2">
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <h3 className="font-black text-xl text-slate-800 leading-tight uppercase italic">{t.title}</h3>
                                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold px-3 py-1 rounded-full shrink-0">
                                            {t.category}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                        {t.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 text-slate-300">
                        <Video className="h-16 w-16 mx-auto mb-4 opacity-10" />
                        <p className="font-bold uppercase tracking-widest text-xs">No training modules published yet.</p>
                    </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: FAQ */}
        <TabsContent value="faq">
          <Card className="rounded-[2rem] shadow-lg border-none">
            <CardHeader className="p-8 border-b">
                <CardTitle className="flex items-center gap-2 font-black text-2xl uppercase tracking-tight">
                    <FileQuestion className="text-orange-500 h-8 w-8"/> Frequently Asked Questions
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="item-1" className="border rounded-2xl px-6 bg-slate-50/50">
                        <AccordionTrigger className="hover:no-underline font-bold text-slate-800">How do I reset a user's password?</AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed pb-6 font-medium">
                            Go to People &gt; Staff Management (or Students), find the user, click 'Edit', and you will see a 'Reset Password' option. Alternatively, they can use the 'Forgot Password' link on the login page to receive a secure link.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border rounded-2xl px-6 bg-slate-50/50">
                        <AccordionTrigger className="hover:no-underline font-bold text-slate-800">What happens if I run out of AI Credits?</AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed pb-6 font-medium">
                            AI features like the Tutor and content generation will pause until your monthly credits renew. You can view your current balance in the header. To get more credits instantly, the Administrator can upgrade your plan in the Subscription tab.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border rounded-2xl px-6 bg-slate-50/50">
                        <AccordionTrigger className="hover:no-underline font-bold text-slate-800">Is my school's data secure?</AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed pb-6 font-medium">
                            Yes. GAM Edu uses bank-grade encryption and multi-tenant isolation. Your school's data is stored in a secure cloud silo that cannot be accessed by any other school or unauthorized personnel.
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
