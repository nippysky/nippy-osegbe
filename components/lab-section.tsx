import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getLabs } from '@/lib/labs';
import { LabCard } from './lab-card';
export async function LabSection() {
  const { labs, unavailable } = await getLabs();
  return (
    <section className="lab-section">
      <div className="section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / LEARNING THROUGH BUILDING</p>
            <h2>
              AI & ML, in practice<span className="accent">.</span>
            </h2>
            <p className="lab-heading-copy">
              My working lab: coursework, experiments and projects as I study AI
              & Automation. A record of the questions I’m exploring and what I’m
              learning along the way.
            </p>
          </div>
          <Link className="text-link" href="/lab">
            Enter the lab <ArrowUpRight size={18} />
          </Link>
        </div>
        {labs.length > 0 ? (
          <div className="lab-grid">
            {labs.slice(0, 3).map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        ) : (
          <a
            className="text-link"
            href="https://github.com/nippysky"
            target="_blank"
            rel="noreferrer"
          >
            {unavailable
              ? 'Lab updates are temporarily unavailable. Explore GitHub'
              : 'Find my latest experiments on GitHub'}{' '}
            <ArrowUpRight size={18} />
          </a>
        )}
      </div>
    </section>
  );
}
