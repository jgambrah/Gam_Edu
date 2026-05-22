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
  
  // Get unique start times for the row structure, sorted numerically
  const uniqueTimePoints = useMemo(() => {
    return Array.from(new Set(timeSlots.map(ts => ts.startTime))).sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [timeSlots]);

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
                    const slotsAtTime = timeSlots.filter(ts => ts.startTime === startTime);
                    
                    // Logic: If all slots at this time across all 5 days are the same non-lesson type, render a unified bar.
                    const firstSlot = slotsAtTime[0];
                    const isUnifiedBar = firstSlot && (firstSlot.type === 'Break' || firstSlot.type === 'Lunch' || firstSlot.type === 'Worship') && 
                                       slotsAtTime.length >= 5 && 
                                       slotsAtTime.every(s => s.type === firstSlot.type);

                    return (
                        <TableRow key={startTime}>
                            <TableCell className="font-bold bg-slate-50/50 py-4 text-center">
                                <div className="text-sm text-slate-900">{startTime}</div>
                                <div className="text-[9px] text-slate-400">{firstSlot?.endTime || ''}</div>
                            </TableCell>
                            {isUnifiedBar ? (
                                <TableCell colSpan={5} className="p-0 border-l">
                                    <div className="flex items-center justify-center gap-2 h-20 bg-slate-100/50 border-y border-dashed border-slate-200">
                                        {firstSlot.type === 'Break' ? <Coffee className="h-4 w-4 text-slate-400" /> : <Utensils className="h-4 w-4 text-slate-400" />}
                                        <span className="font-black text-[10px] uppercase tracking-[0.5em] text-slate-400">
                                            {firstSlot.label || firstSlot.type.toUpperCase()}
                                        </span>
                                    </div>
                                </TableCell>
                            ) : (
                                days.map(day => {
                                    const slot = timeSlots.find(ts => ts.day === day && ts.startTime === startTime);
                                    if (!slot) return <TableCell key={day} className="border-l bg-slate-50/10"></TableCell>;

                                    if (slot.type === 'Break' || slot.type === 'Lunch' || slot.type === 'Worship') {
                                        return (
                                            <TableCell key={day} className="p-1 border-l align-middle text-center bg-slate-50/50">
                                                <div className="flex flex-col items-center justify-center py-4 opacity-50">
                                                    {slot.type === 'Break' ? <Coffee className="h-3 w-3 mb-1" /> : <Utensils className="h-3 w-3 mb-1" />}
                                                    <span className="text-[8px] font-black uppercase tracking-widest">{slot.type}</span>
                                                </div>
                                            </TableCell>
                                        );
                                    }

                                    const entry = timetable.find(e => e.timeSlotId === slot.id || (e.day === day && e.startTime === startTime));
                                    if (entry) {
                                        const subject = subjects.find(s => s.id === entry.subjectId);
                                        const teacher = teachers.find(t => t.uid === entry.teacherId);
                                        const room = rooms.find(r => r.id === entry.roomId);
                                        
                                        return (
                                            <TableCell key={day} className="p-1 border-l align-top">
                                                <button 
                                                    onClick={() => onEditEntry?.(entry)}
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
            </TableBody>
        </Table>
    </div>
  );
}
