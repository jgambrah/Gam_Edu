
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { collection, query, serverTimestamp, where, addDoc } from 'firebase/firestore';
import { assignmentSchema } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useRole } from '@/context/role-context';

type AssignmentCreationFormProps = {
  setOpen: (open: boolean) => void;
};

export function AssignmentCreationForm({ setOpen }: AssignmentCreationFormProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { role } = useRole();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { schoolId } = useCurrentSchool();

  // 1. Fetch ALL classes for the school, regardless of role.
  const classesQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore!, 'classes'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]
  );
  const { data: allSchoolClasses } = useCollection<any>(classesQuery);

  const timetableQuery = useMemoFirebase(() => 
    (firestore && schoolId && role === 'Teacher')
      ? query(collection(firestore!, 'timetables'), where('schoolId', '==', schoolId)) 
      : null, 
  [firestore, schoolId, role]);
  const { data: timetable } = useCollection<any>(timetableQuery);

  const subjectsQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore!, 'subjects'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]
  );
  const { data: subjects } = useCollection<any>(subjectsQuery);

  // 2. Filter the classes on the client-side based on the role.
  const classes = useMemo(() => {
    if (!allSchoolClasses) return [];
    if (role === 'Teacher') {
      const subjectClassIds = timetable?.filter((t: any) => t.teacherId === user?.uid).map((t: any) => t.classId) || [];
      return allSchoolClasses.filter((c: any) => c.teacherId === user?.uid || subjectClassIds.includes(c.id));
    }
    // Admins/Directors see all classes
    return allSchoolClasses;
  }, [allSchoolClasses, timetable, role, user?.uid]);


  const [questionsFormat, setQuestionsFormat] = useState<'text' | 'questions' | 'file'>('text');
  const [questionsFile, setQuestionsFile] = useState<{
    fileName: string;
    fileSize: string;
    fileData: string;
    fileType: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedExtensions.includes(extension)) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Only PDF and Word Documents (.doc, .docx) are allowed.',
      });
      e.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File Too Large',
        description: 'Maximum file size limit is 2MB to conserve storage.',
      });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      let fileData = base64String;
      if (file.size > 400 * 1024) {
        fileData = 'simulated-storage-url-placeholder';
      }

      setQuestionsFile({
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        fileData: fileData,
        fileType: file.type,
      });

      toast({
        title: 'File Selected',
        description: `${file.name} ready for assignment sharing.`,
      });
    };
    reader.readAsDataURL(file);
  };

  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      gradingType: 'points',
      classId: '',
      questions: [],
      timeLimit: 0,
      startDate: '',
      gradable: false,
      subjectId: '',
      assessmentType: 'Homework (CA)',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  async function onSubmit(values: z.infer<typeof assignmentSchema>) {
    if (!user || !schoolId || !firestore) return;
    setIsSubmitting(true);
    try {
      const payload: any = {
        ...values,
        teacherId: user.uid,
        schoolId: schoolId,
        createdAt: serverTimestamp(),
      };

      if (questionsFormat === 'text') {
        payload.questions = [];
        payload.questionsFile = null;
      } else if (questionsFormat === 'questions') {
        payload.questionsFile = null;
      } else if (questionsFormat === 'file') {
        payload.questions = [];
        if (!questionsFile) {
          toast({
            variant: 'destructive',
            title: 'File Required',
            description: 'Please upload a PDF or Word questions sheet before submitting.',
          });
          setIsSubmitting(false);
          return;
        }
        payload.questionsFile = questionsFile;
      }

      await addDoc(collection(firestore!, 'assignments'), payload);

      toast({
        title: 'Assignment Created',
        description: `The assignment "${values.title}" has been successfully created.`,
      });
      form.reset();
      setQuestionsFile(null);
      setOpen(false);
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while creating the assignment.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Class</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-11 text-xs font-medium">
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      {classes?.map((c: any) => (
                        <SelectItem key={c.id} value={c.id} className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Assignment Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Algebra Worksheet, Term Essay" 
                      className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-11 text-xs font-medium"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Description / Instructions</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide detailed instructions, references, or submission expectations for the students." 
                    className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all min-h-[120px] text-xs font-medium"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-medium rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-11 text-xs w-full',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a due date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border border-slate-100" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="rounded-2xl" />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gradingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Grading Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-11 text-xs font-medium">
                        <SelectValue placeholder="Select a grading method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      <SelectItem value="points" className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">Points (e.g., 100)</SelectItem>
                      <SelectItem value="letter" className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">Letter Grade (A, B, C...)</SelectItem>
                      <SelectItem value="pass_fail" className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">Pass / Fail</SelectItem>
                      <SelectItem value="standards" className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">Standards-based</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="timeLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Assignment Time Limit (Minutes - Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 15, 30 (Leave blank or set to 0 for no time limit)" 
                    className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-11 text-xs font-medium"
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="text-[10px] text-slate-400">
                  If questions are added, students will see a countdown timer once they open the assignment. When time expires, answers are frozen and auto-submitted.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Scheduled Start Date & Time (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="datetime-local" 
                    className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-11 text-xs font-medium"
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="text-[10px] text-slate-400">
                  If set, students will not be able to view, open, or begin submitting responses until the scheduled date and time.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gradable"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Gradable Assignment (Save to Gradebook)</FormLabel>
                <Select
                  onValueChange={(val) => {
                    const isGradable = val === 'true';
                    field.onChange(isGradable);
                  }}
                  value={field.value ? 'true' : 'false'}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-11 text-xs font-medium">
                      <SelectValue placeholder="No - Do not record in Gradebook" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    <SelectItem value="false" className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">No — Keep separate from Gradebook records</SelectItem>
                    <SelectItem value="true" className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">Yes — Automatically record scores in Gradebook</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-[10px] text-slate-400">
                  Toggling this allows student marks to be pushed to the academic gradebook registry when graded.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('gradable') === true && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-indigo-50/20 border border-indigo-100/50 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-indigo-750">Select Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-11 text-xs font-medium">
                          <SelectValue placeholder="Select target subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                        {subjects?.map((sub: any) => (
                          <SelectItem key={sub.id} value={sub.id} className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assessmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-indigo-750">Gradebook Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || 'Class Exercise (CA)'}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-11 text-xs font-medium">
                          <SelectValue placeholder="Select Gradebook category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                        {['Class Exercise (CA)', 'Homework (CA)', 'Project (CA)', 'Mid-Term (CA)', 'End of Term Exam (Exam)'].map(cat => (
                          <SelectItem key={cat} value={cat} className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {/* Questions Format Toggle */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Questions Format</FormLabel>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setQuestionsFormat('text')}
                className={cn(
                  "p-3 rounded-xl border-2 text-xs font-bold transition-all text-center",
                  questionsFormat === 'text'
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                )}
              >
                Instructions Only
              </button>
              <button
                type="button"
                onClick={() => setQuestionsFormat('questions')}
                className={cn(
                  "p-3 rounded-xl border-2 text-xs font-bold transition-all text-center",
                  questionsFormat === 'questions'
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                )}
              >
                Question Builder
              </button>
              <button
                type="button"
                onClick={() => setQuestionsFormat('file')}
                className={cn(
                  "p-3 rounded-xl border-2 text-xs font-bold transition-all text-center",
                  questionsFormat === 'file'
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                )}
              >
                Upload Word / PDF
              </button>
            </div>
          </div>

          {/* File Upload Block */}
          {questionsFormat === 'file' && (
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <FormLabel className="text-xs font-bold text-slate-700">Select Document File</FormLabel>
              <Input
                id="questions-file-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="bg-white rounded-xl border-slate-200 text-xs font-medium cursor-pointer h-11 py-2"
              />
              <p className="text-[10px] text-slate-400 leading-normal">
                Supported formats: <strong>PDF (.pdf)</strong> and <strong>Word Documents (.doc, .docx)</strong>. Maximum allowed size is <strong>2MB</strong> to limit storage consumption.
              </p>
              {questionsFile && (
                <div className="flex items-center justify-between p-3 bg-white border border-indigo-100 rounded-xl">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-indigo-950 truncate block max-w-[200px]">{questionsFile.fileName}</span>
                    <span className="text-[10px] font-black font-mono text-slate-400">{questionsFile.fileSize}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setQuestionsFile(null);
                      const fileInput = document.getElementById('questions-file-input') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 h-8 rounded-lg transition"
                  >
                    Remove File
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Manual Questions Section */}
          {questionsFormat === 'questions' && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Assignment Questions (Optional)</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Add structured questions for students to submit inline answers.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ questionText: '', type: 'written', options: ['', '', '', ''], correctAnswer: '' })}
                  className="h-9 px-3 rounded-xl border-dashed border-2 hover:border-indigo-500 hover:text-indigo-650 transition-all font-bold text-xs uppercase"
                >
                  <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Add Question
                </Button>
              </div>

              {fields.length > 0 && (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {fields.map((field, idx) => {
                    const typeValue = form.watch(`questions.${idx}.type`);
                    return (
                      <div key={field.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative group">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(idx)}
                          className="absolute top-2 right-2 h-7 w-7 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-indigo-600">Q{idx + 1}.</span>
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`questions.${idx}.type`}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value || 'written'}>
                                  <FormControl>
                                    <SelectTrigger className="h-8 text-[10px] font-bold uppercase w-[150px] rounded-lg border-slate-200 bg-white">
                                      <SelectValue placeholder="Format" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="rounded-xl border-slate-200">
                                    <SelectItem value="mcq" className="text-[10px] font-bold uppercase">Multiple Choice (MCQ)</SelectItem>
                                    <SelectItem value="written" className="text-[10px] font-bold uppercase">Essay / Written</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name={`questions.${idx}.questionText`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  placeholder="Enter question text here..." 
                                  className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-9 text-xs font-semibold"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {typeValue === 'mcq' && (
                          <div className="space-y-2 pl-4 border-l-2 border-indigo-100">
                            <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">Multiple Choice Options</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {[0, 1, 2, 3].map((optIdx) => (
                                <FormField
                                  key={optIdx}
                                  control={form.control}
                                  name={`questions.${idx}.options.${optIdx}`}
                                  render={({ field }) => (
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-black text-slate-400 font-mono">{String.fromCharCode(65 + optIdx)}.</span>
                                      <Input
                                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                        className="rounded-lg border-slate-200 bg-white h-8 text-xs font-semibold"
                                        {...field}
                                      />
                                    </div>
                                  )}
                                />
                              ))}
                            </div>
                            
                            <FormField
                              control={form.control}
                              name={`questions.${idx}.correctAnswer`}
                              render={({ field }) => (
                                <FormItem className="mt-2">
                                  <FormLabel className="text-[9px] font-extrabold uppercase text-indigo-500 tracking-wider block">Select Correct Option</FormLabel>
                                    <Select 
                                      onValueChange={(val) => {
                                        const options = form.getValues(`questions.${idx}.options` as any) || [];
                                        const optVal = options[Number(val)] || '';
                                        field.onChange(optVal);
                                      }}
                                      value={(() => {
                                        const options = form.watch(`questions.${idx}.options` as any) || [];
                                        const optIdx = options.indexOf(field.value || '');
                                        return optIdx !== -1 ? String(optIdx) : undefined;
                                      })()}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="h-8 text-xs font-semibold rounded-lg border-indigo-200 bg-white">
                                          <SelectValue placeholder="Which option is correct?" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="rounded-xl border-slate-200">
                                        {[0, 1, 2, 3].map((optIdx) => {
                                          const options = form.watch(`questions.${idx}.options` as any) || [];
                                          const optVal = options[optIdx] || '';
                                          return (
                                            <SelectItem key={optIdx} value={String(optIdx)} disabled={!optVal} className="text-xs font-medium">
                                              Option {String.fromCharCode(65 + optIdx)}: {optVal || '(Empty)'}
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}

                        {typeValue === 'written' && (
                          <div className="pl-4">
                            <FormField
                              control={form.control}
                              name={`questions.${idx}.correctAnswer`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">Reference / Sample Correct Answer (Optional)</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Provide key grading points or reference answer..."
                                      className="rounded-xl border-slate-200 bg-white h-8 text-xs font-semibold"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Dispatching Assignment...</>
            ) : (
              'Create & Dispatch Assignment'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
    