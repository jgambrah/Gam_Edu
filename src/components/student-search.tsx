
'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface StudentSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function StudentSearchInput({ 
  value, 
  onChange, 
  placeholder = "Search by name, email, or student ID...",
  className = ""
}: StudentSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
