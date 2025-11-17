'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRole } from '@/context/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Resource, resourceSchema } from '@/lib/types';
import { FileText, Film, Link as LinkIcon, Loader2, PlusCircle, Presentation } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

function ResourceCreationForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const classesQuery = useMemoFirebase(() => collection(firestore, 'classes'), [firestore]);
  const { data: classes } = useCollection<{id: string, name: string}>(classesQuery);

  const form = useForm<z.infer<typeof resourceSchema>>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: '',
      courseName: '',
      resourceType: 'Document',
      url: '',
    },
  });

  async function onSubmit(values: z.infer<typeof resourceSchema>) {
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'resources'), values);
      toast({
        title: 'Resource Added',
        description: `"${values.title}" has been added to ${values.courseName}.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error adding resource:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while adding the resource.',
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Chapter 1: The Cell" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="courseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes?.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
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
          name="resourceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Document">Document</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Presentation">Presentation</SelectItem>
                  <SelectItem value="Link">Link</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/resource.pdf" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Add Resource
        </Button>
      </form>
    </Form>
  );
}


export default function ResourcesPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const canManage = role === 'Administrator' || role === 'Teacher';

  const resourcesQuery = useMemoFirebase(() => collection(firestore, 'resources'), [firestore]);
  const { data: resources, isLoading } = useCollection<Resource>(resourcesQuery);

  const groupedResources = useMemo(() => {
    if (!resources) return {};
    return resources.reduce((acc, resource) => {
      (acc[resource.courseName] = acc[resource.courseName] || []).push(resource);
      return acc;
    }, {} as Record<string, Resource[]>);
  }, [resources]);

  const getIcon = (type: Resource['resourceType']) => {
    switch (type) {
      case 'Document': return <FileText className="h-5 w-5 text-muted-foreground" />;
      case 'Video': return <Film className="h-5 w-5 text-muted-foreground" />;
      case 'Presentation': return <Presentation className="h-5 w-5 text-muted-foreground" />;
      case 'Link': return <LinkIcon className="h-5 w-5 text-muted-foreground" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Learning Resources</h1>
            <p className="text-muted-foreground">A repository of materials for all courses.</p>
        </div>
        {canManage && (
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Resource
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Learning Resource</DialogTitle>
                <DialogDescription>Fill out the form below to add a new document, video, or link.</DialogDescription>
              </DialogHeader>
              <ResourceCreationForm setOpen={setDialogOpen} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      ) : Object.keys(groupedResources).length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groupedResources).map(([courseName, courseResources]) => (
            <Card key={courseName}>
              <CardHeader>
                <CardTitle>{courseName}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {courseResources.map((resource) => (
                    <li key={resource.id}>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                        {getIcon(resource.resourceType)}
                        <span className="text-sm font-medium">{resource.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg font-semibold text-muted-foreground">No resources have been added yet.</p>
          {canManage && <p className="text-muted-foreground">Click "Add New Resource" to get started.</p>}
        </div>
      )}
    </div>
  );
}
