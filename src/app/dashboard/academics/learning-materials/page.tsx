'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, getDocs, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { getApp } from 'firebase/app';
import { Class, Student } from '@/lib/types';
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
  Plus, Trash2, Edit, ExternalLink, Loader2, X, Folder, UploadCloud, Globe, ArrowLeft, BookOpen, Paperclip, HelpCircle 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getAuth } from 'firebase/auth';
import { Badge } from '@/components/ui/badge';
import { LearningMaterial, Attachment, VideoLink, RichQuizQuestion } from '@/lib/types';
import { updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useCurrentSchool } from '@/hooks/use-current-school';


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
  const { user: hookUser } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingResource, setIsUploadingResource] = useState(false);

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
  const [tempFile, setTempFile] = useState<File | null>(null);

  useState(() => {
    if(open) {
        setIsSubmitting(false);
        setIsUploadingResource(false);
    }
  });
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const handleAddVideo = () => {
    if (!newVideoUrl) return;
    setVideos([...videos, { title: newVideoTitle || 'Video Resource', url: newVideoUrl }]);
    setNewVideoUrl('');
    setNewVideoTitle('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fakeUrl = URL.createObjectURL(file); 
      const type = file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'IMAGE' : 'DOC';
      setAttachments([...attachments, { name: file.name, url: fakeUrl, type: type as any }]);
      toast({ title: "File Selected", description: "In production, this would upload to Storage." });
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

  const [resources, setResources] = useState<ResourceItem[]>([]);

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
        strand,
        subStrand,
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
        toast({ title: 'Success', description: 'Topic updated successfully.' });
      } else {
        dataToSave.createdAt = serverTimestamp();
        dataToSave.courseId = 'bs7-integrated-science';
        await addDocumentNonBlocking(collection(firestore, 'learning_materials'), dataToSave);
        toast({ title: 'Success', description: 'Topic created successfully.' });
      }
      setOpen(false);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save.' });
      setIsSubmitting(false); 
    }
  };

  const strand = "STRAND 1: DIVERSITY OF MATTER";
  const subStrand = "Sub-strand 1: Materials";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{materialToEdit ? 'Edit Material' : 'Add Learning Material'}</DialogTitle>
          <DialogDescription>Create a topic folder containing multiple resources.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4 overflow-y-auto flex-1 px-1">
          <div className="space-y-4 border p-4 rounded-md bg-slate-50">
              <h3 className="font-semibold text-sm text-slate-700">1. Organization</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Subject *</Label>
                    <Select value={subject} onValueChange={setSubject}>
                        <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                        <SelectContent>
                            {subjectsList.map((s, i) => <SelectItem key={`${s}-${i}`} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Assign to Class *</Label>
                    <Select value={classId} onValueChange={setClassId}>
                        <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                        <SelectContent>
                            {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
              </div>
              <div className="space-y-2">
                    <Label>Topic Title *</Label>
                    <Input required value={topicTitle} onChange={e => setTopicTitle(e.target.value)} placeholder="e.g. Diversity of Matter" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description..." className="h-16" />
              </div>
          </div>

          <div className="space-y-4 border p-4 rounded-md bg-slate-50">
             <h3 className="font-semibold text-sm text-slate-700">2. Add Resources</h3>
             <Tabs value={inputType} onValueChange={(v) => setInputType(v as 'link' | 'file')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="link"><Globe className="w-4 h-4 mr-2"/> External Link</TabsTrigger>
                    <TabsTrigger value="file"><UploadCloud className="w-4 h-4 mr-2"/> Upload File</TabsTrigger>
                </TabsList>
                <div className="grid grid-cols-12 gap-2 mb-2">
                    <div className="col-span-4 space-y-1">
                        <Label className="text-xs">Type</Label>
                        <Select value={tempType} onValueChange={setTempType}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PDF">PDF</SelectItem>
                                <SelectItem value="Video">Video</SelectItem>
                                <SelectItem value="Document">Word Doc</SelectItem>
                                <SelectItem value="Spreadsheet">Excel</SelectItem>
                                <SelectItem value="Link">Website</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="col-span-8 space-y-1">
                        <Label className="text-xs">File Name / Label</Label>
                        <Input value={tempTitle} onChange={e => setTempTitle(e.target.value)} placeholder="e.g. Course Notes" />
                    </div>
                </div>
                <TabsContent value="link">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1"><Label className="text-xs">URL</Label><Input value={tempUrl} onChange={e => setTempUrl(e.target.value)} placeholder="https://..." /></div>
                        <Button type="button" onClick={handleAddVideo} disabled={isUploadingResource}><Plus className="h-4 w-4"/></Button>
                    </div>
                </TabsContent>
                <TabsContent value="file">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1"><Label className="text-xs">Select File</Label><Input type="file" onChange={handleFileUpload} className="cursor-pointer" /></div>
                    </div>
                </TabsContent>
             </Tabs>
             <div className="space-y-2 mt-4 bg-white p-2 rounded border min-h-[100px]">
                {videos.map((res, i) => (
                    <div key={i} className="flex items-center justify-between p-2 border rounded-md shadow-sm hover:bg-slate-50">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-slate-100 p-2 rounded"><MaterialIcon type={'Video'} /></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold truncate">{res.title}</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[200px] text-blue-500">Video</span>
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setVideos(videos.filter((_, idx) => idx !== i))}><X className="h-4 w-4 text-red-500"/></Button>
                    </div>
                ))}
                 {attachments.map((res, i) => (
                    <div key={i} className="flex items-center justify-between p-2 border rounded-md shadow-sm hover:bg-slate-50">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-slate-100 p-2 rounded"><MaterialIcon type={res.type} /></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold truncate">{res.name}</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[200px] text-blue-500">{res.type}</span>
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}><X className="h-4 w-4 text-red-500"/></Button>
                    </div>
                ))}
                {videos.length === 0 && attachments.length === 0 && <p className="text-sm text-muted-foreground text-center italic py-8">No resources added yet.</p>}
             </div>
          </div>
          
           <div className="space-y-4 border p-4 rounded-md bg-slate-50">
             <h3 className="font-semibold text-sm text-slate-700">3. Practice Questions</h3>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {questions.map((q, i) => (
                    <div key={i} className="p-4 border rounded bg-white relative">
                        <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500" onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))}><Trash2 className="w-4 h-4"/></Button>
                        <div className="space-y-2 mb-4">
                            <Label>Question {i + 1}</Label>
                            <Textarea value={q.question} onChange={(e) => updateQuestion(i, 'question', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, optIdx) => (
                                <Input key={optIdx} value={opt} onChange={(e) => updateOption(i, optIdx, e.target.value)} placeholder={`Option ${optIdx + 1}`} />
                            ))}
                        </div>
                        <div className="mt-2">
                            <Label>Correct Answer (Must match an option exactly)</Label>
                            <Input value={q.correctAnswer} onChange={(e) => updateQuestion(i, 'correctAnswer', e.target.value)} />
                        </div>
                    </div>
                ))}
              </div>
            <Button type="button" variant="outline" onClick={handleAddQuestion}><Plus className="w-4 h-4 mr-2"/> Add Question</Button>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : `Save Topic`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- MAIN PAGE ---
export default function LearningMaterialsPage() {
  const { user, isUserLoading } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | null>(null);
  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>(''); 

  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role);

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
    const fallbackSubjects = [ "Integrated Science", "Mathematics", "English Language", "Social Studies", "R.M.E", "I.C.T", "French", "Ghanaian Language" ];
    const dbSubjects = subjectsData ? subjectsData.map(s => s.name) : [];
    return Array.from(new Set([...fallbackSubjects, ...dbSubjects])).sort();
  }, [subjectsData]);

  // 4. Materials Query
  const materialsQuery = useMemoFirebase(() => {
    if (!firestore || !activeClassId || !schoolId) return null;
    let q = query(collection(firestore, 'learning_materials'), where('schoolId', '==', schoolId), where('classId', '==', activeClassId));
    if (currentSubject) {
        q = query(q, where('subject', '==', currentSubject));
    }
    return q;
  }, [firestore, activeClassId, currentSubject, schoolId]);

  const { data: materials, isLoading: isLoadingMaterials } = useCollection<LearningMaterial>(materialsQuery);

  const sortedMaterials = useMemo(() => {
      if (!materials) return [];
      return materials.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }, [materials]);

  const handleDelete = async (id: string) => {
    try {
        await deleteDoc(doc(firestore!, 'learning_materials', id));
        toast({ title: "Deleted" });
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
  
  const pageLoading = isUserLoading || isLoadingSchool || (role === 'Student' && isStudentLoading) || isLoadingSubjects || (!!activeClassId && isLoadingMaterials);

  if (canManage && !activeClassId) {
      return (
          <div className="p-8 max-w-2xl mx-auto space-y-4">
              <Card>
                  <CardHeader><CardTitle>Learning Materials Manager</CardTitle><CardDescription>Select a class to manage materials.</CardDescription></CardHeader>
                  <CardContent>
                      <Label>Select Class</Label>
                      <Select onValueChange={setSelectedClassId}>
                          <SelectTrigger><SelectValue placeholder="Select Class..." /></SelectTrigger>
                          <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                      </Select>
                  </CardContent>
              </Card>
          </div>
      )
  }

  if (pageLoading) {
      return (
          <div className="flex items-center justify-center p-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
      )
  }
  
  if (role === 'Student' && !studentClassId && !pageLoading) {
      return (
          <div className="p-8 text-center">
              <p className="text-muted-foreground">Your class assignment could not be found.</p>
              <p className="text-sm text-red-400">Please contact your administrator.</p>
          </div>
      );
  }


  if (!currentSubject) {
      return (
        <div className="space-y-6 p-6">
            <Card className="bg-slate-50 border-slate-200">
                <CardHeader className="flex flex-row justify-between items-center pb-2">
                    <div>
                        <CardTitle>Subject Folders</CardTitle>
                        <CardDescription>Materials for <strong>{classes?.find(c => c.id === activeClassId)?.name || (role === 'Student' ? 'Your Class' : 'Selected Class')}</strong></CardDescription>
                    </div>
                    <div className="flex gap-2">
                        {canManage && <Button variant="outline" onClick={() => setSelectedClassId('')}>Switch Class</Button>}
                        {canManage && <Button onClick={handleCreate}><Plus className="mr-2 h-4 w-4"/> Add Material</Button>}
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                    {subjectsList.map((subject, i) => (
                        <div key={`${subject}-${i}`} onClick={() => setCurrentSubject(subject)} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 text-center group">
                            <div className="bg-blue-50 p-4 rounded-full group-hover:bg-blue-100 transition-colors"><Folder className="h-8 w-8 text-blue-500 fill-blue-500/20" /></div>
                            <h3 className="font-semibold text-slate-700 group-hover:text-blue-700">{subject}</h3>
                        </div>
                    ))}
                    {(subjectsData?.length || 0) === 0 && <p className="col-span-full text-center text-muted-foreground">No subjects defined.</p>}
                </CardContent>
            </Card>

            {isFormOpen && schoolId && (
                <MaterialForm 
                    open={isFormOpen} 
                    setOpen={(val) => { setIsFormOpen(val); if(!val) setEditingMaterial(null); }} 
                    classes={classes}
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

  const getEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setCurrentSubject(null)} className="gap-2 pl-0 hover:bg-transparent hover:text-blue-600"><ArrowLeft className="h-4 w-4" /> Back to Subjects</Button>
          <h1 className="text-2xl font-bold text-slate-800">{currentSubject}</h1>
      </div>

      <div className="flex justify-end">
         {canManage && <Button onClick={handleCreate}><Plus className="mr-2 h-4 w-4"/> Add Topic to {currentSubject}</Button>}
      </div>

      {(!sortedMaterials || sortedMaterials.length === 0) ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50/50">
            <BookOpen className="mx-auto h-12 w-12 mb-2 opacity-30"/>
            <p>No topics found for {currentSubject}.</p>
            {canManage && <Button variant="link" onClick={handleCreate}>Create the first topic</Button>}
        </div>
      ) : (
        <div className="space-y-6">
            {sortedMaterials.map((mat) => (
                <Card key={mat.id} className="flex flex-col shadow-sm border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div><CardTitle className="text-lg">{mat.topicTitle || (mat as any).title}</CardTitle>{mat.content && <p className="text-sm text-slate-600 mt-1">{mat.content.substring(0, 100)}...</p>}</div>
                            {canManage && (
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(mat)}><Edit className="h-4 w-4 text-slate-500" /></Button>
                                    
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="sm" className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Topic?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete the topic "<strong>{mat.topicTitle}</strong>"? This will remove all associated notes, videos, and questions.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(mat.id)} className="bg-red-600 hover:bg-red-700">Delete Permanently</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 pb-4">
                        <div className="prose prose-sm max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: mat.content }}/>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-4 border-t">
                            {mat.attachments && mat.attachments.map((file, i) => (
                                <a key={i} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 border rounded hover:bg-slate-100 transition-colors">
                                    <Paperclip className="h-4 w-4 text-blue-500"/>
                                    <span className="truncate text-sm font-medium">{file.name}</span>
                                </a>
                            ))}
                        </div>
                        <div className="space-y-4 pt-4 border-t">
                             {mat.videoLinks && mat.videoLinks.length > 0 && <h5 className="font-semibold text-sm flex items-center gap-2"><Video className="h-4 w-4"/> Video Resources</h5>}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {mat.videoLinks && mat.videoLinks.map((vid, i) => {
                                    const embed = getEmbedUrl(vid.url);
                                    return (
                                        <div key={i} className="space-y-1">
                                            {embed ? (
                                                <iframe src={embed} className="w-full aspect-video rounded border" allowFullScreen title={vid.title}/>
                                            ) : (
                                                <div className="h-40 bg-black text-white flex items-center justify-center rounded">Invalid Video URL</div>
                                            )}
                                            <p className="text-xs font-medium text-center">{vid.title}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        {mat.practiceQuestions && mat.practiceQuestions.length > 0 && (
                            <div className="pt-4 border-t flex justify-between items-center">
                                <span className="text-sm font-medium flex items-center gap-2"><HelpCircle className="h-4 w-4 text-orange-500"/> {mat.practiceQuestions.length} Practice Questions Available</span>
                                <Button variant="outline" size="sm">Start Practice Quiz</Button>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="pt-2 pb-3 bg-slate-50/50 border-t flex justify-between text-xs text-slate-400"><span>Added: {mat.createdAt ? new Date(mat.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span></CardFooter>
                </Card>
            ))}
        </div>
      )}

      {isFormOpen && schoolId && (
        <MaterialForm 
            open={isFormOpen} 
            setOpen={(val) => { setIsFormOpen(val); if(!val) setEditingMaterial(null); }} 
            classes={classes}
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
