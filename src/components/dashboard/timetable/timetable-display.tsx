
'use client';

import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TimetableEntry, Subject, Room, TimeSlot } from "@/lib/types";
import { Building, UserCircle } from "lucide-react";

type Teacher = { uid: string; firstName: string; lastName: string; };

type TimetableDisplayProps = {
  timetable: TimetableEntry[];
  subjects: Subject[];
  teachers: Teacher[];
  rooms: Room[];
  timeSlots: TimeSlot[];
};

export function TimetableDisplay({ timetable, subjects, teachers, rooms, timeSlots }: TimetableDisplayProps) {
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
    
    // B. Find the timetable entry for that slot
    // Use flexible matching for IDs just in case
    return timetable.find(entry => entry.timeSlotId === slot.id || (entry.day === day && entry.startTime === startTime));
  };

  return (
    <div className="border rounded-2xl overflow-hidden bg-white shadow-sm">
        <Table>
            <TableHeader>
                <TableRow className="bg-slate-50 border-b-2">
                    <TableHead className="w-[120px] font-black text-[10px] uppercase tracking-widest text-slate-400">Period</TableHead>
                    {days.map(day => (
                        <TableHead key={day} className="font-black text-[10px] uppercase tracking-widest text-slate-600 text-center border-l">
                            {day}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {uniqueTimePoints.map(startTime => {
                    // Get end time from any slot starting at this time
                    const endTime = timeSlots.find(ts => ts.startTime === startTime)?.endTime || '';
                    
                    return (
                        <TableRow key={startTime}>
                            <TableCell className="font-bold bg-slate-50/50 py-4 text-center">
                                <div className="text-sm text-slate-900">{startTime}</div>
                                <div className="text-[9px] text-slate-400">{endTime}</div>
                            </TableCell>
                            {days.map(day => {
                                const entry = getEntry(day, startTime);
                                if (entry) {
                                    const subject = subjects.find(s => s.id === entry.subjectId);
                                    const teacher = teachers.find(t => t.uid === entry.teacherId);
                                    const room = rooms.find(r => r.id === entry.roomId);
                                    
                                    return (
                                        <TableCell key={day} className="p-1 border-l align-top">
                                            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 h-full flex flex-col gap-1 min-h-[80px] hover:bg-indigo-50 transition-colors">
                                                <p className="font-black text-xs text-indigo-900 leading-tight line-clamp-2">
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
                                            </div>
                                        </TableCell>
                                    );
                                }
                                return <TableCell key={day} className="border-l bg-slate-50/10"></TableCell>;
                            })}
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
