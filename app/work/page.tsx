import { pageMetadata } from '@/lib/seo';
import { ArrowUpRight } from 'lucide-react';
import { getPortfolio } from '@/lib/content';
import { WorkCard } from '@/components/work-card';
export const revalidate = 300;
export async function generateMetadata() {
  return pageMetadata(
    'Selected work & ventures',
    'Web and mobile products built by Chukwudubem Osegbe. Explore my engineering contributions, with full venture and client case studies on NIPPYSKY.',
    '/work',
  );
}
export default async function WorkPage() {
  const { work } = await getPortfolio();
  return (
    <>
      <div className="page-intro shell">
        <p className="eyebrow">WORK / VENTURES & CLIENT PRODUCTS</p>
        <h1>
          From an idea
          <br />
          to something people use<span className="accent">.</span>
        </h1>
        <p>
          A selection of products I’ve built and contributed to. Here’s my part
          in the work; the full stories live at NIPPYSKY.
        </p>
      </div>
      <section className="section shell" aria-label="Selected work">
        <div className="work-grid">
          {work
            .filter((item) => item.image)
            .map((item) => (
              <WorkCard key={item.id} work={item} detailed />
            ))}
        </div>
        <div style={{ marginTop: 30 }}>
          {work
            .filter((item) => !item.image)
            .map((item) => (
              <article className="work-index-row" key={item.id}>
                <div>
                  <h3>{item.title}</h3>
                  <div className="work-meta">
                    {item.category} · {item.year}
                  </div>
                </div>
                <p>{item.contribution}</p>
                <a
                  className="text-link"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${item.title} case study on NIPPYSKY`}
                >
                  Full story <ArrowUpRight size={18} />
                </a>
              </article>
            ))}
        </div>
      </section>
    </>
  );
}
