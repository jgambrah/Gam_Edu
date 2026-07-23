'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Class, Student, LearningMaterial, Attachment, VideoLink, RichQuizQuestion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, Video, Link as LinkIcon, FileSpreadsheet, File, 
  Plus, Trash2, Edit, ExternalLink, Loader2, X, Folder, UploadCloud, Globe, ArrowLeft, BookOpen, Paperclip, HelpCircle,
  Calculator, Sparkles, FolderOpen, Trophy, RotateCcw, CheckCircle2, XCircle, Play, Check, Book, BookOpenCheck, Zap, Laptop, Languages
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getAuth } from 'firebase/auth';
import { updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { checkAndSpendCredits } from '@/app/actions/credits';
import { generateQuiz } from '@/ai/flows/generate-quiz-flow';
import CreditBalance from '@/components/CreditBalance';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// --- DATA TYPES ---
export type ResourceType = 'PDF' | 'Video' | 'Document' | 'Spreadsheet' | 'Link';

export interface ResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
}

// --- HELPER ICONS ---
const MaterialIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'PDF': return <FileText className="h-5 w-5 text-red-500" />;
    case 'Video': return <Video className="h-5 w-5 text-blue-500" />;
    case 'Spreadsheet': return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    case 'Document': return <FileText className="h-5 w-5 text-blue-700" />;
    case 'Link': return <LinkIcon className="h-5 w-5 text-slate-500" />;
    default: return <File className="h-5 w-5 text-gray-500" />;
  }
};

// --- COMPONENT: Add/Edit Material Form ---
function MaterialForm({ 
  open, 
  setOpen, 
  materialToEdit, 
  classes,
  subjectsList, 
  preSelectedSubject,
  preSelectedClassId,
  schoolId, 
}: { 
  open: boolean; 
  setOpen: (o: boolean) => void; 
  materialToEdit?: LearningMaterial | null; 
  classes: Class[] | undefined;
  subjectsList: string[]; 
  preSelectedSubject?: string;
  preSelectedClassId?: string;
  schoolId: string;
}) {
  const firestore = useFirestore();
  const { user: hookUser } = useUser();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [formTab, setFormTab] = useState<'info' | 'resources' | 'quiz'>('info');

  const [topicTitle, setTopicTitle] = useState(materialToEdit?.topicTitle || '');
  const [description, setDescription] = useState(materialToEdit?.content || '');
  const [classId, setClassId] = useState(materialToEdit?.classId || preSelectedClassId || '');
  const [subject, setSubject] = useState(materialToEdit?.subject || preSelectedSubject || ''); 
  const [videos, setVideos] = useState<VideoLink[]>(materialToEdit?.videoLinks || []);
  const [attachments, setAttachments] = useState<Attachment[]>(materialToEdit?.attachments || []);
  const [questions, setQuestions] = useState<RichQuizQuestion[]>(materialToEdit?.practiceQuestions || []);

  const [inputType, setInputType] = useState<'link' | 'file'>('link');
  const [tempType, setTempType] = useState<string>('PDF');
  const [tempTitle, setTempTitle] = useState('');
  const [tempUrl, setTempUrl] = useState('');

  // Video links states
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');

  const handleAddVideo = () => {
    if (!newVideoUrl) return;
    setVideos([...videos, { title: newVideoTitle || 'Video Resource', url: newVideoUrl }]);
    setNewVideoUrl('');
    setNewVideoTitle('');
    toast({ title: "Video Added", description: "Successfully added video reference link." });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fakeUrl = URL.createObjectURL(file); 
      const type = file.type.includes('pdf') ? 'PDF' : file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.csv') ? 'Spreadsheet' : 'Document';
      setAttachments([...attachments, { name: file.name, url: fakeUrl, type: type as any }]);
      toast({ title: "File Selected", description: `Added document: ${file.name}.` });
    }
  };
  
  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const updateQuestion = (index: number, field: keyof RichQuizQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  // AI Quiz Generation
  const handleAskAIQuiz = async () => {
    if (!topicTitle) {
      toast({ variant: 'destructive', title: 'Topic Title Required', description: 'Please enter a Topic Title first before running the AI Quiz Generator.' });
      return;
    }
    
    setIsGeneratingQuiz(true);
    toast({ title: "AI Generator Initiated", description: "Generating 5 multiple-choice quiz questions..." });

    try {
      // 1. Spends Credits
      const creditRes = await checkAndSpendCredits(schoolId, 3);
      if (!creditRes.success) {
        toast({ variant: 'destructive', title: 'Insufficient AI Credits', description: creditRes.error || 'Please upgrade your plan.' });
        setIsGeneratingQuiz(false);
        return;
      }

      // 2. Call AI flow
      const className = classes?.find(c => c.id === classId)?.name || "High School";
      const result = await generateQuiz({
        topic: topicTitle,
        numQuestions: 5,
        forGradeLevel: className,
        additionalInstructions: "Focus on Core conceptual understandings and clear explanations."
      });

      if (result && result.questions) {
        // Map questions to RichQuizQuestion structure
        const formattedQuestions: RichQuizQuestion[] = result.questions.map(q => ({
          question: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }));

        setQuestions(prev => [...prev, ...formattedQuestions]);
        toast({ title: "AI Generation Success!", description: `Appended 5 questions to your practice quiz folder.` });
      } else {
        throw new Error("Invalid AI payload received.");
      }
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'AI Quiz Error', description: error.message || 'Failed to generate practice questions.' });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const auth = getAuth();
    const currentUser = auth.currentUser || hookUser;

    if (!currentUser || !firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'Authentication missing.' });
        return;
    }

    if (!topicTitle || !classId || !subject) {
        toast({ variant: 'destructive', title: 'Missing Fields', description: 'Topic, Class, and Subject are required.' });
        return;
    }

    setIsSubmitting(true);

    try {
      const dataToSave: any = {
        strand: "STRAND 1: CORE ACADEMICS",
        subStrand: "Sub-strand: Subject Materials",
        topicTitle,
        content: description,
        classId,
        subject,
        videoLinks: videos,
        attachments: attachments,
        practiceQuestions: questions,
        uploadedBy: currentUser.uid,
        updatedAt: serverTimestamp(),
        schoolId: schoolId, 
      };

      if (materialToEdit) {
        await updateDocumentNonBlocking(doc(firestore, 'learning_materials', materialToEdit.id), dataToSave);
        toast({ title: 'Topic Folder Saved', description: 'Your learning materials have been updated.' });
      } else {
        dataToSave.createdAt = serverTimestamp();
        dataToSave.courseId = `material-${subject.replace(/\s+/g, '-').toLowerCase()}`;
        await addDocumentNonBlocking(collection(firestore, 'learning_materials'), dataToSave);
        toast({ title: 'Topic Folder Saved', description: 'Your new learning materials folder has been created.' });
      }
      setOpen(false);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save.' });
      setIsSubmitting(false); 
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[750px] h-[90vh] flex flex-col p-6 rounded-2xl">
        <DialogHeader className="shrink-0 border-b pb-4">
          <DialogTitle className="text-xl font-black flex items-center gap-2">
            <FolderOpen className="text-violet-600 h-5 w-5" />
            {materialToEdit ? 'Edit Material Folder' : 'Add Learning Material Folder'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Publish visual learning guides, class videos, downloadable sheets, and student quizzes.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={formTab} onValueChange={(v) => setFormTab(v as any)} className="flex-1 flex flex-col overflow-hidden mt-4">
          <TabsList className="grid w-full grid-cols-3 shrink-0 mb-4 bg-slate-100/80 rounded-xl p-1 dark:bg-slate-900">
            <TabsTrigger value="info" className="rounded-lg font-semibold text-xs flex items-center gap-1.5 py-2">
              <FileText className="h-4 w-4" /> Core Details
            </TabsTrigger>
            <TabsTrigger value="resources" className="rounded-lg font-semibold text-xs flex items-center gap-1.5 py-2">
              <UploadCloud className="h-4 w-4" /> Resources & Media
            </TabsTrigger>
            <TabsTrigger value="quiz" className="rounded-lg font-semibold text-xs flex items-center gap-1.5 py-2">
              <HelpCircle className="h-4 w-4" /> Practice Quiz ({questions.length})
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
            <ScrollArea className="flex-1 pr-3">
              <div className="space-y-6 pb-4">
                
                {/* 1. Core Info Tab */}
                <TabsContent value="info" className="space-y-4 m-0 focus:outline-none">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-bold dark:text-slate-300">Subject *</Label>
                      <Select value={subject} onValueChange={setSubject}>
                        <SelectTrigger className="border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-lg">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectsList.map((s, i) => <SelectItem key={`${s}-${i}`} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-bold dark:text-slate-300">Assign to Class *</Label>
                      <Select value={classId} onValueChange={setClassId}>
                        <SelectTrigger className="border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-lg">
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold dark:text-slate-300">Topic Title *</Label>
                    <Input 
                      required 
                      value={topicTitle} 
                      onChange={e => setTopicTitle(e.target.value)} 
                      placeholder="e.g. Diversity of Matter" 
                      className="border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold dark:text-slate-300">Learning Content & Notes</Label>
                    <Textarea 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      placeholder="Enter the lesson study notes or guide here..." 
                      className="min-h-56 border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-lg leading-relaxed" 
                    />
                  </div>
                </TabsContent>

                {/* 2. Resources Tab */}
                <TabsContent value="resources" className="space-y-5 m-0 focus:outline-none">
                  
                  {/* YouTube video section */}
                  <div className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Video className="h-4 w-4 text-blue-500" />
                      Video References (YouTube)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      <div className="md:col-span-4 space-y-1">
                        <Label className="text-xs">Video Title</Label>
                        <Input value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} placeholder="e.g. Intro Lecture" className="bg-white rounded-lg border-slate-200" />
                      </div>
                      <div className="md:col-span-6 space-y-1">
                        <Label className="text-xs">YouTube URL</Label>
                        <Input value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="bg-white rounded-lg border-slate-200" />
                      </div>
                      <div className="md:col-span-2">
                        <Button type="button" variant="outline" onClick={handleAddVideo} className="w-full flex items-center gap-1 text-xs border-blue-200 hover:bg-blue-50 text-blue-600 font-semibold rounded-lg h-9">
                          <Plus className="h-4.5 w-4.5" /> Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* File Upload / Link Resources */}
                  <div className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-4 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Paperclip className="h-4 w-4 text-emerald-500" />
                      File Attachments (PDFs, Slide decks, Spreadsheets)
                    </h4>
                    <div className="border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-4 rounded-lg text-center flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50 relative">
                      <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Click to select files to attach</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, Documents, and Spreadsheets</p>
                      <Input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>

                  {/* Resources Preview List */}
                  <div className="space-y-2.5">
                    <Label className="text-slate-700 font-bold dark:text-slate-300">Resource Items List</Label>
                    <div className="border rounded-xl p-3 bg-white dark:bg-slate-900 min-h-[140px] space-y-2">
                      {videos.map((res, i) => (
                        <div key={`video-${i}`} className="flex items-center justify-between p-2 border border-slate-100 rounded-lg hover:bg-slate-50 shadow-sm transition-colors">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-blue-100 dark:bg-blue-950/40 p-2 rounded-lg"><Video className="h-4 w-4 text-blue-500" /></div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[300px]">{res.title}</span>
                              <span className="text-[10px] text-blue-500 dark:text-blue-400 truncate max-w-[300px]">{res.url}</span>
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="icon" onClick={() => setVideos(videos.filter((_, idx) => idx !== i))} className="h-7 w-7 text-red-500 rounded-full hover:bg-red-50"><X className="h-4 w-4"/></Button>
                        </div>
                      ))}
                      {attachments.map((res, i) => (
                        <div key={`file-${i}`} className="flex items-center justify-between p-2 border border-slate-100 rounded-lg hover:bg-slate-50 shadow-sm transition-colors">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-emerald-100 dark:bg-emerald-950/40 p-2 rounded-lg"><MaterialIcon type={res.type} /></div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[300px]">{res.name}</span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">{res.type}</span>
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="icon" onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="h-7 w-7 text-red-500 rounded-full hover:bg-red-50"><X className="h-4 w-4"/></Button>
                        </div>
                      ))}
                      {videos.length === 0 && attachments.length === 0 && (
                        <div className="text-center py-10 text-slate-400 italic text-xs">
                          No videos or files added yet.
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* 3. Quiz Editor Tab */}
                <TabsContent value="quiz" className="space-y-4 m-0 focus:outline-none">
                  <div className="flex justify-between items-center bg-violet-50/50 border border-violet-100 p-3.5 rounded-xl dark:bg-violet-950/10 dark:border-violet-900/30">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-extrabold text-violet-800 dark:text-violet-400">AI Practice Quiz Generator</h4>
                      <p className="text-[10px] text-slate-500">Auto-create 5 pedagogical questions based on your topic title.</p>
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleAskAIQuiz} 
                      disabled={isGeneratingQuiz}
                      className="bg-violet-600 hover:bg-violet-500 text-white rounded-full font-bold text-xs px-4 py-2 flex items-center gap-1.5 shadow-md shadow-violet-500/20 active:scale-95 transition-all shrink-0"
                    >
                      {isGeneratingQuiz ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 fill-current" />}
                      Generate AI Questions (-3 Credits)
                    </Button>
                  </div>

                  {/* Practice Questions List */}
                  <div className="space-y-4">
                    {questions.map((q, i) => (
                      <div key={`question-${i}`} className="p-4 border rounded-xl bg-white dark:bg-slate-900/50 shadow-sm relative space-y-3.5">
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 text-red-500 h-7 w-7 rounded-full hover:bg-red-50" 
                          onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))}
                        >
                          <Trash2 className="w-4 h-4"/>
                        </Button>
                        
                        <div className="space-y-1 pr-6">
                          <Label className="text-xs text-slate-500 uppercase tracking-wider font-bold">Question {i + 1}</Label>
                          <Textarea 
                            value={q.question} 
                            onChange={(e) => updateQuestion(i, 'question', e.target.value)} 
                            placeholder="Type the question content..."
                            className="border-slate-200 focus:border-violet-500 rounded-lg min-h-16 text-xs h-16 leading-relaxed"
                          />
                        </div>

                        {/* Options Input */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-600">Answer Options</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {q.options.map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-1.5">
                                <span className="bg-slate-100 text-slate-700 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <Input 
                                  value={opt} 
                                  onChange={(e) => updateOption(i, optIdx, e.target.value)} 
                                  placeholder={`Option ${optIdx + 1}`} 
                                  className="border-slate-200 focus:border-violet-500 rounded-lg text-xs h-8"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Correct Answer Selection Button Group */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-600">Select Correct Answer</Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {q.options.map((opt, optIdx) => (
                              <Button
                                key={optIdx}
                                type="button"
                                variant={q.correctAnswer === opt && opt !== '' ? "default" : "outline"}
                                onClick={() => updateQuestion(i, 'correctAnswer', opt)}
                                disabled={!opt}
                                className="text-xs h-8 justify-start px-2 py-1 border-slate-200 text-left font-medium truncate"
                              >
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 w-4.5 h-4.5 rounded-full flex items-center justify-center mr-1.5 text-[9px] font-bold border shrink-0">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className="truncate">{opt || "(Option empty)"}</span>
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Explanation */}
                        <div className="space-y-1">
                          <Label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Answer Explanation (Optional)</Label>
                          <Input 
                            value={q.explanation || ''} 
                            onChange={(e) => updateQuestion(i, 'explanation', e.target.value)} 
                            placeholder="Explain why this option is correct..."
                            className="border-slate-200 focus:border-violet-500 rounded-lg text-xs h-8"
                          />
                        </div>
                      </div>
                    ))}

                    <Button type="button" variant="outline" onClick={handleAddQuestion} className="w-full border-dashed text-slate-500 hover:text-slate-800 py-3 text-xs flex items-center justify-center gap-1.5 rounded-xl border-2">
                      <Plus className="w-4 h-4"/> Add Question Manually
                    </Button>
                  </div>
                </TabsContent>

              </div>
            </ScrollArea>

            <DialogFooter className="shrink-0 border-t pt-4 mt-2">
              <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Saving Topic Folder...
                  </>
                ) : (
                  materialToEdit ? "Save Material Folder Changes" : "Create Learning Material Folder"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// --- INTERACTIVE QUIZ PLAYER COMPONENT ---
function QuizPlayer({ 
  quizQuestions, 
  topicTitle,
  onClose 
}: { 
  quizQuestions: RichQuizQuestion[]; 
  topicTitle: string;
  onClose: () => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const activeQuestion = quizQuestions[currentIdx];

  const handleSelectOption = (opt: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: opt }));
  };

  const handleSubmitQuiz = () => {
    let scoreCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        scoreCount++;
      }
    });
    setScore(scoreCount);
    setIsSubmitted(true);
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const percentage = Math.round((score / quizQuestions.length) * 100);

  return (
    <Card className="border-purple-200 dark:border-purple-900/50 shadow-md bg-white dark:bg-slate-950 overflow-hidden flex flex-col h-[520px]">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 shrink-0 flex justify-between items-center relative">
        <div className="space-y-0.5">
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
            Practice Quiz
          </span>
          <h3 className="font-extrabold text-sm md:text-base leading-tight text-white mt-1 truncate max-w-[320px]">
            {topicTitle}
          </h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 shrink-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col justify-between p-5 overflow-hidden">
        {!isSubmitted ? (
          // Quiz Playing Screen
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="space-y-4 overflow-y-auto pr-1">
              
              {/* Progress Tracker */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider shrink-0">
                <span>Question {currentIdx + 1} of {quizQuestions.length}</span>
                <span className="text-purple-600 dark:text-purple-400">
                  {Math.round(((currentIdx) / quizQuestions.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 shrink-0 dark:bg-slate-800">
                <div 
                  className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx) / quizQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shrink-0">
                <p className="text-sm md:text-base font-extrabold text-slate-800 dark:text-slate-100 leading-relaxed">
                  {activeQuestion.question}
                </p>
              </div>

              {/* Question Options */}
              <div className="space-y-2.5">
                {activeQuestion.options.map((opt, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isSelected = selectedAnswers[currentIdx] === opt;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(opt)}
                      className={cn(
                        "w-full p-3.5 rounded-xl border text-left text-xs md:text-sm font-semibold transition-all flex items-center gap-3.5 relative",
                        isSelected 
                          ? "bg-purple-50 border-purple-500 text-purple-900 dark:bg-purple-950/20 dark:border-purple-600 dark:text-purple-300" 
                          : "bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800/50"
                      )}
                    >
                      <span className={cn(
                        "w-6.5 h-6.5 rounded-lg flex items-center justify-center text-[10px] font-black border transition-colors shrink-0",
                        isSelected 
                          ? "bg-purple-500 text-white border-purple-600" 
                          : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                      )}>
                        {letter}
                      </span>
                      <span className="truncate">{opt}</span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Nav Controls */}
            <div className="flex justify-between items-center border-t pt-4 shrink-0 mt-3">
              <Button
                variant="outline"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="text-xs h-9 rounded-lg px-4"
              >
                Previous
              </Button>
              {currentIdx < quizQuestions.length - 1 ? (
                <Button
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  disabled={!selectedAnswers[currentIdx]}
                  className="text-xs h-9 bg-purple-600 text-white hover:bg-purple-500 rounded-lg px-4"
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                  className="text-xs h-9 bg-emerald-600 text-white hover:bg-emerald-500 rounded-lg px-4"
                >
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>
        ) : (
          // Scorecard and Review Panel
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-6 pb-4">
                
                {/* Score Graphic */}
                <div className="text-center p-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 opacity-5">
                    <Trophy className="h-32 w-32 text-amber-500" />
                  </div>
                  
                  {percentage >= 80 ? (
                    <Trophy className="h-10 w-10 text-amber-500 mb-2 animate-bounce" />
                  ) : (
                    <CheckCircle2 className="h-10 w-10 text-purple-500 mb-2" />
                  )}
                  
                  <h4 className="text-slate-800 dark:text-slate-200 text-lg font-black tracking-tight">Quiz Results</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    You scored **{score}** out of **{quizQuestions.length}** questions correct.
                  </p>
                  
                  <div className="mt-4 flex items-baseline gap-1 bg-white border shadow-sm dark:bg-slate-950 px-5 py-2 rounded-full">
                    <span className="text-3xl font-black text-purple-600">{percentage}%</span>
                    <span className="text-xs text-slate-400 font-bold">score</span>
                  </div>
                </div>

                {/* Question Review List */}
                <div className="space-y-4 mt-2">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-purple-500" /> Review Questions
                  </h4>
                  
                  {quizQuestions.map((q, idx) => {
                    const studentAnswer = selectedAnswers[idx];
                    const isCorrect = studentAnswer === q.correctAnswer;
                    return (
                      <div key={`review-${idx}`} className={cn(
                        "p-4 border rounded-xl shadow-sm bg-white dark:bg-slate-900/40 relative space-y-3",
                        isCorrect ? "border-emerald-200 dark:border-emerald-950" : "border-red-200 dark:border-red-950"
                      )}>
                        <div className="flex justify-between items-start gap-2 border-b pb-2">
                          <span className="text-xs font-bold text-slate-600">Question {idx + 1}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5 shadow-sm",
                            isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                          )}>
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="h-3 w-3" /> Correct
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3" /> Incorrect
                              </>
                            )}
                          </span>
                        </div>
                        
                        <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300 leading-relaxed">
                          {q.question}
                        </p>

                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1 text-slate-500">
                            <span>Your Answer:</span>
                            <span className={cn("font-bold", isCorrect ? "text-emerald-600" : "text-red-500")}>
                              {studentAnswer || "Not answered"}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div className="flex items-center gap-1 text-slate-500">
                              <span>Correct Answer:</span>
                              <span className="text-emerald-600 font-bold">
                                {q.correctAnswer}
                              </span>
                            </div>
                          )}
                        </div>

                        {q.explanation && (
                          <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 p-2.5 rounded-lg text-xs leading-relaxed text-slate-600 dark:text-slate-300 flex gap-2">
                            <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-bold text-amber-800 dark:text-amber-400">Explanation:</strong> {q.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            </ScrollArea>

            {/* Retry controls */}
            <div className="flex gap-2.5 border-t pt-4 mt-3 shrink-0">
              <Button variant="outline" onClick={handleResetQuiz} className="flex-1 text-xs rounded-xl flex items-center gap-1">
                <RotateCcw className="h-4 w-4" /> Try Again
              </Button>
              <Button onClick={onClose} className="flex-1 bg-purple-600 text-white hover:bg-purple-500 text-xs rounded-xl font-bold">
                Close Quiz
              </Button>
            </div>
          </div>
        )}
      </div>

    </Card>
  );
}

// --- MAIN PAGE ---
export default function LearningMaterialsPage() {
  const { user, isUserLoading } = useUser();
  const { role, profile } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | null>(null);
  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>(''); 

  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'content' | 'video' | 'files' | 'quiz'>('content');
  const [isPlayingQuiz, setIsPlayingQuiz] = useState(false);

  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role || '');

  // 1. Student Profile & Class ID
  const { data: studentData, isLoading: isStudentLoading } = useCollection<Student>(
    useMemoFirebase(() => (role === 'Student' && user && firestore && schoolId) ? query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, [role, user, firestore, schoolId])
  );
  const studentClassId = studentData?.[0]?.classId;

  // Determine which class ID to use for querying materials
  const activeClassId = role === 'Student' ? studentClassId : selectedClassId;

  // 2. Classes (for managers)
  const { data: classes } = useCollection<Class>(
    useMemoFirebase(() => (canManage && firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [canManage, firestore, schoolId])
  );

  // 3. Subjects
  const subjectsQuery = useMemoFirebase(() => firestore && schoolId ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: subjectsData, isLoading: isLoadingSubjects } = useCollection<{id:string, name:string}>(subjectsQuery);
  
  const subjectsList = useMemo(() => {
    const fallbackSubjects = [ "English Language", "French", "Ghanaian Language", "I.C.T", "Integrated Science", "Mathematics", "R.M.E", "Social Studies" ];
    const dbSubjects = subjectsData ? subjectsData.map(s => s.name) : [];
    return Array.from(new Set([...fallbackSubjects, ...dbSubjects])).sort();
  }, [subjectsData]);

  // 4. Materials Query (loads all class materials to aggregate counts)
  const { data: materials, isLoading: isLoadingMaterials, forceRefetch: forceRefetchMaterials } = useCollection<LearningMaterial>(
    useMemoFirebase(() => (firestore && activeClassId && schoolId) ? query(collection(firestore, 'learning_materials'), where('schoolId', '==', schoolId), where('classId', '==', activeClassId)) : null, [firestore, activeClassId, schoolId])
  );

  // Topic Count helper
  const getSubjectCount = (subName: string) => {
    if (!materials) return 0;
    return materials.filter(m => m.subject.toLowerCase() === subName.toLowerCase()).length;
  };

  // Filtered materials by current active subject
  const sortedMaterials = useMemo(() => {
    if (!materials || !currentSubject) return [];
    return materials
      .filter(m => m.subject.toLowerCase() === currentSubject.toLowerCase())
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }, [materials, currentSubject]);

  // Active topic logic
  useEffect(() => {
    if (sortedMaterials && sortedMaterials.length > 0 && !selectedTopicId) {
      setSelectedTopicId(sortedMaterials[0].id);
    }
  }, [sortedMaterials, selectedTopicId]);

  const activeTopic = useMemo(() => {
    if (!selectedTopicId || !sortedMaterials) return null;
    return sortedMaterials.find(m => m.id === selectedTopicId) || null;
  }, [selectedTopicId, sortedMaterials]);

  const handleDelete = async (id: string) => {
    try {
        await deleteDoc(doc(firestore!, 'learning_materials', id));
        toast({ title: "Deleted", description: "Learning material folder removed." });
        if (selectedTopicId === id) {
          setSelectedTopicId('');
        }
        forceRefetchMaterials();
    } catch (e) { toast({ variant: "destructive", title: "Error" }); }
  };

  const handleEdit = (mat: LearningMaterial) => {
      setEditingMaterial(mat);
      setIsFormOpen(true);
  };

  const handleCreate = () => {
      setEditingMaterial(null);
      setIsFormOpen(true);
  };

  // Subject Visual themes helper
  const getSubjectTheme = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('math')) {
      return {
        bg: 'from-violet-500/10 to-indigo-500/10 hover:border-indigo-500/50 hover:shadow-indigo-500/10',
        folderColor: 'text-indigo-500 fill-indigo-500/20 bg-indigo-50 dark:bg-indigo-950/20',
        icon: <Calculator className="h-8 w-8 text-indigo-500" />
      };
    }
    if (lower.includes('science')) {
      return {
        bg: 'from-emerald-500/10 to-green-500/10 hover:border-emerald-500/50 hover:shadow-emerald-500/10',
        folderColor: 'text-emerald-500 fill-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20',
        icon: <BookOpenCheck className="h-8 w-8 text-emerald-500" />
      };
    }
    if (lower.includes('english') || lower.includes('language') || lower.includes('french')) {
      return {
        bg: 'from-amber-500/10 to-orange-500/10 hover:border-amber-500/50 hover:shadow-amber-500/10',
        folderColor: 'text-amber-500 fill-amber-500/20 bg-amber-50 dark:bg-amber-950/20',
        icon: <BookOpen className="h-8 w-8 text-amber-500" />
      };
    }
    if (lower.includes('social') || lower.includes('history') || lower.includes('geography')) {
      return {
        bg: 'from-cyan-500/10 to-blue-500/10 hover:border-cyan-500/50 hover:shadow-cyan-500/10',
        folderColor: 'text-cyan-500 fill-cyan-500/20 bg-cyan-50 dark:bg-cyan-950/20',
        icon: <Globe className="h-8 w-8 text-cyan-500" />
      };
    }
    if (lower.includes('ict') || lower.includes('computing') || lower.includes('technology')) {
      return {
        bg: 'from-slate-500/10 to-slate-700/10 hover:border-slate-500/50 hover:shadow-slate-500/10',
        folderColor: 'text-slate-600 dark:text-slate-400 fill-slate-500/20 bg-slate-50 dark:bg-slate-900/50',
        icon: <Laptop className="h-8 w-8 text-slate-500" />
      };
    }
    if (lower.includes('rme') || lower.includes('religion') || lower.includes('moral')) {
      return {
        bg: 'from-purple-500/10 to-pink-500/10 hover:border-purple-500/50 hover:shadow-purple-500/10',
        folderColor: 'text-purple-500 fill-purple-500/20 bg-purple-50 dark:bg-purple-950/20',
        icon: <Sparkles className="h-8 w-8 text-purple-500" />
      };
    }
    return {
      bg: 'from-slate-500/5 to-slate-500/10 hover:border-slate-300 hover:shadow-slate-500/5',
      folderColor: 'text-slate-500 fill-slate-500/20 bg-slate-50 dark:bg-slate-900/50',
      icon: <Folder className="h-8 w-8 text-slate-500" />
    };
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const cleanUrl = url.trim();
    
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
      return `https://www.youtube.com/embed/${cleanUrl}`;
    }

    const m = cleanUrl.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/);
    if (m && m[2].length === 11) {
      return `https://www.youtube.com/embed/${m[2]}`;
    }

    const fallback = cleanUrl.match(/(?:v=|\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})(?:\?|&|$)/);
    if (fallback) {
      return `https://www.youtube.com/embed/${fallback[1]}`;
    }

    return null;
  };
  
  const pageLoading = isUserLoading || isLoadingSchool || (role === 'Student' && isStudentLoading) || isLoadingSubjects || (!!activeClassId && isLoadingMaterials);

  if (canManage && !activeClassId) {
      return (
          <div className="p-8 max-w-2xl mx-auto space-y-4">
              <Card className="border-slate-200 shadow-md">
                  <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Folder className="h-5 w-5 text-violet-600" />
                      Learning Materials Manager
                    </CardTitle>
                    <CardDescription>Select a class folder to review and manage learning resources.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                      <Label className="text-slate-700 font-bold dark:text-slate-300">Select Class</Label>
                      <Select onValueChange={setSelectedClassId}>
                          <SelectTrigger className="border-slate-200 mt-2 rounded-xl focus:border-violet-500 focus:ring-violet-500/20"><SelectValue placeholder="Select Class..." /></SelectTrigger>
                          <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id} className="cursor-pointer">{c.name}</SelectItem>)}</SelectContent>
                      </Select>
                  </CardContent>
              </Card>
          </div>
      )
  }

  if (pageLoading) {
      return (
          <div className="flex items-center justify-center p-20 flex-col gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
            <p className="text-xs text-slate-400 font-semibold animate-pulse">Loading pedagogical catalogs...</p>
          </div>
      )
  }
  
  if (role === 'Student' && !studentClassId && !pageLoading) {
      return (
          <div className="p-8 text-center bg-white border border-red-100 rounded-2xl shadow-md max-w-xl mx-auto mt-12 space-y-3">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h3 className="text-lg font-black text-slate-800">Class Folder Missing</h3>
              <p className="text-slate-500 text-sm">Your student profile is currently not mapped to any class grade.</p>
              <p className="text-xs text-red-400">Please reach out to the administrator to configure your enrollment status.</p>
          </div>
      );
  }

  // --- SUBJECTS VIEW SCREEN ---
  if (!currentSubject) {
      return (
        <div className="space-y-6 flex flex-col h-full">
            {/* Header banner */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 shadow-lg border border-purple-900/50">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Folder className="h-40 w-40 transform rotate-12 text-purple-300" />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-500/20 p-2 rounded-xl border border-purple-500/30">
                      <BookOpen className="h-6 w-6 text-purple-400" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Academics Catalog</h1>
                  </div>
                  <p className="text-slate-400 text-sm max-w-xl">
                    Access and organize study guides, lesson videos, PDFs, and practice tests.
                  </p>
                </div>
                <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
                  {canManage && (
                    <Button variant="outline" onClick={() => setSelectedClassId('')} className="bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-white rounded-xl">
                      Switch Class
                    </Button>
                  )}
                  {canManage && (
                    <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg border border-purple-500/50 rounded-xl flex items-center gap-2">
                      <Plus className="h-4.5 w-4.5"/> Add Material
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Folder Grid view */}
            <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">Subject Folders</h2>
                  <p className="text-xs text-slate-400">
                    Browsing files for <strong>{classes?.find(c => c.id === activeClassId)?.name || 'Class Grade'}</strong>
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
                    {subjectsList.map((subject, i) => {
                      const theme = getSubjectTheme(subject);
                      const fileCount = getSubjectCount(subject);
                      return (
                        <div 
                          key={`${subject}-${i}`} 
                          onClick={() => {
                            setCurrentSubject(subject);
                            setSelectedTopicId('');
                            setIsPlayingQuiz(false);
                          }} 
                          className={cn(
                            "p-5 rounded-2xl border bg-gradient-to-br bg-white dark:bg-slate-900 border-slate-200/80 shadow-sm cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 text-center group hover:-translate-y-1 hover:shadow-md",
                            theme.bg
                          )}
                        >
                          <div className={cn("p-4 rounded-2xl transition-all duration-300 relative group-hover:scale-110", theme.folderColor)}>
                            {theme.icon}
                            {fileCount > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white text-[9px] font-black w-5.5 h-5.5 rounded-full flex items-center justify-center shadow-sm border border-white">
                                {fileCount}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-extrabold text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-sm md:text-base">
                              {subject}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              {fileCount === 1 ? '1 Topic Folder' : `${fileCount} Topic Folders`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
            </div>

            {isFormOpen && schoolId && (
                <MaterialForm 
                    open={isFormOpen} 
                    setOpen={(val) => { setIsFormOpen(val); if(!val) setEditingMaterial(null); }} 
                    classes={classes ?? undefined}
                    materialToEdit={editingMaterial}
                    subjectsList={subjectsList}
                    preSelectedSubject={currentSubject || undefined}
                    preSelectedClassId={activeClassId || ''}
                    schoolId={schoolId}
                />
            )}
        </div>
      );
  }

  // --- TOPICS MASTER-DETAIL SCREEN ---
  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setCurrentSubject(null)} className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 shrink-0 p-0">
            <ArrowLeft className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              {currentSubject}
            </h1>
            <p className="text-xs text-slate-400">
              Folder items for {classes?.find(c => c.id === activeClassId)?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
          <CreditBalance />
          {canManage && (
            <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-md px-4 py-2 flex items-center gap-1.5 text-xs md:text-sm font-semibold active:scale-95 transition-all">
              <Plus className="h-4.5 w-4.5"/> Add Topic Folder
            </Button>
          )}
        </div>
      </div>

      {/* Main split grid */}
      {(!sortedMaterials || sortedMaterials.length === 0) ? (
        <div className="text-center py-20 text-slate-500 border border-dashed rounded-2xl bg-slate-50/50 dark:bg-slate-900/10">
            <BookOpen className="mx-auto h-12 w-12 mb-3 text-slate-300 animate-pulse"/>
            <h3 className="font-extrabold text-slate-700 dark:text-slate-300">No Topics Published</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              We couldn't find any learning materials topic folders published under the {currentSubject} catalog yet.
            </p>
            {canManage && (
              <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-500 mt-4 text-xs font-semibold rounded-xl text-white">
                Create First Topic Folder
              </Button>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          
          {/* Left panel: list of topics in subject */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Topic Folder Directory</span>
            </div>
            <ScrollArea className="h-[520px] pr-2">
              <div className="space-y-2.5">
                {sortedMaterials.map((mat) => {
                  const isSelected = mat.id === selectedTopicId;
                  const resourceCount = (mat.videoLinks?.length || 0) + (mat.attachments?.length || 0);
                  const questionsCount = mat.practiceQuestions?.length || 0;
                  return (
                    <div
                      key={mat.id}
                      onClick={() => {
                        setSelectedTopicId(mat.id);
                        setIsPlayingQuiz(false);
                        setActiveTab('content');
                      }}
                      className={cn(
                        "p-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-md hover:border-purple-300 dark:hover:border-purple-800 relative group",
                        isSelected 
                          ? "bg-purple-50/50 border-purple-500 shadow-sm dark:bg-purple-950/20 dark:border-purple-500" 
                          : "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-l-2xl" />
                      )}
                      
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 truncate text-sm md:text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {mat.topicTitle || (mat as any).title}
                        </h3>
                        {canManage && (
                          <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(mat);
                              }}
                              className="h-6 w-6 rounded-full hover:bg-slate-100"
                            >
                              <Edit className="h-3.5 w-3.5 text-slate-500" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-6 w-6 rounded-full text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Topic Folder?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the folder "<strong>{mat.topicTitle}</strong>"? This removes all study guides, video resources, and practice questions.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(mat.id);
                                    }} 
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete Permanently
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-1 leading-relaxed">
                        {mat.content ? mat.content.replace(/<[^>]*>/g, '') : "No notes content description available."}
                      </p>

                      <div className="flex flex-wrap gap-2 items-center mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-0.5">
                          <Paperclip className="h-3 w-3 text-slate-400" /> {resourceCount} {resourceCount === 1 ? 'resource' : 'resources'}
                        </span>
                        {questionsCount > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400">
                              <HelpCircle className="h-3 w-3 text-orange-400" /> {questionsCount} Practice Questions
                            </span>
                          </>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Right panel: dynamic details view & interactive quiz player */}
          <div className="lg:col-span-3">
            {activeTopic ? (
              isPlayingQuiz && activeTopic.practiceQuestions && activeTopic.practiceQuestions.length > 0 ? (
                // Quiz playing engine
                <QuizPlayer 
                  quizQuestions={activeTopic.practiceQuestions} 
                  topicTitle={activeTopic.topicTitle} 
                  onClose={() => setIsPlayingQuiz(false)} 
                />
              ) : (
                // Detail display
                <Card className="border-slate-200/80 shadow-md dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden flex flex-col h-[580px]">
                  
                  {/* Visual detail header */}
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 shrink-0 border-b border-indigo-950 relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <FolderOpen className="h-24 w-24" />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                      <div className="space-y-1 min-w-0">
                        <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                          Subject Topic Folder
                        </span>
                        <h2 className="text-lg md:text-xl font-black tracking-tight text-white mt-1.5 leading-tight truncate">
                          {activeTopic.topicTitle}
                        </h2>
                      </div>
                      
                      {activeTopic.practiceQuestions && activeTopic.practiceQuestions.length > 0 && (
                        <Button 
                          onClick={() => setIsPlayingQuiz(true)}
                          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-orange-500/20 shrink-0 flex items-center gap-1 active:scale-95 transition-all"
                        >
                          <Play className="h-4 w-4 fill-current" /> Start Practice Quiz
                        </Button>
                      )}
                    </div>

                    {/* Content Tabs Navigation */}
                    <div className="flex gap-4 mt-5 border-t border-white/10 pt-3 text-xs md:text-sm">
                      <button 
                        onClick={() => setActiveTab('content')}
                        className={cn(
                          "pb-1 border-b-2 font-semibold transition-all duration-200 flex items-center gap-1.5",
                          activeTab === 'content' 
                            ? "border-purple-400 text-purple-300" 
                            : "border-transparent text-slate-400 hover:text-slate-200"
                        )}
                      >
                        <FileText className="h-4 w-4" /> Study Guide
                      </button>
                      <button 
                        onClick={() => setActiveTab('video')}
                        className={cn(
                          "pb-1 border-b-2 font-semibold transition-all duration-200 flex items-center gap-1.5",
                          activeTab === 'video' 
                            ? "border-purple-400 text-purple-300" 
                            : "border-transparent text-slate-400 hover:text-slate-200"
                        )}
                      >
                        <Video className="h-4 w-4" /> Videos ({activeTopic.videoLinks?.length || 0})
                      </button>
                      <button 
                        onClick={() => setActiveTab('files')}
                        className={cn(
                          "pb-1 border-b-2 font-semibold transition-all duration-200 flex items-center gap-1.5",
                          activeTab === 'files' 
                            ? "border-purple-400 text-purple-300" 
                            : "border-transparent text-slate-400 hover:text-slate-200"
                        )}
                      >
                        <Paperclip className="h-4 w-4" /> Files ({activeTopic.attachments?.length || 0})
                      </button>
                      {activeTopic.practiceQuestions && activeTopic.practiceQuestions.length > 0 && (
                        <button 
                          onClick={() => setActiveTab('quiz')}
                          className={cn(
                            "pb-1 border-b-2 font-semibold transition-all duration-200 flex items-center gap-1.5",
                            activeTab === 'quiz' 
                              ? "border-purple-400 text-purple-300" 
                              : "border-transparent text-slate-400 hover:text-slate-200"
                          )}
                        >
                          <HelpCircle className="h-4 w-4" /> Quiz Questions ({activeTopic.practiceQuestions.length})
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Scrollable details view area */}
                  <ScrollArea className="flex-1 p-5 bg-slate-50/50 dark:bg-slate-900/10">
                    
                    {/* Tab 1: Content Notes */}
                    {activeTab === 'content' && (
                      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm rounded-xl p-5 min-h-[350px]">
                        <div className="flex items-center gap-2 mb-3 text-slate-700 dark:text-slate-300 font-bold border-b pb-2">
                          <Book className="h-4.5 w-4.5 text-purple-600" />
                          <h3>Pedagogical Content Description</h3>
                        </div>
                        <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-xs md:text-sm">
                          {activeTopic.content ? (
                            <div dangerouslySetInnerHTML={{ __html: activeTopic.content }} />
                          ) : (
                            <p className="text-slate-400 italic text-xs">No learning content study notes are written in this topic folder.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Videos Grid */}
                    {activeTab === 'video' && (
                      <div className="space-y-4">
                        {activeTopic.videoLinks && activeTopic.videoLinks.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeTopic.videoLinks.map((vid, i) => {
                              const embed = getEmbedUrl(vid.url);
                              return (
                                <div key={i} className="bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                                  {embed ? (
                                    <iframe src={embed} className="w-full aspect-video border-b" allowFullScreen title={vid.title} />
                                  ) : (
                                    <div className="aspect-video bg-black text-white flex items-center justify-center text-xs">Invalid Video Reference URL</div>
                                  )}
                                  <div className="p-3">
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{vid.title}</p>
                                    <a href={vid.url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 font-semibold hover:underline flex items-center gap-0.5 mt-1">
                                      Open on YouTube <ExternalLink className="h-2.5 w-2.5" />
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-16 text-slate-400 italic text-xs bg-white border border-dashed rounded-xl">
                            <Video className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                            No learning video files referenced.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tab 3: Downloads */}
                    {activeTab === 'files' && (
                      <div className="space-y-3">
                        {activeTopic.attachments && activeTopic.attachments.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {activeTopic.attachments.map((file, i) => (
                              <a 
                                key={i} 
                                href={file.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center justify-between p-3.5 bg-white border border-slate-200/60 rounded-xl hover:bg-slate-50 hover:border-purple-300 shadow-sm transition-all duration-200"
                              >
                                <div className="flex items-center gap-3 overflow-hidden pr-2">
                                  <div className="bg-slate-100 p-2 rounded-lg"><MaterialIcon type={file.type} /></div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{file.name}</span>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{file.type} resource</span>
                                  </div>
                                </div>
                                <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0"><ExternalLink className="h-4 w-4 text-purple-600" /></Button>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-16 text-slate-400 italic text-xs bg-white border border-dashed rounded-xl">
                            <Paperclip className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                            No document or worksheet attachments loaded.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tab 4: Static Quiz Questions Preview */}
                    {activeTab === 'quiz' && (
                      <div className="space-y-3">
                        {activeTopic.practiceQuestions && activeTopic.practiceQuestions.length > 0 ? (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center bg-orange-50 border border-orange-100 p-3 rounded-xl dark:bg-orange-950/10 dark:border-orange-900/30">
                              <span className="text-xs text-orange-800 dark:text-orange-400 font-semibold">{activeTopic.practiceQuestions.length} multiple choice questions are attached.</span>
                              <Button size="sm" onClick={() => setIsPlayingQuiz(true)} className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold px-3">
                                Start Practice Player
                              </Button>
                            </div>
                            {activeTopic.practiceQuestions.map((q, idx) => (
                              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-150 rounded-xl p-4 shadow-sm space-y-2">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Question {idx + 1} Preview</span>
                                <p className="text-xs md:text-sm font-extrabold text-slate-800 dark:text-slate-200 leading-relaxed">{q.question}</p>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  {q.options.map((opt, optIdx) => (
                                    <div key={optIdx} className={cn(
                                      "p-2 border rounded-lg text-xs font-semibold flex items-center gap-2",
                                      q.correctAnswer === opt ? "bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400" : "bg-white border-slate-150 dark:bg-slate-950"
                                    )}>
                                      <span className="text-[9px] w-4.5 h-4.5 rounded-full bg-slate-100 flex items-center justify-center border font-bold shrink-0 dark:bg-slate-800">{String.fromCharCode(65 + optIdx)}</span>
                                      <span className="truncate">{opt}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )}

                  </ScrollArea>
                </Card>
              )
            ) : (
              <Card className="border-slate-200/80 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/20 h-[580px] flex items-center justify-center p-6 text-center border-dashed">
                <div className="space-y-4 max-w-sm">
                  <div className="bg-purple-100 dark:bg-purple-950/40 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto text-purple-600 border border-purple-200 dark:border-purple-900/50">
                    <Book className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-200">No Folder Selected</h3>
                    <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                      Select a topic folder from the directory to read study guides, watch lessons, download files, or take practice quizzes.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

        </div>
      )}

      {/* Form Dialog */}
      {isFormOpen && schoolId && (
        <MaterialForm 
            open={isFormOpen} 
            setOpen={(val) => { setIsFormOpen(val); if(!val) setEditingMaterial(null); }} 
            classes={classes ?? undefined}
            materialToEdit={editingMaterial}
            subjectsList={subjectsList}
            preSelectedSubject={currentSubject || undefined}
            preSelectedClassId={activeClassId || ''}
            schoolId={schoolId}
        />
      )}
    </div>
  );
}
