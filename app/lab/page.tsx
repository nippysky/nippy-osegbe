import { pageMetadata } from '@/lib/seo';
import { ArrowUpRight } from 'lucide-react';
import { getLabs } from '@/lib/labs';
import { LabList } from '@/components/lab-list';
export const revalidate = 300;
export async function generateMetadata() {
  return pageMetadata(
    'AI & ML Lab',
    'AI and machine learning coursework, experiments and projects by Chukwudubem Osegbe, MSc AI & Automation student at University West in Sweden.',
    '/lab',
  );
}
export default async function LabPage() {
  const { labs, unavailable } = await getLabs();
  return (
    <>
      <div className="page-intro shell">
        <p className="eyebrow">THE LAB / AI · MACHINE LEARNING · AUTOMATION</p>
        <h1>
          Learning in public.
          <br />
          <span className="accent">Building understanding.</span>
        </h1>
        <p>
          I’m studying AI & Automation at University West and developing my
          AI/ML practice through code. This is where coursework, experiments and
          early projects become a record of progress.
        </p>
        <p className="current-focus">
          Open to AI/ML roles where I can contribute my software and systems
          experience while growing in the field.
        </p>
      </div>
      <section className="section shell" aria-label="AI and ML projects">
        {labs.length ? (
          <LabList labs={labs} />
        ) : (
          <div className="empty-state">
            <h2>
              {unavailable
                ? 'Lab updates temporarily unavailable.'
                : 'Experiments in progress.'}
            </h2>
            <p>My latest code and project notes are available on GitHub.</p>
            <a
              className="text-link"
              href="https://github.com/nippysky"
              target="_blank"
              rel="noreferrer"
            >
              Explore GitHub <ArrowUpRight size={18} />
            </a>
          </div>
        )}
        <p className="lab-note">
          Each entry is labelled by its stage. Coursework and prototypes are
          part of the learning process; project notes and code explain the
          scope.
        </p>
      </section>
    </>
  );
}
