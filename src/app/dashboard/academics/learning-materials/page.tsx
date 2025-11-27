
'use client';

import { useState } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { LearningMaterial, Class, Student } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FileText, Video, Link as LinkIcon, FileSpreadsheet, File, Plus, Trash2, Edit, ExternalLink, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// --- Helper: Icon Selector ---
const MaterialIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'PDF': return <FileText className="h-10 w-10 text-red-500" />;
    case 'Video': return <Video className="h-10 w-10 text-blue-500" />;
    case 'Spreadsheet': return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
    case 'Link': return <LinkIcon className="h-10 w-10 text-slate-500" />;
    default: return <File className="h-10 w-10 text-gray-500" />;
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState(materialToEdit?.title || '');
  const [description, setDescription] = useState(materialToEdit?.description || '');
  const [type, setType] = useState<string>(materialToEdit?.type || 'PDF');
  const [classId, setClassId] = useState(materialToEdit?.classId || '');
  const [url, setUrl] = useState(materialToEdit?.url || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) return;
    setIsSubmitting(true);

    try {
      const data = {
        title,
        description,
        type,
        url,
        classId,
        uploadedBy: user.uid,
        updatedAt: serverTimestamp(),
      };

      if (materialToEdit) {
        // Update existing
        await updateDoc(doc(firestore, 'learning_materials', materialToEdit.id), data);
        toast({ title: 'Success', description: 'Material updated successfully.' });
      } else {
        // Create new
        await addDoc(collection(firestore, 'learning_materials'), {
          ...data,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Success', description: 'Material added successfully.' });
      }
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save material.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{materialToEdit ? 'Edit Material' : 'Add Learning Material'}</DialogTitle>
          <DialogDescription>Share resources, documents, or links with your students.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Algebra Formulas" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PDF">PDF Document</SelectItem>
                        <SelectItem value="Video">Video / YouTube</SelectItem>
                        <SelectItem value="Document">Word Document</SelectItem>
                        <SelectItem value="Link">External Website</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Assign to Class</Label>
                <Select value={classId} onValueChange={setClassId}>
                    <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                    <SelectContent>
                        {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Resource Link / URL</Label>
            <Input required value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
            <p className="text-xs text-muted-foreground">Paste a Google Drive link, YouTube link, or file URL here.</p>
          </div>

          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description..." />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Material
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
  
  // Permissions
  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role);

  // 1. Fetch Student Data (If role is Student) to get their Class ID
  const { data: studentData, isLoading: isStudentLoading } = useCollection<Student>(
    useMemoFirebase(() => {
        if (role !== 'Student' || !user || !firestore) return null;
        return query(collection(firestore, 'students'), where('uid', '==', user.uid));
    }, [user, role, firestore])
  );
  const studentClassId = studentData?.[0]?.classId;

  // 2. Fetch Classes (For the Dropdown in Add Form - only needed for Staff)
  const { data: classes } = useCollection<Class>(
    useMemoFirebase(() => (canManage && firestore) ? query(collection(firestore, 'classes')) : null, [canManage, firestore])
  );

  // 3. Fetch Materials
  const materialsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    
    // Teachers/Admins see ALL materials (or filter by teacherId if you prefer)
    if (canManage) {
        return query(collection(firestore, 'learning_materials'), orderBy('createdAt', 'desc'));
    }

    // Students only see materials for their assigned class
    if (role === 'Student' && studentClassId) {
        return query(collection(firestore, 'learning_materials'), where('classId', '==', studentClassId));
    }

    return null;
  }, [firestore, canManage, role, studentClassId]);

  const { data: materials, isLoading } = useCollection<LearningMaterial>(materialsQuery);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;
    try {
        await deleteDoc(doc(firestore, 'learning_materials', id));
        toast({ title: "Deleted", description: "Material removed." });
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
                {canManage ? "Upload and manage course resources." : "Access resources assigned to your class."}
            </CardDescription>
          </div>
          {canManage && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add Material
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
                    <File className="mx-auto h-10 w-10 mb-2 opacity-50"/>
                    <p>No learning materials found.</p>
                    {role === 'Student' && !studentClassId && <p className="text-xs text-red-400 mt-2">You are not assigned to a class yet.</p>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {materials.map((mat) => (
                        <Card key={mat.id} className="flex flex-col hover:shadow-md transition-shadow">
                            <CardHeader className="flex-row gap-4 items-start space-y-0 pb-2">
                                <div className="bg-slate-100 p-2 rounded-md">
                                    <MaterialIcon type={mat.type} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-semibold truncate" title={mat.title}>{mat.title}</h4>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {classes?.find(c => c.id === mat.classId)?.name || 'Unknown Class'}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 py-2">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {mat.description || "No description provided."}
                                </p>
                            </CardContent>
                            <CardFooter className="pt-2 flex justify-between border-t bg-slate-50/50">
                                <Button variant="outline" size="sm" asChild>
                                    <a href={mat.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-3 w-3" /> Open
                                    </a>
                                </Button>
                                
                                {canManage && (
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(mat)}>
                                            <Edit className="h-4 w-4 text-blue-600" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(mat.id)}>
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </CardContent>
      </Card>

      {/* Reusable Form Dialog */}
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
