import { pageMetadata, HOME_TITLE, HOME_DESCRIPTION } from '@/lib/seo';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import { getPortfolio } from '@/lib/content';
import { SystemExplorer } from '@/components/system-explorer';
import { WorkCard } from '@/components/work-card';
import { LabSection } from '@/components/lab-section';
export const revalidate = 300;
export async function generateMetadata() {
  return pageMetadata(HOME_TITLE, HOME_DESCRIPTION, '/');
}
export default async function Home() {
  const { settings, profile, work, education } = await getPortfolio();
  return (
    <>
      <section className="hero shell">
        <div className="hero-topline">
          <span>{settings.name}</span>
          <span>{settings.location}</span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span /> {profile.eyebrow}
            </p>
            <h1>
              {profile.headline.split('\n').map((line, i) => (
                <span className={i === 2 ? 'accent' : ''} key={line}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="hero-intro">{profile.intro}</p>
            <p className="current-focus">{profile.currentFocus}</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/work">
                Explore my work <ArrowUpRight size={18} />
              </Link>
              <Link className="button button-secondary" href="/lab">
                AI & ML Lab <ArrowUpRight size={18} />
              </Link>
              <a
                className="cv-link"
                href={settings.cv}
                target="_blank"
                rel="noreferrer"
              >
                <Download size={16} /> CV
              </a>
            </div>
            <p className="availability">
              <span />
              {profile.availability}
            </p>
          </div>
          <SystemExplorer />
        </div>
        <div className="hero-bottom">
          <span>
            PRODUCT THINKING. SYSTEMS EXPERIENCE. A GROWING AI PRACTICE.
          </span>
          <a href="#selected-work" aria-label="Scroll to selected work">
            <ArrowDown size={19} />
          </a>
        </div>
      </section>
      <section id="selected-work" className="section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / SELECTED WORK</p>
            <h2>
              Ideas, shipped into the world<span className="accent">.</span>
            </h2>
          </div>
          <Link className="text-link" href="/work">
            Explore the work <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="work-grid">
          {work
            .filter((item) => item.featured)
            .slice(0, 4)
            .map((item) => (
              <WorkCard key={item.id} work={item} />
            ))}
        </div>
      </section>
      <LabSection />
      <section className="section shell">
        <div className="founder-grid">
          <div className="founder-copy">
            <p className="eyebrow">03 / FOUNDER & BUILDER</p>
            <h2>
              Taking responsibility
              <br />
              for the whole picture<span className="accent">.</span>
            </h2>
            <p>
              I founded NIPPYSKY to turn ideas into useful products. I work
              across design, engineering and delivery, building our own ventures
              and collaborating with people who have something worth making.
            </p>
            <a
              className="text-link"
              href={settings.company}
              target="_blank"
              rel="noreferrer"
            >
              Meet NIPPYSKY <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="capabilities">
            <div className="capability">
              <span>01</span>
              <div>
                <h3>Products & engineering</h3>
                <p>
                  Web and mobile experiences. React, Next.js, React Native and
                  TypeScript. From the first flow to the shipped product.
                </p>
              </div>
            </div>
            <div className="capability">
              <span>02</span>
              <div>
                <h3>Infrastructure & reliability</h3>
                <p>
                  Enterprise Linux, Windows Server, VMware and disaster
                  recovery. Experience with the systems software depends on.
                </p>
              </div>
            </div>
            <div className="capability">
              <span>03</span>
              <div>
                <h3>AI, ML & automation</h3>
                <p>
                  An expanding practice in Python, machine learning and
                  automation, developed through my MSc and hands-on projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section career-preview shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">04 / THE NEXT CHAPTER</p>
            <h2>
              Experience that keeps growing<span className="accent">.</span>
            </h2>
          </div>
          <Link className="text-link" href="/about">
            Experience & education <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="timeline">
          {education.slice(0, 1).map((item) => (
            <article className="timeline-item" key={item.id}>
              <span className="timeline-period">{item.period}</span>
              <div>
                <h3>{item.qualification}</h3>
                <div className="timeline-role">{item.institution}</div>
                <p>
                  Bringing a background in software and enterprise systems into
                  AI, machine learning and automation.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
