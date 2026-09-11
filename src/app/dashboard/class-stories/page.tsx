'use client';

import { useState } from 'react';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Class } from '@/lib/types';
import { ClassStoryFeed } from '@/components/dashboard/ClassStoryFeed';
import { ClassStoryComposer } from '@/components/dashboard/ClassStoryComposer';
import { SectionHeroBanner } from '@/components/common/SectionHeroBanner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Plus, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ClassStoriesPage() {
  const { role, profile } = useRole();
  const { schoolId } = useCurrentSchool();
  const firestore = useFirestore();

  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL_SCHOOL');
  const [activeStoryTab, setActiveStoryTab] = useState<'all' | 'class' | 'school'>('all');

  const classesQuery = useMemoFirebase(
    () => (firestore && schoolId ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null),
    [firestore, schoolId]
  );
  const { data: classes } = useCollection<Class>(classesQuery);

  const canCreate = role === 'Director' || role === 'Administrator' || role === 'Teacher';
  const schoolName = profile?.schoolName || "Sunny Side Academy";

  const handleTabChange = (tab: 'all' | 'class' | 'school') => {
    setActiveStoryTab(tab);
    if (tab === 'all') {
      setSelectedClassId('ALL_SCHOOL');
    } else if (tab === 'class') {
      if (selectedClassId === 'ALL_SCHOOL' && classes && classes.length > 0) {
        setSelectedClassId(classes[0].id);
      }
    } else if (tab === 'school') {
      setSelectedClassId('ALL_SCHOOL');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 relative pb-16">
      {/* Unified Classic Institutional Hero Banner */}
      <SectionHeroBanner
        eyebrow={`${schoolName.toUpperCase()} • CLASSROOM MOMENTS & STORIES`}
        title="Class Stories 📸"
        subtitle="Celebrating classroom achievements, science projects, field trips & daily learning moments for parents and students."
        icon={Camera}
        badge={{
          label: "Live Classroom Feed",
          variant: "success",
        }}
        breadcrumbs={[
          { label: 'Director Suite' },
          { label: 'Community', href: '/dashboard' },
          { label: 'Class Stories' },
        ]}
        stats={[
          { label: 'Active Classes', value: classes?.length || 0 },
          { label: 'Audience', value: 'School Community' },
        ]}
        actions={
          canCreate ? (
            <Button
              onClick={() => setComposerOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs h-9 px-4 gap-1.5 shadow-sm cursor-pointer shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4 text-slate-950" />
              <span>Share Class Story</span>
            </Button>
          ) : undefined
        }
      />

      {/* Story Tabs & Class Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Story Category Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60">
          <button
            type="button"
            onClick={() => handleTabChange('all')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeStoryTab === 'all'
                ? "bg-white text-slate-900 shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            🌟 All Stories
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('class')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeStoryTab === 'class'
                ? "bg-white text-slate-900 shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            📚 Class Feed
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('school')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeStoryTab === 'school'
                ? "bg-white text-slate-900 shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            🏫 School Community
          </button>
        </div>

        {/* Filter by Class Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider shrink-0 hidden sm:block">
            Filter:
          </span>
          <Select
            value={selectedClassId}
            onValueChange={(val) => {
              setSelectedClassId(val);
              if (val === 'ALL_SCHOOL') {
                setActiveStoryTab('all');
              } else {
                setActiveStoryTab('class');
              }
            }}
          >
            <SelectTrigger className="h-9 w-full sm:w-64 bg-white border-slate-200 rounded-xl text-xs font-semibold shadow-2xs">
              <SelectValue placeholder="All School Classes" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl border border-slate-200 shadow-xl">
              <SelectItem value="ALL_SCHOOL" className="text-xs font-bold">
                🌟 All School Stories
              </SelectItem>
              {classes?.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-xs">
                  📖 {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Story Feed */}
      {schoolId ? (
        <ClassStoryFeed schoolId={schoolId} classId={selectedClassId} userRole={role || undefined} />
      ) : (
        <div className="text-center p-12 text-slate-400 font-bold uppercase text-xs bg-white rounded-2xl border border-slate-100">
          Loading school workspace...
        </div>
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
