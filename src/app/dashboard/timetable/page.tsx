'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, writeBatch, query, where, orderBy, addDoc, serverTimestamp, deleteDoc, getDocs, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimetableDisplay } from './timetable-display';
import { TimeSlot, TimetableEntry, Subject, Room, Student, Class } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Plus, Trash2, CalendarDays, Info, Settings2, Clock, MapPin, CheckCircle2, XCircle, RefreshCw, AlertTriangle, Microscope } from 'lucide-react';
import { generateTimetable } from '@/ai/flows/generate-timetable-flow';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { checkAndSpendCredits } from '@/app/actions/credits';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import TimetableSeeder from '@/components/TimetableSeeder';
import { Switch } from '@/components/ui/switch';

type Teacher = { uid: string; firstName: string; lastName: string; role: string };

// --- SUB-COMPONENT: MANUAL ASSIGNMENT ---
function ManualAssignmentDialog({ 
    open, 
    setOpen, 
    classId, 
    subjects, 
    teachers, 
    rooms, 
    timeSlots,
    onSuccess 
}: { 
    open: boolean; 
    setOpen: (o: boolean) => void; 
    classId: string;
    subjects: Subject[];
    teachers: any[];
    rooms: Room[];
    timeSlots: TimeSlot[];
    onSuccess: () => void;
}) {
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        timeSlotId: '',
        subjectId: '',
        teacherId: '',
        roomId: ''
    });

    const handleSubmit = async () => {
        if (!firestore || !schoolId || !classId) return;
        if (!form.timeSlotId || !form.subjectId || !form.teacherId || !form.roomId) {
            toast({ variant: 'destructive', title: "Missing Fields", description: "Please fill in all assignment details." });
            return;
        }

        setIsSubmitting(true);
        try {
            const slot = timeSlots.find(ts => ts.id === form.timeSlotId);
            await addDoc(collection(firestore, 'timetables'), {
                ...form,
                classId,
                schoolId,
                day: slot?.day || '',
                startTime: slot?.startTime || '',
                endTime: slot?.endTime || '',
                createdAt: serverTimestamp()
            });
            toast({ title: "Entry Added", description: "The lesson has been assigned to the timetable." });
            onSuccess();
            setOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Manual Lesson Assignment</DialogTitle>
                    <DialogDescription>Assign a subject, teacher, and room to a specific time slot.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Time Slot</Label>
                        <Select onValueChange={(v) => setForm({...form, timeSlotId: v})}>
                            <SelectTrigger><SelectValue placeholder="Select Slot..." /></SelectTrigger>
                            <SelectContent>
                                {timeSlots.sort((a,b) => a.startTime.localeCompare(b.startTime)).map(ts => (
                                    <SelectItem key={ts.id} value={ts.id}>{ts.day} @ {ts.startTime}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select onValueChange={(v) => setForm({...form, subjectId: v})}>
                            <SelectTrigger><SelectValue placeholder="Select Subject..." /></SelectTrigger>
                            <SelectContent>
                                {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Teacher</Label>
                        <Select onValueChange={(v) => setForm({...form, teacherId: v})}>
                            <SelectTrigger><SelectValue placeholder="Select Teacher..." /></SelectTrigger>
                            <SelectContent>
                                {teachers.map(t => <SelectItem key={t.uid} value={t.uid}>{t.firstName} {t.lastName}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Room</Label>
                        <Select onValueChange={(v) => setForm({...form, roomId: v})}>
                            <SelectTrigger><SelectValue placeholder="Select Room..." /></SelectTrigger>
                            <SelectContent>
                                {rooms.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                        {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Plus className="mr-2 h-4 w-4"/>}
                        Add to Timetable
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- SUB-COMPONENT: CONFIGURATION TAB ---
function TimetableConfig({ schoolId, timeSlots, rooms, onRefresh }: { schoolId: string, timeSlots: TimeSlot[], rooms: Room[], onRefresh: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [newSlot, setNewSlot] = useState({ day: 'Monday', start: '08:00', end: '08:45' });
    const [newRoom, setNewRoom] = useState({ name: '', isLab: false });

    const handleAddSlot = async () => {
        if (!firestore || !schoolId) return;
        setLoading(true);
        try {
            const id = `${schoolId}-${newSlot.day.substring(0,3)}-${newSlot.start.replace(':','')}`;
            await setDoc(doc(firestore, 'timeSlots', id), {
                id,
                day: newSlot.day,
                startTime: newSlot.start,
                endTime: newSlot.end,
                type: 'Lesson',
                schoolId
            });
            toast({ title: "Slot Added" });
            onRefresh();
        } catch (e: any) { toast({ variant: 'destructive', title: "Error", description: e.message }); }
        finally { setLoading(false); }
    };

    const handleAddRoom = async () => {
        if (!firestore || !schoolId || !newRoom.name) return;
        setLoading(true);
        try {
            await addDoc(collection(firestore, 'rooms'), {
                name: newRoom.name,
                isLab: newRoom.isLab,
                capacity: 30,
                schoolId
            });
            toast({ title: "Room Added" });
            setNewRoom({ name: '', isLab: false });
            onRefresh();
        } catch (e: any) { toast({ variant: 'destructive', title: "Error", description: e.message }); }
        finally { setLoading(false); }
    };

    const handleDelete = async (coll: string, id: string) => {
        if (!firestore) return;
        await deleteDoc(doc(firestore, coll, id));
        toast({ title: "Deleted" });
        onRefresh();
    };

    return (
        <div className="space-y-8 animate-in fade-in">
            <TimetableSeeder />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2"><Clock className="h-4 w-4"/> Daily Time Slots</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border">
                            <Select value={newSlot.day} onValueChange={(v) => setNewSlot({...newSlot, day: v})}>
                                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Input type="time" value={newSlot.start} onChange={e => setNewSlot({...newSlot, start: e.target.value})} className="h-9 text-xs" />
                            <Button onClick={handleAddSlot} disabled={loading} size="sm" className="h-9"><Plus className="h-3 w-3"/></Button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto space-y-1">
                            {timeSlots.sort((a,b) => a.startTime.localeCompare(b.startTime)).map(ts => (
                                <div key={ts.id} className="flex items-center justify-between p-2 text-xs border rounded hover:bg-slate-50">
                                    <span><strong>{ts.day.substring(0,3)}:</strong> {ts.startTime} - {ts.endTime}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400" onClick={() => handleDelete('timeSlots', ts.id)}><Trash2 className="h-3 w-3"/></Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2"><MapPin className="h-4 w-4"/> School Rooms</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3 p-3 bg-slate-50 rounded-xl border">
                            <Input placeholder="Room Name..." value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} className="h-9 text-xs bg-white" />
                            <div className="flex items-center justify-between px-2">
                                <Label className="text-[10px] uppercase font-black text-slate-500">Specialized Lab?</Label>
                                <Switch checked={newRoom.isLab} onCheckedChange={(v) => setNewRoom({...newRoom, isLab: v})} />
                            </div>
                            <Button onClick={handleAddRoom} disabled={loading || !newRoom.name} size="sm" className="h-9 w-full">Add Room</Button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto space-y-1">
                            {rooms.map(r => (
                                <div key={r.id} className="flex items-center justify-between p-2 text-xs border rounded hover:bg-slate-50">
                                    <span className="flex items-center gap-2">
                                        {r.name}
                                        {r.isLab && <Badge variant="outline" className="text-[8px] bg-orange-50 text-orange-700 h-4 uppercase">Lab</Badge>}
                                    </span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400" onClick={() => handleDelete('rooms', r.id)}><Trash2 className="h-3 w-3"/></Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// --- MAIN PAGE ---
export default function TimetablePage() {
  const { user } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const [selectedClassId, setSelectedClassId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [customConstraint, setCustomConstraint] = useState('');

  const canAccess = ['Student', 'Teacher', 'Admin', 'Administrator', 'Director'].includes(role || '');
  const canManage = ['Admin', 'Administrator', 'Director'].includes(role || '');

  const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: classes } = useCollection<Class>(classesQuery);

  const allTeachersQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    return query(collection(firestore, 'staff'), where('schoolId', '==', schoolId), where('role', '==', 'Teacher'));
  }, [firestore, schoolId]);
  const { data: allTeachers } = useCollection<Teacher>(allTeachersQuery);

  const subjectsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: subjects } = useCollection<Subject>(subjectsQuery);

  const roomsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'rooms'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: rooms, forceRefetch: refetchRooms } = useCollection<Room>(roomsQuery);

  const timeSlotsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'timeSlots'), where('schoolId', '==', schoolId), orderBy('startTime')) : null, [firestore, schoolId]);
  const { data: timeSlots, forceRefetch: refetchSlots } = useCollection<TimeSlot>(timeSlotsQuery);

  const timetableQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'timetables'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: timetable, isLoading: isTimetableLoading, forceRefetch: refetchTimetable } = useCollection<TimetableEntry>(timetableQuery);
  
  const studentsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: students } = useCollection<Student>(studentsQuery);


  useEffect(() => {
    if (role === 'Student' && user && students && students.length > 0) {
      const currentStudent = students.find(s => s.uid === user.uid);
      if (currentStudent) {
        setSelectedClassId(currentStudent.classId);
      }
    }
  }, [role, user, students]);

  const handleGenerateTimetable = async () => {
    if (!canManage || !allTeachers || !subjects || !classes || !rooms || !timeSlots || !firestore || !schoolId) return;
    
    setIsGenerating(true);
    const creditResult = await checkAndSpendCredits(schoolId, 50);
    if (!creditResult.success) {
        toast({ variant: 'destructive', title: "Insufficient AI Credits", description: creditResult.error });
        setIsGenerating(false);
        return;
    }
    
    toast({ title: "AI is on the job!", description: "Generating a new timetable based on Ghanaian institutional logic." });

    try {
      const enrichedClasses = classes?.map(c => ({
        id: c.id,
        name: c.name,
        homeRoomId: c.homeRoomId || null,
        classTeacherId: c.teacherId || null,
        teachingModel: c.teachingModel || 'SubjectTeacher'
      })) || [];

      const enrichedSubjects = subjects?.map(s => ({
        id: s.id,
        name: s.name,
        weeklyPeriods: s.weeklyPeriods || 3,
        requiresLab: s.requiresLab || false,
        targetClasses: s.targetClasses || [],
        allowedTeacherIds: s.teacherIds || []
      })) || [];

      const input = {
        teachers: allTeachers.map(t => ({ id: t.uid, name: `${t.firstName} ${t.lastName}` })),
        subjects: enrichedSubjects,
        classes: enrichedClasses,
        rooms: rooms?.map(({ id, name, isLab }) => ({ id, name, isLab: isLab || false })) || [],
        timeSlots: timeSlots?.map(({ id, day, startTime, endTime }) => ({ id, day, startTime, endTime })) || [],
        customConstraint: customConstraint,
        schoolId: schoolId,
        systemRules: [
          "LOWER PRIMARY LOGIC: If a class teachingModel is 'ClassTeacher', prioritize assigning their classTeacherId to all non-lab subjects.",
          "HOME ROOM LOGIC: By default, assign lessons to the class's homeRoomId UNLESS the subject requiresLab is true.",
          "FREQUENCY LOGIC: Do not schedule a subject more times per week than its weeklyPeriods value.",
          "DOUBLE PERIODS: If weeklyPeriods is 4 or more, attempt to schedule one double-period block (back-to-back)."
        ]
      };

      const result = await generateTimetable(input);
      const batch = writeBatch(firestore);

      if(timetable) {
          const classSpecificEntries = timetable.filter(e => e.classId === selectedClassId || !selectedClassId);
          classSpecificEntries.forEach(entry => {
            batch.delete(doc(firestore, 'timetables', entry.id));
          });
      }
      
      if (result && result.timetable) {
          result.timetable.forEach((entry: any) => {
            const newDocRef = doc(collection(firestore, 'timetables'));
            batch.set(newDocRef, { 
                ...entry, 
                schoolId,
                createdAt: serverTimestamp()
            });
          });
      }
      
      await batch.commit();
      toast({ title: "Success!", description: `A new timetable has been generated with ${result.timetable.length} lessons.` });
      refetchTimetable(); 
    } catch (error: any) {
      console.error("Error generating timetable:", error);
      toast({ variant: 'destructive', title: "AI Error", description: error.message || "Could not generate timetable." });
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredTimetable = useMemo(() => {
      return timetable?.filter(entry => entry.classId === selectedClassId) || [];
  }, [timetable, selectedClassId]);

  if (!canAccess && !isRoleLoading) return <Card className="p-8 text-center text-red-500">Access Denied</Card>;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="view" className="w-full">
        <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-slate-100 p-1 rounded-xl">
                <TabsTrigger value="view" className="rounded-lg font-bold px-6">Timetable View</TabsTrigger>
                {canManage && <TabsTrigger value="config" className="rounded-lg font-bold px-6">Configuration</TabsTrigger>}
            </TabsList>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => { refetchTimetable(); refetchSlots(); refetchRooms(); }} className="gap-2">
                    <RefreshCw className="h-4 w-4" /> Sync Data
                </Button>
                {canManage && selectedClassId && (
                    <Button onClick={() => setIsManualOpen(true)} className="bg-slate-800">
                        <Plus className="mr-2 h-4 w-4"/> Manual Assignment
                    </Button>
                )}
            </div>
        </div>

        <TabsContent value="view" className="space-y-6">
            <Card className="border-t-4 border-t-indigo-600 shadow-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">
                                <CalendarDays className="h-6 w-6 text-indigo-600"/> Weekly Schedule
                            </CardTitle>
                            <CardDescription>View official class lessons.</CardDescription>
                        </div>
                        <div className="w-full md:w-64">
                            <Select onValueChange={setSelectedClassId} value={selectedClassId}>
                                <SelectTrigger className="bg-white border-2 h-11"><SelectValue placeholder="Select Class..." /></SelectTrigger>
                                <SelectContent>
                                    {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isTimetableLoading ? (
                        <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
                    ) : selectedClassId ? (
                        <div className="space-y-4">
                            <div className="flex justify-end px-2">
                                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                                    {filteredTimetable.length} Lessons Scheduled
                                </p>
                            </div>
                            <TimetableDisplay 
                                timetable={filteredTimetable}
                                subjects={subjects || []}
                                teachers={allTeachers || []}
                                rooms={rooms || []}
                                timeSlots={timeSlots || []}
                            />
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 border-2 border-dashed rounded-3xl">
                            <Info className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Please select a class to view its timetable.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {canManage && (
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                    <CardHeader className="p-8">
                        <CardTitle className="flex items-center gap-2 text-emerald-400 uppercase italic tracking-tight"><Wand2 /> AI Scheduler</CardTitle>
                        <CardDescription className="text-slate-400">Generate a conflict-free school schedule automatically based on Ghanaian institutional logic.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Textarea
                                    placeholder="Add constraints: e.g., 'Math classes must be in the morning' or 'Teachers shouldn't have more than 3 classes a day'."
                                    value={customConstraint}
                                    onChange={(e) => setCustomConstraint(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white min-h-[120px] rounded-2xl"
                                />
                                <Button onClick={handleGenerateTimetable} disabled={isGenerating || !timeSlots?.length} className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-lg shadow-xl active:scale-95 transition-all">
                                    {isGenerating ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Wand2 className="mr-2 h-6 w-6" />}
                                    RUN AI SCHEDULER (-50 Credits)
                                </Button>
                            </div>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                <h4 className="text-sm font-bold uppercase text-slate-400 tracking-widest">Generation Checklist</h4>
                                <ul className="space-y-2 text-xs font-medium">
                                    <li className="flex items-center gap-2">
                                        <div className={cn("w-4 h-4 rounded-full flex items-center justify-center", timeSlots?.length ? "bg-green-500" : "bg-red-500")}>
                                            {timeSlots?.length ? <CheckCircle2 className="h-3 w-3 text-white"/> : <XCircle className="h-3 w-3 text-white"/>}
                                        </div>
                                        <span>Time Slots Configured ({timeSlots?.length || 0})</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className={cn("w-4 h-4 rounded-full flex items-center justify-center", rooms?.length ? "bg-green-500" : "bg-red-500")}>
                                            {rooms?.length ? <CheckCircle2 className="h-3 w-3 text-white"/> : <XCircle className="h-3 w-3 text-white"/>}
                                        </div>
                                        <span>Rooms Registered ({rooms?.length || 0})</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className={cn("w-4 h-4 rounded-full flex items-center justify-center", subjects?.length ? "bg-green-500" : "bg-red-500")}>
                                            {subjects?.length ? <CheckCircle2 className="h-3 w-3 text-white"/> : <XCircle className="h-3 w-3 text-white"/>}
                                        </div>
                                        <span>Subjects Defined ({subjects?.length || 0})</span>
                                    </li>
                                </ul>
                                {(!timeSlots?.length || !rooms?.length) && (
                                    <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-200 text-xs">
                                        <AlertTriangle className="h-4 w-4 mb-1" />
                                        You need to define your school's time slots and rooms in the <strong>Configuration</strong> tab before using the AI Scheduler.
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </TabsContent>

        <TabsContent value="config">
            {schoolId && (
                <TimetableConfig 
                    schoolId={schoolId} 
                    timeSlots={timeSlots || []} 
                    rooms={rooms || []} 
                    onRefresh={() => { refetchSlots(); refetchRooms(); }} 
                />
            )}
        </TabsContent>
      </Tabs>

      {selectedClassId && schoolId && (
          <ManualAssignmentDialog 
            open={isManualOpen}
            setOpen={setIsManualOpen}
            classId={selectedClassId}
            subjects={subjects || []}
            teachers={allTeachers || []}
            rooms={rooms || []}
            timeSlots={timeSlots || []}
            onSuccess={refetchTimetable}
          />
      )}
    </div>
  );
}
