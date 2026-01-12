'use client';

import { Input, InputGroup } from 'rsuite';
import { Search } from 'lucide-react';

export function SearchInput({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <InputGroup inside className="rounded-full border border-border bg-card">
      <Input
        value={value}
        onChange={onChange}
        placeholder="Search articles"
        className="!rounded-full !py-3 !pl-10 !text-sm"
      />
      <InputGroup.Button className="!border-0" aria-label="Search">
        <Search size={16} />
      </InputGroup.Button>
    </InputGroup>
  );
}
