'use client';

import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TimetableEntry, Subject, Room, TimeSlot } from "@/lib/types";
import { Building, UserCircle, Edit2, Coffee, Utensils } from "lucide-react";

type Teacher = { uid: string; firstName: string; lastName: string; };

type TimetableDisplayProps = {
  timetable: TimetableEntry[];
  subjects: Subject[];
  teachers: Teacher[];
  rooms: Room[];
  timeSlots: TimeSlot[];
  onEditEntry?: (entry: TimetableEntry) => void; 
};

export function TimetableDisplay({ timetable, subjects, teachers, rooms, timeSlots, onEditEntry }: TimetableDisplayProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // 1. Get unique start times to define the row structure, sorted numerically
  const uniqueTimePoints = useMemo(() => {
    return Array.from(new Set(timeSlots.map(ts => ts.startTime))).sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [timeSlots]);

  const getEntry = (day: string, startTime: string) => {
    // A. Find the specific slot for this day and time
    const slot = timeSlots.find(ts => ts.day === day && ts.startTime === startTime);
    if (!slot) return null;
    
    // B. Check for automatic institutional types (Break/Lunch)
    if (slot.type === 'Break' || slot.type === 'Lunch') {
        return { isInstitutional: true, type: slot.type, label: slot.label || slot.type.toUpperCase() };
    }
    
    // C. Find the user-assigned timetable entry
    return timetable.find(entry => entry.timeSlotId === slot.id || (entry.day === day && entry.startTime === startTime));
  };

  return (
    <div className="border rounded-2xl overflow-hidden bg-white shadow-sm">
        <Table>
            <TableHeader>
                <TableRow className="bg-slate-50 border-b-2">
                    <TableHead className="w-[120px] font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">Period</TableHead>
                    {days.map(day => (
                        <TableHead key={day} className="font-black text-[10px] uppercase tracking-widest text-slate-600 text-center border-l">
                            {day}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {uniqueTimePoints.map(startTime => {
                    const slotAtTime = timeSlots.find(ts => ts.startTime === startTime);
                    const isGlobalBreak = slotAtTime?.type === 'Break' || slotAtTime?.type === 'Lunch';
                    const endTime = slotAtTime?.endTime || '';
                    
                    return (
                        <TableRow key={startTime}>
                            <TableCell className="font-bold bg-slate-50/50 py-4 text-center">
                                <div className="text-sm text-slate-900">{startTime}</div>
                                <div className="text-[9px] text-slate-400">{endTime}</div>
                            </TableCell>
                            {isGlobalBreak ? (
                                <TableCell colSpan={5} className="p-0 border-l">
                                    <div className="flex items-center justify-center gap-2 h-20 bg-slate-100/50 border-y border-dashed border-slate-200">
                                        {slotAtTime.type === 'Break' ? <Coffee className="h-4 w-4 text-slate-400" /> : <Utensils className="h-4 w-4 text-slate-400" />}
                                        <span className="font-black text-[10px] uppercase tracking-[0.5em] text-slate-400">
                                            {slotAtTime.label || slotAtTime.type.toUpperCase()}
                                        </span>
                                    </div>
                                </TableCell>
                            ) : (
                                days.map(day => {
                                    const entry = getEntry(day, startTime);
                                    if (entry && !('isInstitutional' in entry)) {
                                        const subject = subjects.find(s => s.id === (entry as TimetableEntry).subjectId);
                                        const teacher = teachers.find(t => t.uid === (entry as TimetableEntry).teacherId);
                                        const room = rooms.find(r => r.id === (entry as TimetableEntry).roomId);
                                        
                                        return (
                                            <TableCell key={day} className="p-1 border-l align-top">
                                                <button 
                                                    onClick={() => onEditEntry?.(entry as TimetableEntry)}
                                                    className="w-full text-left p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 h-full flex flex-col gap-1 min-h-[90px] hover:bg-indigo-100 hover:border-indigo-300 transition-all group relative"
                                                >
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Edit2 className="h-3 w-3 text-indigo-400" />
                                                    </div>
                                                    <p className="font-black text-xs text-indigo-900 leading-tight line-clamp-2 pr-4">
                                                        {subject?.name || 'N/A'}
                                                    </p>
                                                    <div className="mt-auto space-y-0.5">
                                                        <p className="text-[9px] font-bold text-slate-500 uppercase truncate flex items-center gap-1">
                                                            <UserCircle className="h-2.5 w-2.5 opacity-40" /> {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'TBA'}
                                                        </p>
                                                        <p className="text-[9px] font-bold text-slate-500 uppercase truncate flex items-center gap-1">
                                                            <Building className="h-2.5 w-2.5 opacity-40" /> {room?.name || 'TBA'}
                                                        </p>
                                                    </div>
                                                </button>
                                            </TableCell>
                                        );
                                    }
                                    return <TableCell key={day} className="border-l bg-slate-50/10"></TableCell>;
                                })
                            )}
                        </TableRow>
                    );
                })}
                {uniqueTimePoints.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="py-20 text-center text-slate-400 italic">
                            No time slots defined. Go to the <strong>Configuration</strong> tab to initialize your school schedule.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
  );
}
