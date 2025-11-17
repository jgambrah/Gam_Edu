'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TimetableEntry, Subject, Room, TimeSlot } from "@/lib/types";
import { Book, Building, UserCircle } from "lucide-react";

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
  const sortedTimeSlots = timeSlots
    .filter((ts, index, self) => self.findIndex(t => t.startTime === ts.startTime) === index)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getEntry = (day: string, timeSlotId: string) => {
    const originalTimeSlot = timeSlots.find(ts => ts.id === timeSlotId);
    if (!originalTimeSlot) return null;

    const slot = timeSlots.find(ts => ts.day === day && ts.startTime === originalTimeSlot.startTime);
    if (!slot) return null;
    
    return timetable.find(entry => entry.day === day && entry.timeSlotId === slot.id);
  };

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          {days.map(day => <TableHead key={day}>{day}</TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedTimeSlots.map(timeSlot => (
          <TableRow key={timeSlot.id}>
            <TableCell className="font-medium">{timeSlot.startTime} - {timeSlot.endTime}</TableCell>
            {days.map(day => {
              const entry = getEntry(day, timeSlot.id);
              if (entry) {
                const subject = subjects.find(s => s.id === entry.subjectId);
                const teacher = teachers.find(t => t.uid === entry.teacherId);
                const room = rooms.find(r => r.id === entry.roomId);
                return (
                  <TableCell key={day} className="p-2 align-top">
                    <div className="p-2 bg-muted rounded-md space-y-1">
                      <p className="font-semibold text-sm flex items-center gap-1.5"><Book className="h-4 w-4" />{subject?.name || 'Unknown Subject'}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5"><UserCircle className="h-4 w-4" />{teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher'}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Building className="h-4 w-4" />{room?.name || 'Unknown Room'}</p>
                    </div>
                  </TableCell>
                );
              }
              return <TableCell key={day} className="text-xs text-center text-muted-foreground p-2 align-middle">Free Period</TableCell>;
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
