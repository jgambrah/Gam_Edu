
'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { 
  Calendar as CalendarIcon, Wand2, Loader2, CalendarCheck, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO 
} from 'date-fns';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// AI Flow
import { generateStudyPlan } from '@/ai/flows/generate-study-plan-flow';

// Types
import { Assignment, Lecture } from '@/lib/types';

// --- TYPES ---
type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  type: 'Assignment' | 'Live Lecture' | 'Focus Block';
};

const EVENT_COLORS: Record<CalendarEvent['type'], string> = {
  'Assignment': 'bg-red-100 text-red-700 border-red-200',
  'Live Lecture': 'bg-blue-100 text-blue-700 border-blue-200',
  'Focus Block': 'bg-green-100 text-green-700 border-green-200',
};

export default function SmartSchedulePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiEvents, setAiEvents] = useState<CalendarEvent[]>([]);

  // --- DATA FETCHING ---
  const assignmentsQuery = useMemoFirebase(() => 
    (user && firestore) ? query(collection(firestore, 'assignments')) : null, 
  [firestore, user]);
  const { data: assignments } = useCollection<Assignment>(assignmentsQuery);

  const lecturesQuery = useMemoFirebase(() => 
    (user && firestore) ? query(collection(firestore, 'lectures')) : null, 
  [firestore, user]);
  const { data: lectures } = useCollection<Lecture>(lecturesQuery);

  // --- DATA TRANSFORMATION ---
  const allEvents = useMemo(() => {
    const assignmentEvents: CalendarEvent[] = (assignments || [])
      .filter(a => a.dueDate)
      .map(a => ({
          id: `assign-${a.id}`,
          title: a.title,
          date: (a.dueDate as any).toDate ? (a.dueDate as any).toDate() : (a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate)),
          type: 'Assignment'
      }));

    const lectureEvents: CalendarEvent[] = (lectures || [])
      .filter(l => l.scheduledFor)
      .map(l => ({
          id: `lecture-${l.id}`,
          title: l.title,
          date: (l.scheduledFor as any).toDate ? (l.scheduledFor as any).toDate() : (l.scheduledFor instanceof Date ? l.scheduledFor : new Date(l.scheduledFor)),
          type: 'Live Lecture'
      }));
    
    return [...assignmentEvents, ...lectureEvents, ...aiEvents];
  }, [assignments, lectures, aiEvents]);


  // --- CALENDAR LOGIC ---
  const daysInGrid = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const handleGeneratePlan = async () => {
      setIsGenerating(true);
      toast({ title: "AI is planning...", description: "Analyzing your schedule to find study slots." });
      setAiEvents([]);

      try {
        const inputEvents = (allEvents || []).filter(e => e.type !== 'Focus Block').map(e => ({
            title: e.title,
            type: e.type as 'Assignment' | 'Live Lecture' | 'Event', // Add 'Event' to the type
            date: e.date.toISOString(),
        }));
        
        const result = await generateStudyPlan({
            events: inputEvents,
            startDate: startOfMonth(currentMonth).toISOString(),
            endDate: endOfMonth(currentMonth).toISOString(),
        });

        const newAiEvents: CalendarEvent[] = result.focusBlocks.map((block, i) => ({
            id: `ai-${Date.now()}-${i}`,
            title: block.title,
            date: new Date(block.startTime),
            type: 'Focus Block',
        }));

        setAiEvents(newAiEvents);
        toast({ title: "Study Plan Generated!", description: "Focus Blocks have been added to your calendar." });

      } catch (error) {
          console.error("AI Study Plan Error:", error);
          toast({ variant: 'destructive', title: "AI Error", description: "Could not generate a study plan." });
      } finally {
          setIsGenerating(false);
      }
  };


  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-green-500 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-6 w-6 text-green-600" /> Smart Schedule
            </CardTitle>
            <CardDescription>
              A unified view of your academic events. Let AI help you plan your study time.
            </CardDescription>
          </div>
          <Button onClick={handleGeneratePlan} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4"/>}
            Auto-Plan Study Time
          </Button>
        </CardHeader>
        <CardContent>
          {/* Calendar Header */}
          <div className="flex items-center justify-between pb-4">
              <h2 className="text-xl font-bold text-slate-800">
                  {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>Prev</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>Today</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>Next</Button>
              </div>
          </div>
          {/* Calendar Grid */}
           <div className="grid grid-cols-7 border-t border-l">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-xs font-bold text-center text-slate-500 p-2 border-r bg-slate-50">
                        {day}
                    </div>
                ))}
                {daysInGrid.map((day, idx) => {
                    const isCurrent = isSameMonth(day, currentMonth);
                    const dayEvents = allEvents.filter(e => isSameDay(e.date, day));
                    return (
                        <div key={idx} className={`min-h-[120px] p-2 border-r border-b ${isCurrent ? 'bg-white' : 'bg-slate-50'}`}>
                            <span className={`text-sm ${isCurrent ? 'font-medium' : 'text-slate-400'}`}>{format(day, 'd')}</span>
                            <div className="space-y-1 mt-1">
                                {dayEvents.map(event => (
                                    <div key={event.id} className={`text-[10px] p-1 rounded border ${EVENT_COLORS[event.type]}`}>
                                        <p className="font-bold truncate">{event.title}</p>
                                        <p>{format(event.date, 'p')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
