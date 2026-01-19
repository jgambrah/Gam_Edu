
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
    BookOpen, Video, FileQuestion, GraduationCap, Users, Banknote, Shield, Brain, School, 
    UserPlus, Calculator, ClipboardCheck, BookCopy, Library, Bus, Boxes, BarChart, 
    MessageSquare, Activity, FileText, UserCog
} from 'lucide-react';


function VideoEmbed({ videoId, title }: { videoId: string, title: string }) {
  return (
    <div className="space-y-2">
      <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 aspect-video">
        <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${videoId}?rel=0`} 
            title={title}
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
        ></iframe>
      </div>
      <p className="font-medium text-center text-sm text-slate-700">{title}</p>
    </div>
  );
}

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
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                    {steps.map((step: string, i: number) => <li key={i}>{step}</li>)}
                </ul>
            </CardContent>
        </Card>
    );
}

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
                 <GuideCard 
                    icon={BookCopy} 
                    title="Lesson Planning & Materials" 
                    desc="Organize your curriculum and share resources with students."
                    steps={[
                        "Go to Academics > Lesson Planning to create detailed daily lesson plans. Use the AI Assistant to generate ideas for objectives and activities.",
                        "Navigate to Academics > Learning Materials to upload course content, videos, and documents organized by subject and topic.",
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

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-bold">Operations</AccordionTrigger>
              <AccordionContent className="pt-4 grid md:grid-cols-2 gap-6">
                 <GuideCard 
                    icon={Library} 
                    title="Library Management" 
                    desc="Catalog books and manage borrowing and returns."
                    steps={[
                        "The Librarian adds books to the system via Operations > Library > Add New Item.",
                        "Students can browse the catalog and request to borrow a book.",
                        "The Librarian approves requests, which marks the book as 'Borrowed' and sets a due date."
                    ]}
                />
                 <GuideCard 
                    icon={Bus} 
                    title="Transport Management" 
                    desc="Manage bus routes, stops, and assign students."
                    steps={[
                        "First, add buses and drivers (staff with 'Transport' role) in the 'Manage Buses' section.",
                        "Create routes and define the stops for each route.",
                        "Finally, assign students who use the bus service to their specific stop on a route."
                    ]}
                />
                 <GuideCard 
                    icon={Boxes} 
                    title="Inventory" 
                    desc="Track school assets like laptops, furniture, and projectors."
                    steps={[
                        "Add new assets to the system via Operations > Inventory > Add New Item.",
                        "Check out items to staff members to track who has what.",
                        "View the transaction history for any item to see its movement."
                    ]}
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg font-bold">Clubs & Activities</AccordionTrigger>
                <AccordionContent className="pt-4 grid md:grid-cols-2 gap-6">
                    <GuideCard 
                        icon={Activity} 
                        title="Engaging Students" 
                        desc="Explore various clubs designed to make learning interactive and fun."
                        steps={[
                            "The Maths Club offers practice problems and a leaderboard to encourage competition.",
                            "The Science Club provides daily facts and AI-led lessons to spark curiosity.",
                            "The ELA Club helps improve grammar and reading comprehension through drills and challenges.",
                            "The Coding Club introduces programming concepts with visual blocks and Python puzzles."
                        ]}
                    />
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
                <AccordionTrigger className="text-lg font-bold">Communication</AccordionTrigger>
                <AccordionContent className="pt-4 grid md:grid-cols-2 gap-6">
                    <GuideCard 
                        icon={MessageSquare} 
                        title="Connecting the Community" 
                        desc="Tools for seamless communication between staff, students, and parents."
                        steps={[
                            "Use the Forum to start school-wide discussions on various topics.",
                            "Direct Messages allow for private, one-on-one conversations between users.",
                            "Post official news and updates through the Announcements module on the main dashboard."
                        ]}
                    />
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
                <AccordionTrigger className="text-lg font-bold">Reporting & Analytics</AccordionTrigger>
                <AccordionContent className="pt-4 grid md:grid-cols-2 gap-6">
                    <GuideCard 
                        icon={BarChart} 
                        title="Data-Driven Insights" 
                        desc="Generate reports to monitor school performance and make informed decisions."
                        steps={[
                            "Academic Reports provide insights into student performance by class and subject.",
                            "Analyze attendance trends and identify at-risk students with Attendance Reports.",
                            "View demographic data and enrollment statistics in the Enrollment Reports section.",
                            "Track inventory and financial statements for comprehensive school management."
                        ]}
                    />
                </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-9">
              <AccordionTrigger className="text-lg font-bold">AI Features</AccordionTrigger>
              <AccordionContent className="pt-4 grid md:grid-cols-2 gap-6">
                 <GuideCard 
                    icon={Brain} 
                    title="AI Tutor & Assistant" 
                    desc="Leverage the power of AI for learning and productivity."
                    steps={[
                        "The purple robot icon in the bottom-right opens the AI Assistant. It can answer questions about how to use the app or help you draft documents.",
                        "Students can access the AI Tutor in the 'Study Club' to get personalized help with their homework on any subject.",
                        "Your school's AI Credit balance is shown in the dashboard header. Each AI action consumes credits."
                    ]}
                />
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </TabsContent>

        {/* TAB 2: VIDEOS */}
        <TabsContent value="videos">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Video className="text-red-500"/> Video Library</CardTitle>
                <CardDescription>Watch step-by-step walkthroughs of key features.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <VideoEmbed videoId="m6UOo2YGbIE" title="How To Onboard Your School" />
                <VideoEmbed videoId="qW1d34A2s1A" title="Using the AI Quiz Generator" />
                <VideoEmbed videoId="yG-Ua_9mI_0" title="Managing Staff & Payroll" />
                <VideoEmbed videoId="dQw4w9WgXcQ" title="Parent & Student Portal Overview" />
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
