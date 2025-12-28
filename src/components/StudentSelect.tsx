
'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StudentDisplay } from './student-display';
import type { Student } from '@/lib/types';

interface StudentSelectProps {
  students: Student[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Reusable dropdown component for selecting a student.
 * Displays student name and ID for clarity.
 */
export function StudentSelect({
  students,
  value,
  onValueChange,
  placeholder = "Select a student...",
  className = ""
}: StudentSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {students.map((student) => (
          <SelectItem key={student.uid} value={student.uid}>
            <StudentDisplay student={student} variant="compact" />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
