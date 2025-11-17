'use client';

import { Suspense } from 'react';
import ClientBoundary from '../client-boundary';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { collection, doc } from 'firebase/firestore';
import { Loader2, PlusCircle } from 'lucide-react';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';
import { useRole } from '@/context/role-context';

const classFormSchema = z.object({
  name: z.string().min(1, { message: 'Class name is required.' }),
  description: z.string().optional(),
});

type ClassData = {
  id: string;
  name: string;
  description?: string;
};

function CreateClassForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof classFormSchema>>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof classFormSchema>) {
    setIsSubmitting(true);
    try {
      const classId = values.name.toLowerCase().replace(/\s+/g, '-');
      const classData = {
        name: values.name,
        description: values.description,
        teacherId: '',
        studentIds: [],
      };
      await setDocumentNonBlocking(doc(firestore, 'classes', classId), classData, { merge: true });

      toast({
        title: 'Class Created',
        description: `The class "${values.name}" has been successfully created.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while creating the class.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Grade 10 - Section A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of the class." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Class
        </Button>
      </form>
    </Form>
  );
}

function AcademicsPageContent() {
  const { role } = useRole();
  const firestore = useFirestore();
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const classesCollectionRef = useMemoFirebase(() => collection(firestore, 'classes'), [firestore]);
  const { data: classes, isLoading } = useCollection<ClassData>(classesCollectionRef);
  const canManageClasses = role === 'Director' || role === 'Administrator';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Class Management</CardTitle>
            <CardDescription>
              View, create, and manage academic classes.
            </CardDescription>
          </div>
          {canManageClasses && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Class</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to add a new class to the system.
                  </DialogDescription>
                </DialogHeader>
                <CreateClassForm setOpen={setCreateDialogOpen} />
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : classes && classes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((c) => (
                <Card key={c.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{c.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {c.description || 'No description available.'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No classes have been created yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AcademicsPage() {
  return (
    <ClientBoundary>
      <AcademicsPageContent />
    </ClientBoundary>
  );
}
