'use client';
import { useState } from 'react';
import { LabCard } from './lab-card';
import type { Lab } from '@/lib/types';
export function LabList({ labs }: { labs: Lab[] }) {
  const [kind, setKind] = useState('All');
  const kinds = ['All', ...new Set(labs.map((lab) => lab.kind))];
  return (
    <>
      {kinds.length > 2 && (
        <div className="filters" aria-label="Filter labs by type">
          {kinds.map((item) => (
            <button
              key={item}
              className="filter-button"
              aria-pressed={kind === item}
              onClick={() => setKind(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
      <div className="lab-grid">
        {labs
          .filter((lab) => kind === 'All' || lab.kind === kind)
          .map((lab) => (
            <LabCard key={lab.id} lab={lab} />
          ))}
      </div>
    </>
  );
}
