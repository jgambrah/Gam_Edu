
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpenCheck, Edit, FileText, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/context/role-context';
import { GrammarPractice } from './grammar-practice';

function ReadingPracticeTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading Comprehension</CardTitle>
        <CardDescription>
          Read passages and answer questions to improve your understanding.
          (Coming Soon)
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground py-12">
        <p>Reading passages and comprehension tests will appear here.</p>
      </CardContent>
    </Card>
  );
}

function WritingSubmissionTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Writing & Summarizing Challenges</CardTitle>
        <CardDescription>
          Submit your written work for feedback and improvement. (Coming Soon)
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground py-12">
        <p>Writing prompts and submission forms will be available here.</p>
      </CardContent>
    </Card>
  );
}

export default function ElaClubPage() {
  const { role } = useRole();
  const isTeacherOrAdmin =
    role === 'Teacher' || role === 'Administrator' || role === 'Director';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenCheck />
            ELA Club
          </CardTitle>
          <CardDescription>
            Improve your reading, writing, and grammar skills.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="grammar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grammar">
            <Edit className="mr-2 h-4 w-4" />
            Grammar Practice
          </TabsTrigger>
          <TabsTrigger value="reading">
            <FileText className="mr-2 h-4 w-4" />
            Reading Practice
          </TabsTrigger>
          <TabsTrigger value="writing">
            <ChevronRight className="mr-2 h-4 w-4" />
            Writing Submissions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="grammar">
          <GrammarPractice />
        </TabsContent>
        <TabsContent value="reading">
          <ReadingPracticeTab />
        </TabsContent>
        <TabsContent value="writing">
          <WritingSubmissionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
