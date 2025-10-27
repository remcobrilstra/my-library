import React from 'react';
import { Search } from 'lucide-react';

import { Input } from '../ui/input';

interface BookSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function BookSearch({ value, onChange, placeholder = 'Search by title, author, or tag' }: BookSearchProps) {
  return (
    <label className="relative block w-full">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
        <Search className="h-4 w-4" aria-hidden="true" />
      </span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-10"
        aria-label="Search books"
      />
    </label>
  );
}
