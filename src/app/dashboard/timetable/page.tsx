
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, writeBatch, query, where, orderBy, addDoc, serverTimestamp, deleteDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimetableDisplay } from './timetable-display';
import { TimeSlot, TimetableEntry, Subject, Room, Student, Class } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Plus, Trash2, CalendarDays, Info, Settings2, Clock, MapPin, CheckCircle2, XCircle, RefreshCw, AlertTriangle, Save, BookCopy, Edit } from 'lucide-react';
import { generateTimetable } from '@/ai/flows/generate-timetable-flow';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { checkAndSpendCredits } from '@/app/actions/credits';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import TimetableSeeder from '@/components/TimetableSeeder';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import CreditBalance from '@/components/CreditBalance';

type Teacher = { uid: string; firstName: string; lastName: string; role: string };

// --- SUB-COMPONENT: LESSON ASSIGNMENT DIALOG ---
function LessonAssignmentDialog({ 
    open, 
    setOpen, 
    classId, 
    subjects, 
    teachers, 
    rooms, 
    timeSlots,
    editingEntry,
    onSuccess 
}: { 
    open: boolean; 
    setOpen: (o: boolean) => void; 
    classId: string;
    subjects: Subject[];
    teachers: any[];
    rooms: Room[];
    timeSlots: TimeSlot[];
    editingEntry?: TimetableEntry | null;
    onSuccess: () => void;
}) {
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [form, setForm] = useState({
        timeSlotId: '',
        subjectId: '',
        teacherId: '',
        roomId: ''
    });

    useEffect(() => {
        if (open) {
            if (editingEntry) {
                setForm({
                    timeSlotId: editingEntry.timeSlotId || '',
                    subjectId: editingEntry.subjectId || '',
                    teacherId: editingEntry.teacherId || '',
                    roomId: editingEntry.roomId || ''
                });
            } else {
                setForm({ timeSlotId: '', subjectId: '', teacherId: '', roomId: '' });
            }
        }
    }, [open, editingEntry]);

    const handleSubmit = async () => {
        if (!firestore || !schoolId || !classId) return;
        if (!form.timeSlotId || !form.subjectId || !form.teacherId || !form.roomId) {
            toast({ variant: 'destructive', title: "Missing Fields", description: "Please fill in all assignment details." });
            return;
        }

        setIsSubmitting(true);
        try {
            const slot = timeSlots.find(ts => ts.id === form.timeSlotId);
            const data = {
                timeSlotId: form.timeSlotId,
                subjectId: form.subjectId || null,
                teacherId: form.teacherId || null,
                roomId: form.roomId || null,
                classId: classId || null,
                schoolId,
                day: slot?.day || '',
                startTime: slot?.startTime || '',
                endTime: slot?.endTime || '',
                updatedAt: serverTimestamp()
            };

            if (editingEntry) {
                updateDocumentNonBlocking(doc(firestore, 'timetables', editingEntry.id), data);
                toast({ title: "Assignment Updated" });
            } else {
                await addDoc(collection(firestore, 'timetables'), {
                    ...data,
                    createdAt: serverTimestamp()
                });
                toast({ title: "Entry Added", description: "The lesson has been assigned to the timetable." });
            }
            onSuccess();
            setOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!firestore || !editingEntry) return;
        setIsDeleting(true);
        try {
            await deleteDoc(doc(firestore, 'timetables', editingEntry.id));
            toast({ title: "Lesson Removed", description: "The slot is now empty." });
            onSuccess();
            setOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsDeleting(false);
        }
    };

    const lessonTimeSlots = timeSlots.filter(ts => ts.type === 'Lesson' || !ts.type);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{editingEntry ? 'Edit Lesson Assignment' : 'Manual Lesson Assignment'}</DialogTitle>
                    <DialogDescription>Assign a subject, teacher, and room to a specific time slot.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Time Slot</Label>
                        <Select onValueChange={(v) => setForm({...form, timeSlotId: v})} value={form.timeSlotId} disabled={!!editingEntry}>
                            <SelectTrigger className="bg-white"><SelectValue placeholder="Select Slot..." /></SelectTrigger>
                            <SelectContent>
                                {lessonTimeSlots.sort((a,b) => {
                                    const dayMap: any = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5 };
                                    if (dayMap[a.day] !== dayMap[b.day]) return dayMap[a.day] - dayMap[b.day];
                                    return a.startTime.localeCompare(b.startTime);
                                }).map(ts => (
                                    <SelectItem key={ts.id} value={ts.id}>{ts.day} @ {ts.startTime}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select onValueChange={(v) => setForm({...form, subjectId: v})} value={form.subjectId}>
                            <SelectTrigger><SelectValue placeholder="Select Subject..." /></SelectTrigger>
                            <SelectContent>
                                {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Teacher</Label>
                        <Select onValueChange={(v) => setForm({...form, teacherId: v})} value={form.teacherId}>
                            <SelectTrigger><SelectValue placeholder="Select Teacher..." /></SelectTrigger>
                            <SelectContent>
                                {teachers.map(t => <SelectItem key={t.uid} value={t.uid}>{t.firstName} {t.lastName}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Room</Label>
                        <Select onValueChange={(v) => setForm({...form, roomId: v})} value={form.roomId}>
                            <SelectTrigger><SelectValue placeholder="Select Room..." /></SelectTrigger>
                            <SelectContent>
                                {rooms.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    {editingEntry && (
                        <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={handleDelete} disabled={isDeleting || isSubmitting}>
                            {isDeleting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Trash2 className="mr-2 h-4 w-4"/>}
                            Remove from Timetable
                        </Button>
                    )}
                    <Button onClick={handleSubmit} disabled={isSubmitting || isDeleting} className="flex-1">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>}
                        {editingEntry ? 'Save Changes' : 'Add to Timetable'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- SUB-COMPONENT: CONFIGURATION TAB ---
function TimetableConfig({ schoolId, timeSlots, rooms, classes, onRefresh }: { schoolId: string, timeSlots: TimeSlot[], rooms: Room[], classes: Class[], onRefresh: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [newSlot, setNewSlot] = useState({ 
        days: ['Monday'], 
        start: '08:00', 
        end: '08:45', 
        type: 'Lesson' as any, 
        classId: 'all' 
    });
    
    const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);

    const handleAddSlot = async () => {
        if (!firestore || !schoolId || newSlot.days.length === 0) return;
        setLoading(true);
        try {
            const batch = writeBatch(firestore);
            const classStamp = newSlot.classId === 'all' ? 'global' : newSlot.classId;
            
            newSlot.days.forEach(d => {
                const id = `${schoolId}-${classStamp}-${d.substring(0,3)}-${newSlot.start.replace(':','')}`;
                const ref = doc(firestore, 'timeSlots', id);
                batch.set(ref, {
                    id,
                    day: d,
                    startTime: newSlot.start,
                    endTime: newSlot.end,
                    type: newSlot.type,
                    classId: newSlot.classId === 'all' ? null : newSlot.classId,
                    schoolId
                });
            });

            await batch.commit();
            toast({ title: newSlot.days.length > 1 ? "Multiple Slots Added" : "Slot Added" });
            onRefresh();
        } catch (e: any) { toast({ variant: 'destructive', title: "Error", description: e.message }); }
        finally { setLoading(false); }
    };

    const handleUpdateSlot = async (slot: TimeSlot) => {
        if (!firestore) return;
        setLoading(true);
        try {
            updateDocumentNonBlocking(doc(firestore, 'timeSlots', slot.id), {
                type: slot.type,
                startTime: slot.startTime,
                endTime: slot.endTime,
                day: slot.day,
                classId: (slot.classId === 'all' || !slot.classId) ? null : slot.classId,
            });
            toast({ title: "Slot Updated" });
            setEditingSlot(null);
            onRefresh();
        } catch (e: any) { toast({ variant: 'destructive', title: "Error", description: e.message }); }
        finally { setLoading(false); }
    };

    const handleDelete = async (coll: string, id: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, coll, id));
            toast({ title: "Deleted" });
            onRefresh();
        } catch (e: any) { toast({ variant: 'destructive', title: "Error", description: e.message }); }
    };

    const toggleDay = (day: string) => {
        setNewSlot(prev => ({
            ...prev,
            days: prev.days.includes(day) 
                ? prev.days.filter(d => d !== day) 
                : [...prev.days, day]
        }));
    };

    const applyAllWeekdays = () => {
        setNewSlot(prev => ({
            ...prev,
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }));
    };

    return (
        <div className="space-y-8 animate-in fade-in">
            <TimetableSeeder />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2"><Clock className="h-4 w-4"/> Schedule Intervals</CardTitle>
                        <CardDescription>Define periods, breaks, and lunch times.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Apply to Days</Label>
                                    <Button variant="ghost" size="sm" onClick={applyAllWeekdays} className="h-6 text-[9px] font-black uppercase text-indigo-600 px-2 rounded-lg hover:bg-indigo-50">Mon - Fri</Button>
                                </div>
                                <div className="flex gap-2">
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                                        <button 
                                            key={d}
                                            type="button"
                                            onClick={() => toggleDay(d)}
                                            className={cn(
                                                "w-9 h-9 rounded-xl text-xs font-black transition-all flex items-center justify-center border-2",
                                                newSlot.days.includes(d) 
                                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" 
                                                    : "bg-white border-slate-200 text-slate-400 hover:border-indigo-200"
                                            )}
                                        >
                                            {d.substring(0,1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-bold uppercase text-slate-400 ml-1">Class Scope</Label>
                                    <Select value={newSlot.classId} onValueChange={(v) => setNewSlot({...newSlot, classId: v})}>
                                        <SelectTrigger className="h-10 text-xs bg-white border-2 rounded-xl"><SelectValue placeholder="Scope" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Global (All Classes)</SelectItem>
                                            {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-bold uppercase text-slate-400 ml-1">Slot Type</Label>
                                    <Select value={newSlot.type} onValueChange={(v) => setNewSlot({...newSlot, type: v})}>
                                        <SelectTrigger className="h-10 text-xs bg-white border-2 rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Lesson">Lesson</SelectItem>
                                            <SelectItem value="Break">Short Break</SelectItem>
                                            <SelectItem value="Lunch">Lunch</SelectItem>
                                            <SelectItem value="Worship">Worship</SelectItem>
                                            <SelectItem value="Event">Event</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 items-end">
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-bold uppercase text-slate-400 ml-1">Start</Label>
                                    <Input type="time" value={newSlot.start} onChange={e => setNewSlot({...newSlot, start: e.target.value})} className="h-10 text-xs bg-white border-2 rounded-xl" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-bold uppercase text-slate-400 ml-1">End</Label>
                                    <Input type="time" value={newSlot.end} onChange={e => setNewSlot({...newSlot, end: e.target.value})} className="h-10 text-xs bg-white border-2 rounded-xl" />
                                </div>
                                <Button onClick={handleAddSlot} disabled={loading || newSlot.days.length === 0} className="h-10 bg-indigo-600 rounded-xl font-bold shadow-md shadow-indigo-100">
                                    {loading ? <Loader2 className="animate-spin h-4 w-4"/> : <Plus className="h-4 w-4"/>}
                                </Button>
                            </div>
                        </div>
                        
                        <div className="max-h-[400px] overflow-y-auto space-y-1 pr-2">
                            {timeSlots.sort((a,b) => {
                                const dayMap: any = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5 };
                                if (dayMap[a.day] !== dayMap[b.day]) return dayMap[a.day] - dayMap[b.day];
                                return a.startTime.localeCompare(b.startTime);
                            }).map(ts => {
                                const targetClassName = ts.classId ? classes.find(c => c.id === ts.classId)?.name : 'Global';
                                return (
                                    <div key={ts.id} className="flex items-center justify-between p-3 text-xs border rounded-xl hover:bg-slate-50 group">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] w-12 justify-center">{ts.day.substring(0,3)}</Badge>
                                            <span className="font-bold">{ts.startTime} - {ts.endTime}</span>
                                            <Badge variant="secondary" className={cn("text-[9px] uppercase", ts.type === 'Break' ? "bg-orange-100 text-orange-700" : ts.type === 'Lunch' ? "bg-green-100 text-green-700" : "")}>
                                                {ts.type || 'Lesson'}
                                            </Badge>
                                            <span className="text-[10px] text-slate-400 font-bold ml-2">({targetClassName})</span>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-indigo-600" onClick={() => setEditingSlot(ts)}><Edit className="h-3.5 w-3.5"/></Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5"/></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="rounded-3xl border-4 border-slate-900">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-xl font-black uppercase italic">Delete Slot?</AlertDialogTitle>
                                                        <AlertDialogDescription className="font-bold text-slate-600">
                                                            Are you sure you want to remove the {ts.startTime} slot on {ts.day}? This may affect existing scheduled lessons.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete('timeSlots', ts.id)} className="bg-red-600 rounded-xl font-black uppercase">Confirm Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2"><MapPin className="h-4 w-4"/> Physical Locations</CardTitle>
                        <CardDescription>Rooms, labs, and fields.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <TimetableConfigRooms schoolId={schoolId} rooms={rooms} onRefresh={onRefresh} />
                    </CardContent>
                </Card>
            </div>

            {editingSlot && (
                <Dialog open={!!editingSlot} onOpenChange={() => setEditingSlot(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>Edit Time Slot</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Day</Label>
                                    <Select value={editingSlot.day} onValueChange={(v) => setEditingSlot({...editingSlot, day: v})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Class Scope</Label>
                                    <Select value={editingSlot.classId || 'all'} onValueChange={(v) => setEditingSlot({...editingSlot, classId: v === 'all' ? null : v})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Classes (Global)</SelectItem>
                                            {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select value={editingSlot.type} onValueChange={(v: any) => setEditingSlot({...editingSlot, type: v})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Lesson">Lesson</SelectItem>
                                            <SelectItem value="Break">Short Break</SelectItem>
                                            <SelectItem value="Lunch">Lunch</SelectItem>
                                            <SelectItem value="Worship">Worship/Assembly</SelectItem>
                                            <SelectItem value="Event">Other Event</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Start Time</Label><Input type="time" value={editingSlot.startTime} onChange={e => setEditingSlot({...editingSlot, startTime: e.target.value})} /></div>
                                <div className="space-y-2"><Label>End Time</Label><Input type="time" value={editingSlot.endTime} onChange={e => setEditingSlot({...editingSlot, endTime: e.target.value})} /></div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingSlot(null)}>Cancel</Button>
                            <Button onClick={() => handleUpdateSlot(editingSlot)}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

function TimetableConfigRooms({ schoolId, rooms, onRefresh }: { schoolId: string, rooms: Room[], onRefresh: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [newRoom, setNewRoom] = useState({ name: '', isLab: false });

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

    const handleDelete = async (id: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'rooms', id));
            toast({ title: "Deleted" });
            onRefresh();
        } catch (e: any) { toast({ variant: 'destructive', title: "Error", description: e.message }); }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border">
                <Input placeholder="Room Name..." value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} className="h-10 text-sm bg-white" />
                <div className="flex items-center justify-between px-2">
                    <Label className="text-[10px] uppercase font-black text-slate-500">Specialized Lab?</Label>
                    <Switch checked={newRoom.isLab} onCheckedChange={(v) => setNewRoom({...newRoom, isLab: v})} />
                </div>
                <Button onClick={handleAddRoom} disabled={loading || !newRoom.name} size="sm" className="w-full bg-indigo-600 h-10">Add Room</Button>
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-1">
                {rooms.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-3 text-sm border rounded-xl hover:bg-slate-50 group">
                        <span className="flex items-center gap-2 font-medium">
                            {r.name}
                            {r.isLab && <Badge variant="outline" className="text-[8px] bg-orange-50 text-orange-700 h-4 uppercase border-orange-200">Lab</Badge>}
                        </span>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="h-3.5 w-3.5"/></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl border-4 border-slate-900">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-black uppercase italic">Remove Room?</AlertDialogTitle>
                                    <AlertDialogDescription className="font-bold text-slate-600">Permanently delete <strong>{r.name}</strong> from the school's room directory?</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(r.id)} className="bg-red-600 rounded-xl font-black uppercase">Confirm Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ))}
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
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
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
    toast({ title: "AI is on the job!", description: "Generating a 5-day schedule Day-by-Day. Please wait..." });

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
        timeSlots: timeSlots?.map(({ id, day, startTime, endTime, type, classId }) => ({ id, day, startTime, endTime, type, classId })) || [],
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
      
      if (!result.success) throw new Error(result.error);

      const batch = writeBatch(firestore);

      if(timetable) {
          timetable.forEach(entry => {
            batch.delete(doc(firestore, 'timetables', entry.id));
          });
      }
      
      if (result && result.timetable) {
          result.timetable.forEach((entry: any) => {
            const newDocRef = doc(collection(firestore, 'timetables'));
            batch.set(newDocRef, { 
                ...entry, 
                schoolId: schoolId || null,
                createdAt: serverTimestamp()
            });
          });
      }
      
      await batch.commit();
      toast({ title: "Success!", description: `A new timetable has been generated.` });
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

  const filteredTimeSlots = useMemo(() => {
      if (!timeSlots || !selectedClassId) return [];
      return timeSlots.filter(ts => !ts.classId || ts.classId === selectedClassId);
  }, [timeSlots, selectedClassId]);

  const readiness = useMemo(() => {
    const hasSlots = (timeSlots?.length || 0) > 0;
    const hasRooms = (rooms?.length || 0) > 0;
    const hasSubjects = (subjects?.length || 0) > 0;
    const hasClasses = (classes?.length || 0) > 0;
    const hasTeachers = (allTeachers?.length || 0) > 0;

    const subjectsMissingTeachers = subjects?.filter(s => (s.teacherIds?.length || 0) === 0) || [];
    const classesMissingRooms = classes?.filter(c => !c.homeRoomId) || [];

    const isFullyReady = hasSlots && hasRooms && hasSubjects && hasClasses && hasTeachers && 
                         subjectsMissingTeachers.length === 0 && classesMissingRooms.length === 0;

    return {
      hasSlots, hasRooms, hasSubjects, hasClasses, hasTeachers,
      isFullyReady,
      missingSubjects: subjectsMissingTeachers,
      missingRooms: classesMissingRooms,
      counts: { 
        subjectsWithTeachers: (subjects?.length || 0) - subjectsMissingTeachers.length, 
        classesWithRooms: (classes?.length || 0) - classesMissingRooms.length, 
        totalSubjects: subjects?.length || 0, 
        totalClasses: classes?.length || 0 
      }
    };
  }, [timeSlots, rooms, subjects, classes, allTeachers]);

  const stats = useMemo(() => {
      const lessonSlots = timeSlots?.filter(ts => ts.type === 'Lesson' || !ts.type) || [];
      const totalPeriods = lessonSlots.filter(ts => !ts.classId || ts.classId === selectedClassId).length || 0;
      
      const assignedCount = filteredTimetable.length;
      const openSlots = Math.max(0, totalPeriods - assignedCount);
      const utilization = totalPeriods > 0 ? Math.round((assignedCount / totalPeriods) * 100) : 0;
      
      const breakTimeSlots = timeSlots?.filter(ts => ts.type === 'Break' || ts.type === 'Lunch' || ts.type === 'Worship' || ts.type === 'Event') || [];
      const filteredBreaks = breakTimeSlots.filter(ts => !ts.classId || ts.classId === selectedClassId);
      
      let totalBreakMinutes = 0;
      filteredBreaks.forEach(ts => {
          try {
              const [sHour, sMin] = ts.startTime.split(':').map(Number);
              const [eHour, eMin] = ts.endTime.split(':').map(Number);
              const diff = (eHour * 60 + eMin) - (sHour * 60 + sMin);
              if (diff > 0) totalBreakMinutes += diff;
          } catch(e) {}
      });

      return {
          totalPeriods,
          assignedCount,
          openSlots,
          utilization,
          totalBreakMinutes
      };
  }, [timeSlots, filteredTimetable, selectedClassId]);

  if (!canAccess && !isLoadingSchool) return <Card className="p-8 text-center text-red-500">Access Denied</Card>;

  return (
    <div className="space-y-6">
      {/* Premium Gradient Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-8 md:p-10 shadow-xl border border-indigo-950/20 text-white">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[80px]" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-indigo-200 text-xs font-black uppercase tracking-wider">
                      <CalendarDays className="h-3.5 w-3.5" /> Academic Planning Hub
                  </div>
                  <div className="space-y-2">
                      <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight uppercase italic">
                          Timetable & AI Planner
                      </h1>
                      <p className="text-indigo-200/80 text-sm md:text-base max-w-xl font-medium leading-relaxed font-sans">
                          Generate weekly timetables dynamically, manage room locations, and configure time slots. Powered by Gemini AI constraints engine.
                      </p>
                  </div>
              </div>
              
              <div className="shrink-0 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                  <CreditBalance />
              </div>
          </div>
      </div>

      <Tabs defaultValue="view" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
                <TabsTrigger value="view" className="rounded-xl font-black text-xs uppercase px-6 py-2.5 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" /> Timetable View
                </TabsTrigger>
                {canManage && (
                    <TabsTrigger value="config" className="rounded-xl font-black text-xs uppercase px-6 py-2.5 flex items-center gap-2">
                        <Settings2 className="h-4 w-4" /> Configuration
                    </TabsTrigger>
                )}
            </TabsList>
            
            <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={() => { refetchTimetable(); refetchSlots(); refetchRooms(); }} className="gap-2 rounded-xl font-bold border-slate-200 hover:bg-slate-50/50 shadow-sm flex-1 sm:flex-initial justify-center">
                    <RefreshCw className={cn("h-4 w-4 text-indigo-650", isTimetableLoading && "animate-spin")} /> Sync Data
                </Button>
                {canManage && selectedClassId && (
                    <Button onClick={() => { setEditingEntry(null); setIsManualOpen(true); }} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md flex-1 sm:flex-initial justify-center">
                        <Plus className="mr-2 h-4 w-4 text-indigo-400"/> Manual Assignment
                    </Button>
                )}
            </div>
        </div>

        <TabsContent value="view" className="space-y-6">
            {/* Dynamic stats row */}
            {selectedClassId && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-300">
                    <Card className="rounded-3xl border border-slate-150/80 bg-white p-5 shadow-sm hover:shadow-md transition-all">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Scheduled Periods</p>
                        <p className="text-2xl font-black text-indigo-650 mt-1">{stats.assignedCount}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Lessons Active</p>
                    </Card>
                    <Card className="rounded-3xl border border-slate-150/80 bg-white p-5 shadow-sm hover:shadow-md transition-all">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Available Slots</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">{stats.openSlots}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Periods Free</p>
                    </Card>
                    <Card className="rounded-3xl border border-slate-150/80 bg-white p-5 shadow-sm hover:shadow-md transition-all">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Class Utilization</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl font-black text-emerald-650">{stats.utilization}%</span>
                            <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.utilization}%` }} />
                            </div>
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Occupancy Rate</p>
                    </Card>
                    <Card className="rounded-3xl border border-slate-150/80 bg-white p-5 shadow-sm hover:shadow-md transition-all">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Recess & Breaks</p>
                        <p className="text-2xl font-black text-amber-650 mt-1">{stats.totalBreakMinutes}m</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Recess Duration</p>
                    </Card>
                </div>
            )}

            <Card className="border border-slate-150/80 rounded-[2rem] shadow-md overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-6 md:p-8 border-b border-slate-150/80">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-xl font-black text-slate-900 tracking-tight italic uppercase flex items-center gap-2">
                                <CalendarDays className="h-5.5 w-5.5 text-indigo-650"/> Weekly Schedule
                            </CardTitle>
                            <CardDescription className="text-xs font-semibold text-slate-450 mt-0.5">View official class lessons and scheduled recess slots.</CardDescription>
                        </div>
                        <div className="w-full md:w-64">
                            <Select onValueChange={setSelectedClassId} value={selectedClassId}>
                                <SelectTrigger className="bg-white border-2 border-slate-200 h-11 rounded-xl font-bold"><SelectValue placeholder="Select Class..." /></SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                    {isTimetableLoading ? (
                        <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
                    ) : selectedClassId ? (
                        <div className="space-y-4">
                            <TimetableDisplay 
                                timetable={filteredTimetable}
                                subjects={subjects || []}
                                teachers={allTeachers || []}
                                rooms={rooms || []}
                                timeSlots={filteredTimeSlots}
                                onEditEntry={canManage ? (entry) => { setEditingEntry(entry); setIsManualOpen(true); } : undefined}
                            />
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-6">
                            <Info className="h-10 w-10 text-slate-300 mx-auto mb-2 animate-pulse" />
                            <p className="text-slate-450 font-bold uppercase tracking-widest text-xs">Please select a class to view its weekly timetable.</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="bg-slate-50/50 p-5 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-150/80">
                    <span className="flex items-center gap-1.5"><BookCopy size={12} className="text-indigo-500" /> PE, Worship, and Club time should be added as 'Subjects'</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-indigo-500" /> Breaks are configured in the 'Configuration' tab</span>
                </CardFooter>
            </Card>

            {canManage && (
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="flex items-center gap-2 text-emerald-400 uppercase italic tracking-tight text-xl font-black"><Wand2 /> AI Scheduler Engine</CardTitle>
                        <CardDescription className="text-slate-400 font-medium">Generate a conflict-free school schedule automatically based on institutional rules.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 space-y-8 relative z-10">
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ChecklistItem 
                                icon={Clock} 
                                title="Time Slots" 
                                status={readiness.hasSlots} 
                                desc={`${timeSlots?.length || 0} periods defined.`} 
                            />
                            <ChecklistItem 
                                icon={MapPin} 
                                title="Rooms & Labs" 
                                status={readiness.counts.classesWithRooms === readiness.counts.totalClasses && readiness.counts.totalClasses > 0} 
                                desc={`${readiness.counts.classesWithRooms}/${readiness.counts.totalClasses} classes have rooms.`} 
                            />
                            <ChecklistItem 
                                icon={BookCopy} 
                                title="Subjects & Teachers" 
                                status={readiness.counts.subjectsWithTeachers === readiness.counts.totalSubjects && readiness.counts.totalSubjects > 0} 
                                desc={`${readiness.counts.subjectsWithTeachers}/${readiness.counts.totalSubjects} subjects have teachers.`} 
                            />
                        </div>

                        {!readiness.isFullyReady && (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                {readiness.missingSubjects.length > 0 && (
                                    <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 text-red-200 rounded-2xl">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle className="font-bold">Missing Teachers</AlertTitle>
                                        <AlertDescription className="text-xs">
                                            The following subjects need at least one teacher assigned in Academics {`>`} Subjects:
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {readiness.missingSubjects.map(s => (
                                                    <Badge key={s.id} variant="secondary" className="bg-red-500/20 text-red-200 border-red-500/30">
                                                        {s.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {readiness.missingRooms.length > 0 && (
                                    <Alert variant="destructive" className="bg-orange-900/20 border-orange-500/50 text-orange-200 rounded-2xl">
                                        <MapPin className="h-4 w-4" />
                                        <AlertTitle className="font-bold">Missing Home Rooms</AlertTitle>
                                        <AlertDescription className="text-xs">
                                            These classes need a 'Primary Room' assigned in Academics {`>`} Classes:
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {readiness.missingRooms.map(c => (
                                                    <Badge key={c.id} variant="secondary" className="bg-orange-50/20 text-orange-200 border-orange-500/30">
                                                        {c.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6 pt-4">
                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Custom Constraints</Label>
                                <Textarea
                                    placeholder="Add constraints: e.g., 'Math classes must be in the morning'."
                                    value={customConstraint}
                                    onChange={(e) => setCustomConstraint(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white min-h-[120px] rounded-2xl"
                                />
                                <Button 
                                    onClick={handleGenerateTimetable} 
                                    disabled={isGenerating || !readiness.isFullyReady} 
                                    className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-lg shadow-xl active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isGenerating ? <Loader2 className="mr-2 h-4 w-6 animate-spin" /> : <Wand2 className="mr-2 h-4 w-6" />}
                                    RUN AI SCHEDULER (-50 Credits)
                                </Button>
                            </div>
                            
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                <h4 className="text-sm font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                    <Settings2 className="h-4 w-4 text-emerald-400"/> AI Logic Rules
                                </h4>
                                <ul className="space-y-3 text-[11px] font-medium text-slate-300">
                                    <li className="flex gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                        <span><strong>Auto-Skip Breaks:</strong> The AI will not assign subjects to any time slot marked as 'Break' or 'Lunch'.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                        <span><strong>Conflict Prevention:</strong> 100% guarantee that no teacher is scheduled in two rooms at once.</span>
                                    </li>
                                </ul>
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
                    classes={classes || []}
                    onRefresh={() => { refetchSlots(); refetchRooms(); }} 
                />
            )}
        </TabsContent>
      </Tabs>

      {selectedClassId && schoolId && (
          <LessonAssignmentDialog 
            open={isManualOpen}
            setOpen={setIsManualOpen}
            classId={selectedClassId}
            subjects={subjects || []}
            teachers={allTeachers || []}
            rooms={rooms || []}
            timeSlots={filteredTimeSlots}
            editingEntry={editingEntry}
            onSuccess={refetchTimetable}
          />
      )}
    </div>
  );
}

function ChecklistItem({ icon: Icon, title, status, desc }: { icon: any, title: string, status: boolean, desc: string }) {
    return (
        <div className={cn(
            "p-5 rounded-3xl border-2 transition-all duration-300 flex items-center justify-between gap-4",
            status 
                ? "bg-emerald-500/10 border-emerald-500/20 text-white" 
                : "bg-rose-500/5 border-rose-500/15 opacity-85 text-slate-400"
        )}>
            <div className="space-y-1">
                <p className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <Icon className={cn("h-4 w-4 shrink-0", status ? "text-emerald-400" : "text-rose-400")} />
                    {title}
                </p>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{desc}</p>
            </div>
            <div className={cn("p-1.5 rounded-full shrink-0", status ? "bg-emerald-500 text-slate-950" : "bg-rose-500/20 text-rose-400 border border-rose-500/30")}>
                {status ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            </div>
        </div>
    );
}
