
'use client';

import { useState } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Class, Student } from '@/lib/types'; // Keep your existing imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, Video, Link as LinkIcon, FileSpreadsheet, File, 
  Plus, Trash2, Edit, ExternalLink, Loader2, X, FolderOpen 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getAuth } from 'firebase/auth';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Main Topic State
  const [topicTitle, setTopicTitle] = useState(materialToEdit?.topicTitle || '');
  const [description, setDescription] = useState(materialToEdit?.description || '');
  const [classId, setClassId] = useState(materialToEdit?.classId || '');

  // Resources Array State
  const [resources, setResources] = useState<ResourceItem[]>(materialToEdit?.resources || []);

  // Temporary State for the "Add Resource" inputs
  const [tempType, setTempType] = useState<string>('PDF');
  const [tempTitle, setTempTitle] = useState('');
  const [tempUrl, setTempUrl] = useState('');

  // Reset function when modal opens
  useState(() => {
    if(open) setIsSubmitting(false);
  });

  const handleAddResource = () => {
    if (!tempTitle || !tempUrl) {
        toast({ variant: 'destructive', title: 'Missing Info', description: 'Please enter a description and link for the item.' });
        return;
    }

    const newItem: ResourceItem = {
        id: Date.now().toString(),
        type: tempType as ResourceType,
        title: tempTitle,
        url: tempUrl
    };

    setResources([...resources, newItem]);
    
    // Clear inputs for next item
    setTempTitle('');
    setTempUrl('');
    toast({ title: "Item Added", description: "Added to list. Don't forget to save the topic!" });
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
        toast({ variant: 'destructive', title: 'Empty Topic', description: 'Please add at least one video, file, or link.' });
        return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        topicTitle,
        description,
        classId,
        resources, // Save the array
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
          <DialogDescription>Create a folder of resources (PDFs, Videos, etc) for a specific topic.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4 overflow-y-auto flex-1 px-1">
          
          {/* 1. TOPIC DETAILS */}
          <div className="space-y-4 border p-4 rounded-md bg-slate-50">
              <h3 className="font-semibold text-sm text-slate-700">1. Topic Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Topic Title *</Label>
                    <Input required value={topicTitle} onChange={e => setTopicTitle(e.target.value)} placeholder="e.g. Photosynthesis Master Class" />
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
                <Label>General Instructions / Description</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Read the PDF first, then watch the video..." className="h-20" />
              </div>
          </div>

          {/* 2. RESOURCE BUILDER */}
          <div className="space-y-4 border p-4 rounded-md bg-slate-50">
             <h3 className="font-semibold text-sm text-slate-700">2. Add Resources</h3>
             
             {/* INPUTS */}
             <div className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-3 space-y-1">
                    <Label className="text-xs">Type</Label>
                    <Select value={tempType} onValueChange={setTempType}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PDF">PDF</SelectItem>
                            <SelectItem value="Video">Video / YouTube</SelectItem>
                            <SelectItem value="Document">Word Doc</SelectItem>
                            <SelectItem value="Spreadsheet">Excel</SelectItem>
                            <SelectItem value="Link">Website Link</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="col-span-4 space-y-1">
                    <Label className="text-xs">Description / Label</Label>
                    <Input value={tempTitle} onChange={e => setTempTitle(e.target.value)} placeholder="e.g. Intro Video" />
                </div>
                <div className="col-span-4 space-y-1">
                    <Label className="text-xs">Link / URL</Label>
                    <Input value={tempUrl} onChange={e => setTempUrl(e.target.value)} placeholder="https://..." />
                </div>
                <div className="col-span-1">
                    <Button type="button" onClick={handleAddResource} size="icon" className="w-full"><Plus className="h-4 w-4"/></Button>
                </div>
             </div>

             {/* LIST OF ADDED ITEMS */}
             <div className="space-y-2 mt-4">
                {resources.length === 0 && <p className="text-sm text-muted-foreground text-center italic py-4">No resources added yet.</p>}
                {resources.map((res, index) => (
                    <div key={res.id} className="flex items-center justify-between bg-white p-2 border rounded-md shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-slate-100 p-2 rounded"><MaterialIcon type={res.type} /></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold truncate">{res.title}</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">{res.url}</span>
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveResource(res.id)}><X className="h-4 w-4 text-red-500"/></Button>
                    </div>
                ))}
             </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
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
                                    ) : (mat as any).url ? (
                                        // BACKWARD COMPATIBILITY for items created in the previous step
                                        <a href={(mat as any).url} target="_blank" rel="noopener noreferrer" 
                                           className="flex items-center p-3 rounded-lg border bg-amber-50 hover:bg-amber-100 transition-colors">
                                            <div className="mr-3"><MaterialIcon type={(mat as any).type} /></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Single Resource</p>
                                                <p className="text-xs text-slate-500">Legacy Item</p>
                                            </div>
                                            <ExternalLink className="h-4 w-4 text-slate-400"/>
                                        </a>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No files attached.</p>
                                    )}
                                </div>
                            </CardContent>
                            
                            <CardFooter className="pt-2 pb-3 bg-slate-50/50 border-t">
                                <div className="flex justify-between w-full text-xs text-slate-400">
                                    <span>{mat.resources?.length || ((mat as any).url ? 1 : 0)} items</span>
                                    <span>Added by Staff</span>
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

    