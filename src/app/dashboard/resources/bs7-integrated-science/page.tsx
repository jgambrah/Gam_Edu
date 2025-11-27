'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, query, where, orderBy, addDoc } from 'firebase/firestore';
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
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { BookOpen, Edit, Loader2, Save } from 'lucide-react';
import type { LearningMaterial } from '@/lib/types';

// --- Edit Dialog Component ---
function EditMaterialDialog({
  material,
  open,
  setOpen,
}: {
  material: LearningMaterial;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [content, setContent] = useState(material.content);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setContent(material.content);
  }, [material]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(firestore, 'learning_materials', material.id);
      await updateDocumentNonBlocking(docRef, { content });
      toast({ title: 'Success', description: 'Content has been updated.' });
      setOpen(false);
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save changes.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit: {material.subStrandTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full resize-none"
            placeholder="Enter course content here... You can paste text and images."
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
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
  const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | null>(null);

  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role);

  const materialsQuery = useMemoFirebase(
    () =>
      query(
        collection(firestore, 'learning_materials'),
        where('courseId', '==', 'bs7-integrated-science'),
        orderBy('strand')
      ),
    [firestore]
  );

  const { data: materials, isLoading } = useCollection<LearningMaterial>(materialsQuery);

  const groupedMaterials = useMemo(() => {
    if (!materials) return {};
    return materials.reduce((acc, material) => {
      (acc[material.strand] = acc[material.strand] || []).push(material);
      return acc;
    }, {} as Record<string, LearningMaterial[]>);
  }, [materials]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen />
            BS7 (JHS 1) Integrated Science
          </CardTitle>
          <CardDescription>
            Course notes and materials for BS7 Integrated Science. Click on a
            strand to expand its topics.
          </CardDescription>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="text-center p-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground mt-2">Loading course materials...</p>
        </div>
      ) : Object.keys(groupedMaterials).length === 0 ? (
         <Card>
            <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No learning materials found for this course yet.</p>
                {canManage && <p className="text-sm text-muted-foreground mt-2">You can add content in the Firestore database under the 'learning_materials' collection.</p>}
            </CardContent>
         </Card>
      ) : (
        Object.entries(groupedMaterials).map(([strand, subStrands]) => (
            <Card key={strand}>
            <CardHeader>
                <CardTitle>{strand}</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                {subStrands.map((material, index) => (
                    <AccordionItem value={`item-${index}`} key={material.id}>
                    <AccordionTrigger>
                        <div className="flex justify-between items-center w-full pr-4">
                            <span>{material.subStrandTitle}</span>
                            {canManage && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingMaterial(material);
                                    }}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: material.content }}
                        />
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </CardContent>
            </Card>
        ))
      )}

      {editingMaterial && (
        <EditMaterialDialog
          material={editingMaterial}
          open={!!editingMaterial}
          setOpen={() => setEditingMaterial(null)}
        />
      )}
    </div>
  );
}
