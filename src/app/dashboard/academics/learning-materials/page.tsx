'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, getDocs, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { getApp } from 'firebase/app';
import { Class, Student } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, Video, Link as LinkIcon, FileSpreadsheet, File, 
  Plus, Trash2, Edit, ExternalLink, Loader2, X, Folder, UploadCloud, Globe, ArrowLeft, BookOpen 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getAuth } from 'firebase/auth';
import { Badge } from '@/components/ui/badge';

// --- DATA TYPES ---
export type ResourceType = 'PDF' | 'Video' | 'Document' | 'Spreadsheet' | 'Link';

export interface ResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
}

export interface LearningMaterial {
  id: string;
  topicTitle: string;
  description?: string;
  classId: string;
  subject: string; 
  resources: ResourceItem[];
  uploadedBy: string;
  createdAt: any;
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
  subjectsList, // <--- PASSED FROM PARENT
  preSelectedSubject,
  preSelectedClassId
}: { 
  open: boolean; 
  setOpen: (o: boolean) => void; 
  materialToEdit?: LearningMaterial | null; 
  classes: Class[] | undefined;
  subjectsList: string[]; // <--- NEW PROP
  preSelectedSubject?: string;
  preSelectedClassId?: string;
}) {
  const firestore = useFirestore();
  const { user: hookUser } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingResource, setIsUploadingResource] = useState(false);

  const [topicTitle, setTopicTitle] = useState(materialToEdit?.topicTitle || '');
  const [description, setDescription] = useState(materialToEdit?.description || '');
  const [classId, setClassId] = useState(materialToEdit?.classId || preSelectedClassId || '');
  const [subject, setSubject] = useState(materialToEdit?.subject || preSelectedSubject || ''); 
  const [resources, setResources] = useState<ResourceItem[]>(materialToEdit?.resources || []);

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

  const handleAddResource = async () => {
    if (!tempTitle) {
        toast({ variant: 'destructive', title: 'Missing Info', description: 'Please describe this item.' });
        return;
    }
    if (inputType === 'link' && !tempUrl) {
        toast({ variant: 'destructive', title: 'Missing Link', description: 'Please enter the URL.' });
        return;
    }
    if (inputType === 'file' && !tempFile) {
        toast({ variant: 'destructive', title: 'Missing File', description: 'Please select a file.' });
        return;
    }

    setIsUploadingResource(true);
    let finalUrl = tempUrl;

    try {
        if (inputType === 'file' && tempFile) {
            const app = getApp(); 
            const storage = getStorage(app, "gs://studio-525105839-159e4.firebasestorage.app");
            const sanitizedName = tempFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const storageRef = ref(storage, `materials/${Date.now()}_${sanitizedName}`);
            const snapshot = await uploadBytes(storageRef, tempFile);
            finalUrl = await getDownloadURL(snapshot.ref);
        }

        const newItem: ResourceItem = {
            id: Date.now().toString(),
            type: tempType as ResourceType,
            title: tempTitle,
            url: finalUrl
        };

        setResources([...resources, newItem]);
        setTempTitle('');
        setTempUrl('');
        setTempFile(null);
        toast({ title: "Success", description: "Item added to the list." });

    } catch (error: any) {
        console.error(error);
        toast({ variant: 'destructive', title: "Upload Failed", description: error.message });
    } finally {
        setIsUploadingResource(false);
    }
  };

  const handleRemoveResource = (id: string) => {
      setResources(resources.filter(r => r.id !== id));
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

    if (resources.length === 0) {
        toast({ variant: 'destructive', title: 'Empty Topic', description: 'Please add at least one resource.' });
        return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        topicTitle,
        description,
        classId,
        subject,
        resources,
        uploadedBy: currentUser.uid,
        updatedAt: serverTimestamp(),
      };

      if (materialToEdit) {
        await updateDoc(doc(firestore, 'learning_materials', materialToEdit.id), data);
        toast({ title: 'Success', description: 'Topic updated successfully.' });
      } else {
        await addDoc(collection(firestore, 'learning_materials'), {
          ...data,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Success', description: 'Topic created successfully.' });
      }
      setOpen(false);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save.' });
      setIsSubmitting(false); 
    }
  };

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
                            {/* USE DYNAMIC LIST */}
                            {subjectsList.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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

          {/* Resource Builder (Same as before) */}
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
                        <Button type="button" onClick={handleAddResource} disabled={isUploadingResource}><Plus className="h-4 w-4"/></Button>
                    </div>
                </TabsContent>
                <TabsContent value="file">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1"><Label className="text-xs">Select File</Label><Input type="file" onChange={(e) => setTempFile(e.target.files ? e.target.files[0] : null)} className="cursor-pointer" /></div>
                        <Button type="button" onClick={handleAddResource} disabled={isUploadingResource || !tempFile}>
                            {isUploadingResource ? <Loader2 className="h-4 w-4 animate-spin"/> : <UploadCloud className="h-4 w-4"/>}
                        </Button>
                    </div>
                </TabsContent>
             </Tabs>
             <div className="space-y-2 mt-4 bg-white p-2 rounded border min-h-[100px]">
                {resources.length === 0 && <p className="text-sm text-muted-foreground text-center italic py-8">No resources added yet.</p>}
                {resources.map((res) => (
                    <div key={res.id} className="flex items-center justify-between p-2 border rounded-md shadow-sm hover:bg-slate-50">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-slate-100 p-2 rounded"><MaterialIcon type={res.type} /></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold truncate">{res.title}</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[200px] text-blue-500">{res.type}</span>
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveResource(res.id)}><X className="h-4 w-4 text-red-500"/></Button>
                    </div>
                ))}
             </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : `Save Topic (${resources.length} items)`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- MAIN PAGE ---
export default function LearningMaterialsPage() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | null>(null);
  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>(''); 

  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role);

  // --- FETCHING LOGIC ---
  
  // 1. Student Profile
  const [studentClassId, setStudentClassId] = useState<string | null>(null);
  const [isStudentLoading, setIsStudentLoading] = useState(true);

  useEffect(() => {
      async function fetchStudentProfile() {
          if (role !== 'Student' || !user || !firestore) {
              setIsStudentLoading(false);
              return;
          }
          try {
              const docRef = doc(firestore, 'students', user.uid);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                  setStudentClassId(docSnap.data().classId);
              }
          } catch (e) { console.error(e); } 
          finally { setIsStudentLoading(false); }
      }
      fetchStudentProfile();
  }, [role, user, firestore]);

  const activeClassId = role === 'Student' ? studentClassId : selectedClassId;

  // 2. Classes
  const { data: classes } = useCollection<Class>(
    useMemoFirebase(() => (canManage && firestore) ? query(collection(firestore, 'classes')) : null, [canManage, firestore])
  );

  // 3. SUBJECTS (Fetched dynamically)
  const subjectsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'subjects') : null, [firestore]);
  const { data: subjectsData, isLoading: isLoadingSubjects } = useCollection<{id:string, name:string}>(subjectsQuery);
  
  // Fallback list in case DB is empty
  const subjectsList = useMemo(() => {
      if (subjectsData && subjectsData.length > 0) {
          return subjectsData.map(s => s.name).sort();
      }
      return [
        "Integrated Science", "Mathematics", "English Language", 
        "Social Studies", "R.M.E", "I.C.T", "French", "Ghanaian Language"
      ];
  }, [subjectsData]);

  // 4. Materials Query
  const materialsQuery = useMemoFirebase(() => {
    if (!firestore || !activeClassId) return null;
    
    let baseQuery = query(
        collection(firestore, 'learning_materials'), 
        where('classId', '==', activeClassId)
    );

    if (currentSubject) {
        baseQuery = query(baseQuery, where('subject', '==', currentSubject));
    }

    return baseQuery;
  }, [firestore, activeClassId, currentSubject]);

  const { data: materials, isLoading: isLoadingMaterials } = useCollection<LearningMaterial>(materialsQuery);

  // Client-side Sort
  const sortedMaterials = useMemo(() => {
      if (!materials) return [];
      return materials.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }, [materials]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this topic?")) return;
    try {
        await deleteDoc(doc(firestore, 'learning_materials', id));
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
  
  const pageLoading = (role === 'Student' && isStudentLoading) || isLoadingMaterials || isLoadingSubjects;

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
                    {subjectsList.map((subject) => (
                        <div key={subject} onClick={() => setCurrentSubject(subject)} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 text-center group">
                            <div className="bg-blue-50 p-4 rounded-full group-hover:bg-blue-100 transition-colors"><Folder className="h-8 w-8 text-blue-500 fill-blue-500/20" /></div>
                            <h3 className="font-semibold text-slate-700 group-hover:text-blue-700">{subject}</h3>
                        </div>
                    ))}
                    {subjectsList.length === 0 && <p className="col-span-full text-center text-muted-foreground">No subjects defined.</p>}
                </CardContent>
            </Card>

            {isFormOpen && (
                <MaterialForm 
                    open={isFormOpen} 
                    setOpen={(val) => { setIsFormOpen(val); if(!val) setEditingMaterial(null); }} 
                    classes={classes}
                    materialToEdit={editingMaterial}
                    subjectsList={subjectsList} // PASS DYNAMIC LIST
                    preSelectedClassId={activeClassId || ''}
                />
            )}
        </div>
      );
  }

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
        <div className="grid grid-cols-1 gap-6">
            {sortedMaterials.map((mat) => (
                <Card key={mat.id} className="flex flex-col shadow-sm border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div><CardTitle className="text-lg">{mat.topicTitle || (mat as any).title}</CardTitle>{mat.description && <p className="text-sm text-slate-600 mt-1">{mat.description}</p>}</div>
                            {canManage && (<div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => handleEdit(mat)}><Edit className="h-4 w-4 text-slate-500" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(mat.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button></div>)}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                            {mat.resources && mat.resources.map((res, i) => (
                                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-lg border bg-white hover:bg-blue-50 hover:border-blue-300 transition-all group shadow-sm">
                                    <div className="mr-3 bg-slate-50 p-2 rounded-md group-hover:bg-white"><MaterialIcon type={res.type} /></div>
                                    <div className="flex-1 overflow-hidden"><p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 truncate">{res.title}</p><p className="text-xs text-slate-500">{res.type}</p></div>
                                    <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-blue-400"/>
                                </a>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2 pb-3 bg-slate-50/50 border-t flex justify-between text-xs text-slate-400"><span>{mat.resources?.length || 0} resources</span><span>Added: {mat.createdAt ? new Date(mat.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span></CardFooter>
                </Card>
            ))}
        </div>
      )}

      {isFormOpen && (
        <MaterialForm 
            open={isFormOpen} 
            setOpen={(val) => { setIsFormOpen(val); if(!val) setEditingMaterial(null); }} 
            classes={classes}
            materialToEdit={editingMaterial}
            subjectsList={subjectsList} // DYNAMIC LIST
            preSelectedSubject={currentSubject || undefined}
            preSelectedClassId={activeClassId || ''}
        />
      )}
    </div>
  );
}