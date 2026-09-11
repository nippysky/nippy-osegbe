import Image from 'next/image';
import { ArrowUpRight, FlaskConical } from 'lucide-react';
import type { Lab } from '@/lib/types';
export function LabCard({ lab }: { lab: Lab }) {
  const updated = lab.updatedAt
    ? new Intl.DateTimeFormat('en-GB', {
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(lab.updatedAt))
    : null;
  return (
    <article className="lab-card">
      {lab.image && (
        <Image
          className="lab-image"
          src={lab.image}
          alt={lab.imageAlt || lab.title}
          width={800}
          height={450}
          sizes="(max-width: 800px) 100vw, 50vw"
        />
      )}
      <div className="lab-card-head">
        <span>{lab.kind}</span>
        <FlaskConical size={18} />
      </div>
      <h3>{lab.title}</h3>
      <p>{lab.summary}</p>
      {lab.learningNotes && <p>{lab.learningNotes}</p>}
      <div className="work-tags">
        {[lab.language, ...lab.topics]
          .filter(Boolean)
          .filter((item, index, all) => all.indexOf(item) === index)
          .slice(0, 5)
          .map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
      </div>
      <a className="text-link" href={lab.url} target="_blank" rel="noreferrer">
        Explore the code <ArrowUpRight size={16} />
      </a>
      {updated && (
        <div className="lab-card-foot">
          <span>REPOSITORY UPDATED</span>
          <time dateTime={lab.updatedAt || ''}>{updated}</time>
        </div>
      )}
    </article>
  );
}
