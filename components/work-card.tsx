import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { Work } from '@/lib/types';
export function WorkCard({
  work,
  detailed = false,
}: {
  work: Work;
  detailed?: boolean;
}) {
  return (
    <article className="work-card">
      {work.image && (
        <a
          className={`work-media ${work.style}`}
          href={work.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${work.title} on NIPPYSKY`}
        >
          <Image
            src={work.image}
            alt={work.imageAlt || work.title}
            width={1200}
            height={900}
            sizes="(max-width:580px) 100vw, 50vw"
          />
        </a>
      )}
      <div className="work-info">
        <div className="work-meta">
          <span>{work.category}</span>
          <span>{work.year}</span>
        </div>
        <a
          className="work-title"
          href={work.url}
          target="_blank"
          rel="noreferrer"
        >
          <h3>{work.title}</h3>
          <ArrowUpRight size={22} />
        </a>
        <p>{detailed ? work.contribution : work.summary}</p>
        <div className="work-role">{work.role}</div>
        {detailed && <p>{work.decision}</p>}
        <div className="work-tags">
          {work.tags?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <a
          className="text-link work-case-link"
          href={work.url}
          target="_blank"
          rel="noreferrer"
        >
          Read the case study on NIPPYSKY <ArrowUpRight size={15} />
        </a>
      </div>
    </article>
  );
}
