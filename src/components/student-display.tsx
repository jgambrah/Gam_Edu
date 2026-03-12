'use client';

import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { Student } from '@/lib/types';
import { formatStudentId, formatStudentBadge } from '@/lib/student-utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


interface StudentDisplayProps {
  student?: Student;
  variant?: 'full' | 'compact' | 'badge' | 'list';
  showAvatar?: boolean;
  className?: string;
}

/**
 * Reusable component for consistent student display
 * Use this everywhere instead of manually formatting names
 */
export function StudentDisplay({ 
  student, 
  variant = 'full', 
  showAvatar = false,
  className = '' 
}: StudentDisplayProps) {

  if (!student) {
    return <span className='text-muted-foreground italic'>Unknown Student</span>;
  }
  
  // Full display (for cards, detailed views)
  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {showAvatar && (
          <Avatar className="h-10 w-10">
            {student.photoURL && <AvatarImage src={student.photoURL} alt={student.firstName} className="object-cover" />}
            <AvatarFallback>{student.firstName?.charAt(0)}{student.lastName?.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div>
          <p className="font-semibold text-slate-800">
            {student.firstName} {student.lastName}
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            {formatStudentId(student)}
          </p>
        </div>
      </div>
    );
  }
  
  // Compact (for dropdowns, select items)
  if (variant === 'compact') {
    return (
      <span className={`flex items-center gap-2 ${className}`}>
        {showAvatar && (
          <Avatar className="h-6 w-6">
            {student.photoURL && <AvatarImage src={student.photoURL} alt={student.firstName} className="object-cover" />}
            <AvatarFallback className="text-[8px]">{student.firstName?.charAt(0)}{student.lastName?.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <span>
          {student.firstName} {student.lastName} 
          <span className="text-muted-foreground text-xs ml-2 font-mono">
            ({formatStudentId(student)})
          </span>
        </span>
      </span>
    );
  }
  
  // Badge (for tags, chips)
  if (variant === 'badge') {
    return (
      <Badge variant="outline" className={className}>
        <User className="h-3 w-3 mr-1" />
        {formatStudentBadge(student)}
      </Badge>
    );
  }
  
  // List item (for tables, lists)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showAvatar && (
        <Avatar className="h-8 w-8">
          {student.photoURL && <AvatarImage src={student.photoURL} alt={student.firstName} className="object-cover" />}
          <AvatarFallback className="text-[10px]">{student.firstName?.charAt(0)}{student.lastName?.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col">
        <span className="font-medium">{student.firstName} {student.lastName}</span>
        <span className="text-xs text-muted-foreground font-mono">
          {formatStudentId(student)}
        </span>
      </div>
    </div>
  );
}
