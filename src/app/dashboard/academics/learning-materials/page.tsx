'use client';

import { useState } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
// NEW: Storage Imports
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { Class, Student } from '@/lib/types'; // Keep your existing imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Make sure you have this component
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, Video, Link as LinkIcon, FileSpreadsheet, File, 
  Plus, Trash2, Edit, ExternalLink, Loader2, X, FolderOpen, UploadCloud, Globe 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getAuth } from 'firebase/auth';
import { Badge } from '@/components/ui/badge';
import type { ResourceType, ResourceItem, LearningMaterial } from '@/lib/types';


// --- Helper: Icon Selector ---
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
  classes 
}: { 
  open: boolean; 
  setOpen: (o: boolean) => void; 
  materialToEdit?: LearningMaterial | null; 
  classes: Class[] | undefined;
}) {
  const firestore = useFirestore();
  const { user: hookUser } = useAuth();
  const { toast } = useToast();
  
  // Overall Form Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Resource Upload State
  const [isUploadingResource, setIsUploadingResource] = useState(false);

  // Main Topic State
  const [topicTitle, setTopicTitle] = useState(materialToEdit?.topicTitle || '');
  const [description, setDescription] = useState(materialToEdit?.description || '');
  const [classId, setClassId] = useState(materialToEdit?.classId || '');

  // Resources Array State
  const [resources, setResources] = useState<ResourceItem[]>(materialToEdit?.resources || []);

  // --- NEW: Toggle between Link and File ---
  const [inputType, setInputType] = useState<'link' | 'file'>('link');

  // Temporary Inputs
  const [tempType, setTempType] = useState<string>('PDF');
  const [tempTitle, setTempTitle] = useState('');
  const [tempUrl, setTempUrl] = useState(''); // For Links
  const [tempFile, setTempFile] = useState<File | null>(null); // For Files

  // Reset when opening
  useState(() => {
    if(open) {
        setIsSubmitting(false);
        setIsUploadingResource(false);
    }
  });

  // --- LOGIC: Add Resource (Uploads file if needed) ---
  const handleAddResource = async () => {
    if (!tempTitle) {
        toast({ variant: 'destructive', title: 'Missing Info', description: 'Please describe this item (e.g. "Lecture Notes").' });
        return;
    }

    if (inputType === 'link' && !tempUrl) {
        toast({ variant: 'destructive', title: 'Missing Link', description: 'Please enter the website URL.' });
        return;
    }

    if (inputType === 'file' && !tempFile) {
        toast({ variant: 'destructive', title: 'Missing File', description: 'Please select a file from your computer.' });
        return;
    }

    // Prepare for upload
    setIsUploadingResource(true);
    let finalUrl = tempUrl;

    try {
        // 1. Handle File Upload (if selected)
        if (inputType === 'file' && tempFile) {
            const storage = getStorage(); // Initialize Storage
            // Create a unique path: materials/{timestamp}_{filename}
            const storageRef = ref(storage, `materials/${Date.now()}_${tempFile.name}`);
            
            // Upload
            await uploadBytes(storageRef, tempFile);
            
            // Get URL
            finalUrl = await getDownloadURL(storageRef);
        }

        // 2. Add to Local List
        const newItem: ResourceItem = {
            id: Date.now().toString(),
            type: tempType as ResourceType,
            title: tempTitle,
            url: finalUrl
        };

        setResources([...resources, newItem]);
        
        // 3. Reset Input Fields
        setTempTitle('');
        setTempUrl('');
        setTempFile(null);
        toast({ title: "Item Added", description: inputType === 'file' ? "File uploaded and added to list." : "Link added to list." });

    } catch (error) {
        console.error("Upload Error", error);
        toast({ variant: 'destructive', title: "Upload Failed", description: "Check your internet connection or file size." });
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

    if (!topicTitle || !classId) {
        toast({ variant: 'destructive', title: 'Missing Fields', description: 'Topic Title and Class are required.' });
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
      console.error("Save Error:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save.' });
      setIsSubmitting(false); 
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{materialToEdit ? 'Edit Material Topic' : 'Create New Material Topic'}</DialogTitle>
          <DialogDescription>Create a collection of files and links for a specific topic.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4 overflow-y-auto flex-1 px-1">
          
          {/* 1. TOPIC DETAILS */}
          <div className="space-y-4 border p-4 rounded-md bg-slate-50">
              <h3 className="font-semibold text-sm text-slate-700">1. Topic Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Topic Title *</Label>
                    <Input required value={topicTitle} onChange={e => setTopicTitle(e.target.value)} placeholder="e.g. Science Week 3: Energy" />
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
                <Label>Instructions / Description</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Instructions for students..." className="h-20" />
              </div>
          </div>

          {/* 2. RESOURCE BUILDER */}
          <div className="space-y-4 border p-4 rounded-md bg-slate-50">
             <h3 className="font-semibold text-sm text-slate-700">2. Add Files & Links</h3>
             
             {/* TABS FOR UPLOAD TYPE */}
             <Tabs value={inputType} onValueChange={(v) => setInputType(v as 'link' | 'file')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="link"><Globe className="w-4 h-4 mr-2"/> External Link (YouTube, Drive)</TabsTrigger>
                    <TabsTrigger value="file"><UploadCloud className="w-4 h-4 mr-2"/> Upload from Computer</TabsTrigger>
                </TabsList>

                {/* SHARED INPUTS (Type & Title) */}
                <div className="grid grid-cols-12 gap-2 mb-2">
                    <div className="col-span-4 space-y-1">
                        <Label className="text-xs">Category</Label>
                        <Select value={tempType} onValueChange={setTempType}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PDF">PDF</SelectItem>
                                <SelectItem value="Video">Video</SelectItem>
                                <SelectItem value="Document">Word Doc</SelectItem>
                                <SelectItem value="Spreadsheet">Excel/Sheet</SelectItem>
                                <SelectItem value="Link">Website</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="col-span-8 space-y-1">
                        <Label className="text-xs">Description / Label</Label>
                        <Input value={tempTitle} onChange={e => setTempTitle(e.target.value)} placeholder="e.g. Worksheet 1" />
                    </div>
                </div>

                {/* LINK INPUT */}
                <TabsContent value="link">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1">
                            <Label className="text-xs">URL</Label>
                            <Input value={tempUrl} onChange={e => setTempUrl(e.target.value)} placeholder="https://youtube.com/..." />
                        </div>
                        <Button type="button" onClick={handleAddResource} disabled={isUploadingResource}>
                            <Plus className="h-4 w-4"/> Add
                        </Button>
                    </div>
                </TabsContent>

                {/* FILE INPUT */}
                <TabsContent value="file">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1">
                            <Label className="text-xs">Select File</Label>
                            <Input type="file" onChange={(e) => setTempFile(e.target.files ? e.target.files[0] : null)} className="cursor-pointer" />
                        </div>
                        <Button type="button" onClick={handleAddResource} disabled={isUploadingResource || !tempFile}>
                            {isUploadingResource ? <Loader2 className="h-4 w-4 animate-spin"/> : <UploadCloud className="h-4 w-4"/>}
                            {isUploadingResource ? 'Uploading...' : 'Upload & Add'}
                        </Button>
                    </div>
                </TabsContent>
             </Tabs>

             {/* LIST OF ADDED ITEMS */}
             <div className="space-y-2 mt-4 bg-white p-2 rounded border min-h-[100px]">
                {resources.length === 0 && <p className="text-sm text-muted-foreground text-center italic py-8">No resources added yet.</p>}
                {resources.map((res) => (
                    <div key={res.id} className="flex items-center justify-between p-2 border rounded-md shadow-sm hover:bg-slate-50">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-slate-100 p-2 rounded"><MaterialIcon type={res.type} /></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold truncate">{res.title}</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[200px] text-blue-500 underline">{res.type === 'Link' ? res.url : 'Stored File'}</span>
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveResource(res.id)}><X className="h-4 w-4 text-red-500"/></Button>
                    </div>
                ))}
             </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || isUploadingResource} className="w-full">
                {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Topic...</>
                ) : (
                    `Save Topic (${resources.length} items)`
                )}
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
  
  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role);

  // 1. Student Data (for class ID)
  const { data: studentData, isLoading: isStudentLoading } = useCollection<Student>(
    useMemoFirebase(() => {
        if (role !== 'Student' || !user || !firestore) return null;
        return query(collection(firestore, 'students'), where('uid', '==', user.uid));
    }, [user, role, firestore])
  );
  const studentClassId = studentData?.[0]?.classId;

  // 2. Classes (for Staff)
  const { data: classes } = useCollection<Class>(
    useMemoFirebase(() => (canManage && firestore) ? query(collection(firestore, 'classes')) : null, [canManage, firestore])
  );

  // 3. Materials Query
  const materialsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    if (canManage) return query(collection(firestore, 'learning_materials'), orderBy('createdAt', 'desc'));
    if (role === 'Student' && studentClassId) return query(collection(firestore, 'learning_materials'), where('classId', '==', studentClassId));
    return null;
  }, [firestore, canManage, role, studentClassId]);

  const { data: materials, isLoading } = useCollection<LearningMaterial>(materialsQuery);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this topic and all its resources?")) return;
    try {
        await deleteDoc(doc(firestore, 'learning_materials', id));
        toast({ title: "Deleted", description: "Topic removed." });
    } catch (e) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete." });
    }
  };

  const handleEdit = (mat: LearningMaterial) => {
      setEditingMaterial(mat);
      setIsFormOpen(true);
  };

  const handleCreate = () => {
      setEditingMaterial(null);
      setIsFormOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Learning Materials</CardTitle>
            <CardDescription>
                {canManage ? "Organize materials into topics for your classes." : "Access resources assigned to your class."}
            </CardDescription>
          </div>
          {canManage && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" /> Create New Topic
            </Button>
          )}
        </CardHeader>
        <CardContent>
            {isLoading || (role === 'Student' && isStudentLoading) ? (
                <div className="space-y-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            ) : (!materials || materials.length === 0) ? (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <FolderOpen className="mx-auto h-12 w-12 mb-2 opacity-50"/>
                    <p>No learning materials found.</p>
                    {role === 'Student' && !studentClassId && <p className="text-xs text-red-400 mt-2">You are not assigned to a class yet.</p>}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {materials.map((mat) => (
                        <Card key={mat.id} className="flex flex-col shadow-sm border-l-4 border-l-blue-500">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{mat.topicTitle || (mat as any).title}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {classes?.find(c => c.id === mat.classId)?.name || 'Unknown Class'}
                                        </CardDescription>
                                    </div>
                                    {canManage && (
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(mat)}><Edit className="h-4 w-4 text-slate-500" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(mat.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                        </div>
                                    )}
                                </div>
                                {mat.description && <p className="text-sm text-slate-600 mt-2">{mat.description}</p>}
                            </CardHeader>
                            
                            <CardContent className="flex-1 pb-4">
                                <div className="space-y-2">
                                    {/* Handle NEW structure (array) */}
                                    {mat.resources && mat.resources.length > 0 ? (
                                        mat.resources.map((res, i) => (
                                            <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" 
                                               className="flex items-center p-3 rounded-lg border bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-colors group">
                                                <div className="mr-3"><MaterialIcon type={res.type} /></div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 truncate">{res.title}</p>
                                                    <p className="text-xs text-slate-500">{res.type}</p>
                                                </div>
                                                <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-blue-400"/>
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No files attached.</p>
                                    )}
                                </div>
                            </CardContent>
                            
                            <CardFooter className="pt-2 pb-3 bg-slate-50/50 border-t">
                                <div className="flex justify-between w-full text-xs text-slate-400">
                                    <span>{mat.resources?.length || 0} items</span>
                                    <span>{mat.createdAt ? new Date(mat.createdAt?.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      {isFormOpen && (
        <MaterialForm 
            open={isFormOpen} 
            setOpen={(val) => { setIsFormOpen(val); if(!val) setEditingMaterial(null); }} 
            classes={classes}
            materialToEdit={editingMaterial}
        />
      )}
    </div>
  );
}
