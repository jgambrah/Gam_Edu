

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { 
  BookOpen, Edit, Loader2, Save, Plus, Trash2, 
  FileText, Video, HelpCircle, Paperclip, UploadCloud 
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LearningMaterial, Attachment, VideoLink, RichQuizQuestion } from '@/lib/types';


// --- CONSTANTS: The Structure You Provided ---
const PREDEFINED_STRANDS = [
  "STRAND 1: DIVERSITY OF MATTER",
  "STRAND 2: CYCLE",
  "STRAND 3: SYSTEMS",
  "STRAND 4: FORCES AND ENERGY",
  "STRAND 5: HUMAN AND THE ENVIRONMENT"
];

const PREDEFINED_SUBSTRANDS: Record<string, string[]> = {
  "STRAND 1: DIVERSITY OF MATTER": ["Sub-strand 1: Materials", "Sub-Strand 2: Living Cells"],
  "STRAND 2: CYCLE": ["Sub-strand 1: Earth Science", "Sub-strand 2: Life Cycle of life Organisms", "Sub-Strand 3: Crop Production", "Sub-strand 4: Animal Production"],
  "STRAND 3: SYSTEMS": ["Sub-strand 1: The Human Body System", "Sub-strand 2: Solar System", "Sub-strand 3: Ecosystem", "Sub-strand 4: Farming System"],
  "STRAND 4: FORCES AND ENERGY": ["Sub-strand 1: Energy", "Sub-Strand 2: Electricity and Electronics", "Sub-strand 3: Conversion and Conservation of Energy", "Sub-strand 4: Force and Motion", "Sub-strand 5: Agricultural Tools"],
  "STRAND 5: HUMAN AND THE ENVIRONMENT": ["Sub-strand 1: Waste Management", "Sub-strand 2: Human health", "Sub-strand 3: Science and Industry"]
};

// --- EDITOR COMPONENT (Handles Text, Files, Videos, Questions) ---
function MaterialEditorDialog({
  material,
  mode,
  open,
  setOpen,
}: {
  material?: LearningMaterial;
  mode: 'create' | 'edit';
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [strand, setStrand] = useState(material?.strand || PREDEFINED_STRANDS[0]);
  const [subStrand, setSubStrand] = useState(material?.subStrand || PREDEFINED_SUBSTRANDS[PREDEFINED_STRANDS[0]][0]);
  const [topicTitle, setTopicTitle] = useState(material?.topicTitle || '');
  const [content, setContent] = useState(material?.content || '');
  
  // Arrays
  const [videos, setVideos] = useState<VideoLink[]>(material?.videoLinks || []);
  const [attachments, setAttachments] = useState<Attachment[]>(material?.attachments || []);
  const [questions, setQuestions] = useState<RichQuizQuestion[]>(material?.practiceQuestions || []);

  // Temp Inputs
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');

  // Handle Strand Change to reset Sub-strand
  useEffect(() => {
    if (mode === 'create') {
        setSubStrand(PREDEFINED_SUBSTRANDS[strand]?.[0] || '');
    }
  }, [strand, mode]);

  // --- Handlers ---

  const handleAddVideo = () => {
    if (!newVideoUrl) return;
    setVideos([...videos, { title: newVideoTitle || 'Video Resource', url: newVideoUrl }]);
    setNewVideoUrl('');
    setNewVideoTitle('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // NOTE: In a real app, you would upload to Firebase Storage here.
      // For this demo, we fake the URL or use a Blob URL.
      // You need to implement `uploadBytes` from firebase/storage.
      const file = e.target.files[0];
      const fakeUrl = URL.createObjectURL(file); 
      
      const type = file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'IMAGE' : 'DOC';
      
      setAttachments([...attachments, { name: file.name, url: fakeUrl, type }]);
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

  const handleSave = async () => {
    if (!firestore) return;
    if (!topicTitle) {
        toast({ variant: "destructive", title: "Missing Title", description: "Please enter a topic title." });
        return;
    }

    setIsSaving(true);
    try {
      const dataToSave = {
        courseId: 'bs7-integrated-science',
        strand,
        subStrand,
        topicTitle,
        content, // This holds the pasted text/images HTML
        videoLinks: videos,
        attachments: attachments,
        practiceQuestions: questions,
      };

      if (mode === 'edit' && material) {
        const docRef = doc(firestore, 'learning_materials', material.id);
        await updateDocumentNonBlocking(docRef, { ...dataToSave, updatedAt: serverTimestamp() });
        toast({ title: 'Updated', description: 'Topic updated successfully.' });
      } else {
        await addDocumentNonBlocking(collection(firestore, 'learning_materials'), { ...dataToSave, createdAt: serverTimestamp() });
        toast({ title: 'Created', description: 'New topic created successfully.' });
      }
      setOpen(false);
    } catch (error) {
      // Error is now automatically emitted by the non-blocking-updates functions
      // The toast here is a fallback for non-permission errors
      if (!(error instanceof Error && error.name === 'FirebaseError')) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save.' });
      }
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{mode === 'create' ? 'Create New Topic' : 'Edit Topic'}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
            <div className="container mx-auto p-6 space-y-6">
                
                {/* 1. CLASSIFICATION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border">
                    <div className="space-y-2">
                        <Label>Strand</Label>
                        <Select value={strand} onValueChange={setStrand}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{PREDEFINED_STRANDS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Sub-strand</Label>
                        <Select value={subStrand} onValueChange={setSubStrand}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{(PREDEFINED_SUBSTRANDS[strand] || []).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Topic Title</Label>
                        <Input value={topicTitle} onChange={e => setTopicTitle(e.target.value)} placeholder="e.g. Introduction to Living Cells" />
                    </div>
                </div>

                <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="content"><FileText className="w-4 h-4 mr-2"/> Notes & Content</TabsTrigger>
                        <TabsTrigger value="media"><Video className="w-4 h-4 mr-2"/> Videos & Files</TabsTrigger>
                        <TabsTrigger value="quiz"><HelpCircle className="w-4 h-4 mr-2"/> Practice Questions</TabsTrigger>
                    </TabsList>

                    {/* CONTENT TAB */}
                    <TabsContent value="content" className="mt-4">
                        <Card>
                            <CardContent className="pt-6 h-[500px] flex flex-col">
                                <Label className="mb-2">Course Notes (Paste text & images here)</Label>
                                <Textarea 
                                    value={content} 
                                    onChange={(e) => setContent(e.target.value)} 
                                    className="flex-1 resize-none font-serif text-lg leading-relaxed p-4"
                                    placeholder="Start typing or paste your content here..."
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    Tip: You can copy and paste images directly into this area if your browser supports it, 
                                    though using the 'Videos & Files' tab is better for large documents.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* MEDIA TAB */}
                    <TabsContent value="media" className="mt-4 space-y-4">
                        <Card>
                            <CardHeader><CardTitle>YouTube Videos</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input placeholder="Video Title" value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} />
                                    <Input placeholder="YouTube URL" value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} />
                                    <Button onClick={handleAddVideo}><Plus className="w-4 h-4"/></Button>
                                </div>
                                <div className="space-y-2">
                                    {videos.map((v, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 border rounded bg-white">
                                            <span className="flex items-center gap-2"><Video className="w-4 h-4 text-red-500"/> {v.title}</span>
                                            <Button variant="ghost" size="sm" onClick={() => setVideos(videos.filter((_, idx) => idx !== i))}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Documents (PDF, Word, Images)</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Input type="file" onChange={handleFileUpload} className="w-full" />
                                </div>
                                <div className="space-y-2">
                                    {attachments.map((f, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 border rounded bg-white">
                                            <span className="flex items-center gap-2"><Paperclip className="w-4 h-4 text-blue-500"/> {f.name}</span>
                                            <Button variant="ghost" size="sm" onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* QUIZ TAB */}
                    <TabsContent value="quiz" className="mt-4">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between">
                                    <CardTitle>Question Bank</CardTitle>
                                    <Button onClick={handleAddQuestion} size="sm"><Plus className="w-4 h-4 mr-2"/> Add Question</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {questions.map((q, i) => (
                                    <div key={i} className="p-4 border rounded bg-slate-50 relative">
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
                                {questions.length === 0 && <p className="text-center text-muted-foreground">No practice questions added yet.</p>}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>

        <div className="p-4 border-t bg-white flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Material
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Main Page Component ---
export default function BS7IntegratedSciencePage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | undefined>(undefined);

  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role || '');

  const materialsQuery = useMemoFirebase(
    () => {
        if (!firestore) return null; // FIX: Add guard
        return query(
            collection(firestore, 'learning_materials'),
            where('courseId', '==', 'bs7-integrated-science'),
            orderBy('strand'),
            orderBy('subStrand')
        )
    },
    [firestore]
  );

  const { data: materials, isLoading } = useCollection<LearningMaterial>(materialsQuery);

  // Grouping Logic: Strand -> SubStrand -> Topics
  const groupedData = useMemo(() => {
    if (!materials) return {};
    const groups: Record<string, Record<string, LearningMaterial[]>> = {};

    materials.forEach(mat => {
        if (!mat.strand || !mat.subStrand) return;
        if (!groups[mat.strand]) groups[mat.strand] = {};
        if (!groups[mat.strand][mat.subStrand]) groups[mat.strand][mat.subStrand] = [];
        groups[mat.strand][mat.subStrand].push(mat);
    });
    return groups;
  }, [materials]);

  const handleEdit = (material: LearningMaterial) => {
      setSelectedMaterial(material);
      setEditorMode('edit');
      setEditorOpen(true);
  };

  const handleCreate = () => {
      setSelectedMaterial(undefined);
      setEditorMode('create');
      setEditorOpen(true);
  };

  // Helper to render YouTube embeds
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6"/> BS7 (JHS 1) Integrated Science
            </CardTitle>
            <CardDescription>Comprehensive learning materials, videos, and practice questions.</CardDescription>
          </div>
          {canManage && (
              <Button onClick={handleCreate}><Plus className="mr-2 h-4 w-4"/> Add New Topic</Button>
          )}
        </CardHeader>
      </Card>
      
      {isLoading ? (
        <div className="text-center p-12"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></div>
      ) : Object.keys(groupedData).length === 0 ? (
         <Card>
            <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No learning materials found for this course yet.</p>
                {canManage && <Button variant="link" onClick={handleCreate}>Click here to add the first topic</Button>}
            </CardContent>
         </Card>
      ) : (
        <div className="space-y-8">
            {/* Render Strands */}
            {Object.entries(groupedData).map(([strandName, subStrands]) => (
                <Card key={strandName} className="overflow-hidden">
                    <CardHeader className="bg-slate-100/50 py-4">
                        <CardTitle className="text-lg font-bold text-slate-800">{strandName}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Accordion type="single" collapsible className="w-full">
                            {/* Render Sub-Strands */}
                            {Object.entries(subStrands).map(([subStrandName, topics], idx) => (
                                <AccordionItem value={`${strandName}-${idx}`} key={subStrandName} className="border-b px-4">
                                    <AccordionTrigger className="text-md font-semibold text-slate-700 hover:text-primary">
                                        {subStrandName} <span className="ml-2 text-xs font-normal text-muted-foreground">({topics.length} topics)</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2 pb-6 space-y-4">
                                        {/* Render Topics */}
                                        {topics.map(topic => (
                                            <Card key={topic.id} className="border bg-slate-50/50 shadow-sm">
                                                <CardHeader className="py-3 px-4 flex flex-row justify-between items-center bg-white border-b">
                                                    <h4 className="font-bold text-primary flex items-center gap-2">
                                                        <BookOpen className="h-4 w-4"/> {topic.topicTitle}
                                                    </h4>
                                                    {canManage && <Button variant="ghost" size="sm" onClick={() => handleEdit(topic)}><Edit className="h-4 w-4"/></Button>}
                                                </CardHeader>
                                                <CardContent className="p-4 space-y-6">
                                                    
                                                    {/* 1. Content */}
                                                    <div className="prose prose-sm max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: topic.content }}/>

                                                    {/* 2. Attachments */}
                                                    {topic.attachments && topic.attachments.length > 0 && (
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-4 border-t">
                                                            {topic.attachments.map((file, i) => (
                                                                <a key={i} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 border rounded hover:bg-slate-100 transition-colors">
                                                                    <Paperclip className="h-4 w-4 text-blue-500"/>
                                                                    <span className="truncate text-sm font-medium">{file.name}</span>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* 3. Videos */}
                                                    {topic.videoLinks && topic.videoLinks.length > 0 && (
                                                        <div className="space-y-4 pt-4 border-t">
                                                            <h5 className="font-semibold text-sm flex items-center gap-2"><Video className="h-4 w-4"/> Video Resources</h5>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {topic.videoLinks.map((vid, i) => {
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
                                                    )}

                                                    {/* 4. Quiz Preview (User sees button to start quiz) */}
                                                    {topic.practiceQuestions && topic.practiceQuestions.length > 0 && (
                                                        <div className="pt-4 border-t flex justify-between items-center">
                                                            <span className="text-sm font-medium flex items-center gap-2"><HelpCircle className="h-4 w-4 text-orange-500"/> {topic.practiceQuestions.length} Practice Questions Available</span>
                                                            <Button variant="outline" size="sm">Start Practice Quiz</Button>
                                                        </div>
                                                    )}

                                                </CardContent>
                                            </Card>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}

      {/* Editor Modal */}
      {editorOpen && (
        <MaterialEditorDialog 
            open={editorOpen} 
            setOpen={setEditorOpen} 
            mode={editorMode} 
            material={selectedMaterial} 
        />
      )}
    </div>
  );
}

    

