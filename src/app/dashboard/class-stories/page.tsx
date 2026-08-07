'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Class, Student } from '@/lib/types';
import { ClassStoryFeed } from '@/components/dashboard/ClassStoryFeed';
import { ClassStoryComposer } from '@/components/dashboard/ClassStoryComposer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Plus, Sparkles, Award, Filter, Layers, Users, BookOpen } from 'lucide-react';

export default function ClassStoriesPage() {
  const { role } = useRole();
  const { schoolId } = useCurrentSchool();
  const firestore = useFirestore();

  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL_SCHOOL');

  const classesQuery = useMemoFirebase(
    () => (firestore && schoolId ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null),
    [firestore, schoolId]
  );
  const { data: classes } = useCollection<Class>(classesQuery);

  const canCreate = role === 'Admin' || role === 'SuperAdmin' || role === 'Teacher';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black tracking-[0.25em] bg-indigo-500/20 text-indigo-300 px-3.5 py-1.5 rounded-full uppercase border border-indigo-500/30">
              Classroom Moments & Stories
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 uppercase italic">
            <Camera className="h-8 w-8 text-indigo-400 animate-pulse" /> Class <span className="text-indigo-400">Stories</span>
          </h1>
          <p className="text-slate-300 text-xs font-medium max-w-xl mt-1">
            Celebrating classroom achievements, science projects, field trips & daily learning moments for parents and students.
          </p>
        </div>

        {canCreate && (
          <Button
            onClick={() => setComposerOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 h-12 px-6 rounded-2xl font-black uppercase tracking-tight text-white gap-2 shrink-0"
          >
            <Plus className="h-5 w-5" /> Share Class Story
          </Button>
        )}
      </div>

      {/* Class Selector Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-indigo-600" />
          <span className="text-xs font-black uppercase text-slate-500">Filter By Class:</span>
        </div>
        <div className="w-full sm:w-72">
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger className="h-10 bg-white border-2 rounded-xl text-xs font-bold">
              <SelectValue placeholder="All School Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_SCHOOL">🌟 All School Stories</SelectItem>
              {classes?.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Feed List */}
      {schoolId ? (
        <ClassStoryFeed schoolId={schoolId} classId={selectedClassId} userRole={role} />
      ) : (
        <div className="text-center p-12 text-slate-400 font-bold uppercase text-xs">Loading school workspace...</div>
      )}

      {/* Composer Dialog */}
      {canCreate && schoolId && (
        <ClassStoryComposer
          schoolId={schoolId}
          classes={classes || []}
          open={composerOpen}
          onOpenChange={setComposerOpen}
        />
      )}
    </div>
  );
}
