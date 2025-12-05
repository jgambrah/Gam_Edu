
'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, deleteDoc, doc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, 
  MapPin, Clock, Trash2, Loader2, Info 
} from 'lucide-react';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO 
} from 'date-fns';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

// --- TYPES ---
type EventType = 'Academic' | 'Holiday' | 'Sports' | 'Meeting' | 'Event';

interface SchoolEvent {
  id: string;
  title: string;
  description?: string;
  date: Timestamp; // Stored as Firestore Timestamp
  type: EventType;
  location?: string;
  time?: string;
}

// --- HELPERS ---
const EVENT_COLORS: Record<EventType, string> = {
  'Academic': 'bg-blue-100 text-blue-700 border-blue-200',
  'Holiday': 'bg-red-100 text-red-700 border-red-200',
  'Sports': 'bg-green-100 text-green-700 border-green-200',
  'Meeting': 'bg-purple-100 text-purple-700 border-purple-200',
  'Event': 'bg-orange-100 text-orange-700 border-orange-200',
};

// --- COMPONENT: Add Event Form ---
function AddEventForm({ open, setOpen, selectedDate }: { open: boolean, setOpen: (o: boolean) => void, selectedDate: Date }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [title, setTitle] = useState('');
    const [type, setType] = useState<EventType>('Academic');
    const [dateStr, setDateStr] = useState(format(selectedDate, 'yyyy-MM-dd'));
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !dateStr) return;
        
        setIsSubmitting(true);
        try {
            // Create Date object from string input
            const eventDate = new Date(dateStr);
            
            await addDoc(collection(firestore, 'school_calendar'), {
                title,
                type,
                description,
                location,
                time,
                date: Timestamp.fromDate(eventDate),
                createdAt: serverTimestamp()
            });

            toast({ title: 'Success', description: 'Event added to calendar.' });
            setOpen(false);
            // Reset form
            setTitle(''); setDescription(''); setTime(''); setLocation('');
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add School Event</DialogTitle>
                    <DialogDescription>Add a new event to the public school calendar.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>Event Title *</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Mid-Term Exams" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date *</Label>
                            <Input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={type} onValueChange={(v) => setType(v as EventType)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.keys(EVENT_COLORS).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Time (Optional)</Label><Input value={time} onChange={e => setTime(e.target.value)} placeholder="09:00 AM" /></div>
                        <div className="space-y-2"><Label>Location (Optional)</Label><Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Main Hall" /></div>
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Details about the event..." />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Save Event"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// --- MAIN PAGE ---
export default function SchoolCalendarPage() {
  const firestore = useFirestore();
  const { role } = useRole();
  const { toast } = useToast();

  const canManage = ['Administrator', 'Director'].includes(role);

  // Calendar Navigation State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Fetch Events
  const eventsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'school_calendar'), orderBy('date', 'asc')) : null,
    [firestore]
  );
  const { data: events, isLoading } = useCollection<SchoolEvent>(eventsQuery);

  // Generate Calendar Grid
  const daysInGrid = useMemo(() => {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(monthStart);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);
      return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  // Navigation Handlers
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const jumpToToday = () => {
      const today = new Date();
      setCurrentMonth(today);
      setSelectedDate(today);
  };

  // Filter events for the selected date
  const selectedDayEvents = useMemo(() => {
      if (!events) return [];
      return events.filter(e => isSameDay(e.date.toDate(), selectedDate));
  }, [events, selectedDate]);

  const handleDelete = async (id: string) => {
      if (!confirm("Delete this event?")) return;
      try {
          await deleteDoc(doc(firestore, 'school_calendar', id));
          toast({ title: "Deleted" });
      } catch (e: any) {
          toast({ variant: 'destructive', title: "Error", description: e.message });
      }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                <CalendarIcon className="h-8 w-8 text-indigo-600"/> School Calendar
            </h1>
            <p className="text-slate-500">Upcoming events, holidays, and academic schedules.</p>
        </div>
        {canManage && (
            <Button onClick={() => setIsAddOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                <Plus className="mr-2 h-4 w-4"/> Add Event
            </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: CALENDAR GRID */}
          <Card className="lg:col-span-2 border-t-4 border-t-indigo-500 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-800">
                          {format(currentMonth, 'MMMM yyyy')}
                      </h2>
                  </div>
                  <div className="flex gap-1">
                      <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4"/></Button>
                      <Button variant="outline" size="sm" onClick={jumpToToday}>Today</Button>
                      <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4"/></Button>
                  </div>
              </CardHeader>
              <CardContent>
                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 mb-2 text-center">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
                              {day}
                          </div>
                      ))}
                  </div>
                  
                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1">
                      {daysInGrid.map((day, idx) => {
                          const isToday = isSameDay(day, new Date());
                          const isSelected = isSameDay(day, selectedDate);
                          const isCurrentMonth = isSameMonth(day, currentMonth);
                          
                          // Find events for this specific day
                          const dayEvents = events?.filter(e => isSameDay(e.date.toDate(), day)) || [];

                          return (
                              <div 
                                  key={idx}
                                  onClick={() => setSelectedDate(day)}
                                  className={`
                                      min-h-[100px] p-2 border rounded-md cursor-pointer transition-all flex flex-col justify-between group
                                      ${!isCurrentMonth ? 'bg-slate-50 text-slate-400' : 'bg-white'}
                                      ${isSelected ? 'ring-2 ring-indigo-500 z-10' : 'hover:border-indigo-300'}
                                      ${isToday ? 'bg-indigo-50 font-bold text-indigo-700' : ''}
                                  `}
                              >
                                  <div className="flex justify-between items-start">
                                      <span className={`text-sm ${!isCurrentMonth ? 'opacity-50' : ''}`}>{format(day, 'd')}</span>
                                      {isToday && <span className="h-2 w-2 rounded-full bg-indigo-500"></span>}
                                  </div>

                                  {/* Event Dots / Tiny Bars */}
                                  <div className="space-y-1 mt-1">
                                      {dayEvents.slice(0, 3).map(event => (
                                          <div 
                                              key={event.id} 
                                              className={`text-[10px] truncate px-1 rounded ${EVENT_COLORS[event.type]} bg-opacity-50 border-0`}
                                          >
                                              {event.title}
                                          </div>
                                      ))}
                                      {dayEvents.length > 3 && (
                                          <div className="text-[10px] text-slate-400 pl-1">
                                              + {dayEvents.length - 3} more
                                          </div>
                                      )}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </CardContent>
          </Card>

          {/* RIGHT: SELECTED DAY DETAILS */}
          <div className="space-y-6">
              <Card className="h-full border-t-4 border-t-orange-400 shadow-sm flex flex-col">
                  <CardHeader className="pb-3 border-b bg-slate-50/50">
                      <CardTitle className="text-lg flex items-center gap-2">
                          <div className="bg-orange-100 p-2 rounded-md text-orange-600">
                              <span className="text-xl font-bold">{format(selectedDate, 'd')}</span>
                          </div>
                          <div className="flex flex-col">
                              <span>{format(selectedDate, 'EEEE')}</span>
                              <span className="text-xs text-muted-foreground font-normal">{format(selectedDate, 'MMMM yyyy')}</span>
                          </div>
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 p-0">
                      <ScrollArea className="h-[500px] p-4">
                          {isLoading ? (
                              <div className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400"/></div>
                          ) : selectedDayEvents.length === 0 ? (
                              <div className="text-center py-12 text-slate-400">
                                  <Info className="h-10 w-10 mx-auto mb-2 opacity-20"/>
                                  <p>No events scheduled for this day.</p>
                                  {canManage && (
                                      <Button variant="link" onClick={() => setIsAddOpen(true)} className="mt-2">
                                          + Add Event
                                      </Button>
                                  )}
                              </div>
                          ) : (
                              <div className="space-y-3">
                                  {selectedDayEvents.map(event => (
                                      <div key={event.id} className={`p-3 rounded-lg border ${EVENT_COLORS[event.type]} bg-opacity-10 relative group`}>
                                          <div className="flex justify-between items-start">
                                              <Badge variant="outline" className={`mb-2 ${EVENT_COLORS[event.type]} bg-white`}>
                                                  {event.type}
                                              </Badge>
                                              {canManage && (
                                                  <button onClick={() => handleDelete(event.id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                      <Trash2 className="h-4 w-4"/>
                                                  </button>
                                              )}
                                          </div>
                                          <h4 className="font-bold text-slate-800">{event.title}</h4>
                                          
                                          {event.time && (
                                              <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                                  <Clock className="h-3 w-3"/> {event.time}
                                              </div>
                                          )}
                                          {event.location && (
                                              <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                                  <MapPin className="h-3 w-3"/> {event.location}
                                              </div>
                                          )}
                                          {event.description && (
                                              <p className="text-sm text-slate-500 mt-2 pt-2 border-t border-slate-200/50">
                                                  {event.description}
                                              </p>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          )}
                      </ScrollArea>
                  </CardContent>
              </Card>
          </div>
      </div>

      {/* MODAL */}
      <AddEventForm open={isAddOpen} setOpen={setIsAddOpen} selectedDate={selectedDate} />
    </div>
  );
}
