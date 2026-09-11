import { profileGraph } from '@/lib/seo';
import { StructuredData } from '@/components/structured-data';
import { pageMetadata } from '@/lib/seo';
import { ArrowUpRight, Download } from 'lucide-react';
import { getPortfolio } from '@/lib/content';
export const revalidate = 300;
export async function generateMetadata() {
  return pageMetadata(
    'About & engineering experience',
    'Meet Chukwudubem Osegbe: software and infrastructure engineer, NIPPYSKY founder and MSc AI & Automation student in Sweden. Experience, education and CV.',
    '/about',
  );
}
export default async function AboutPage() {
  const { settings, profile, experience, education } = await getPortfolio();
  return (
    <>
      <StructuredData data={profileGraph(settings)} />
      <div className="page-intro shell">
        <p className="eyebrow">ABOUT / CHUKWUDUBEM OSEGBE</p>
        <h1>
          A builder’s curiosity.
          <br />
          An engineer’s perspective<span className="accent">.</span>
        </h1>
        <p>Software, systems, and the next chapter in AI.</p>
      </div>
      <section className="section shell">
        <div className="about-intro">
          <aside>
            <h2>
              Always connecting
              <br />
              the dots.
            </h2>
            <dl className="about-facts">
              <div>
                <dt>Based in</dt>
                <dd>{settings.location}</dd>
              </div>
              <div>
                <dt>Building at</dt>
                <dd>
                  <a
                    className="text-link"
                    href={settings.company}
                    target="_blank"
                    rel="noreferrer"
                  >
                    NIPPYSKY <ArrowUpRight size={16} />
                  </a>
                </dd>
              </div>
              <div>
                <dt>Current focus</dt>
                <dd>AI, machine learning & automation</dd>
              </div>
            </dl>
            <a
              className="button button-secondary"
              style={{ marginTop: 25 }}
              href={settings.cv}
              target="_blank"
              rel="noreferrer"
            >
              View my CV <Download size={17} />
            </a>
          </aside>
          <div>
            {profile.bio.split('\n\n').map((paragraph) => (
              <p key={paragraph} className="bio-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
      <section className="section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE EXPERIENCE</p>
            <h2>
              Built on practical work<span className="accent">.</span>
            </h2>
          </div>
        </div>
        <div className="timeline">
          {experience.map((item) => (
            <article className="timeline-item" key={item.id}>
              <span className="timeline-period">{item.period}</span>
              <div>
                <h3>{item.company}</h3>
                <div className="timeline-role">{item.role}</div>
                <p>{item.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE FOUNDATION</p>
            <h2>
              Education & continued learning<span className="accent">.</span>
            </h2>
          </div>
        </div>
        <div className="timeline">
          {education.map((item) => (
            <article className="timeline-item" key={item.id}>
              <span className="timeline-period">{item.period}</span>
              <div>
                <h3>{item.qualification}</h3>
                <div className="timeline-role">{item.institution}</div>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="lab-note">
          Also certified in Microsoft Azure Fundamentals (AZ-900).
        </p>
      </section>
    </>
  );
}
