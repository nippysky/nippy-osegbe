import { ArrowUpRight, Code2, Link2, Mail } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';
export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer id="contact" className="site-footer">
      <div className="shell">
        <div className="contact-layout">
          <div>
            <p className="eyebrow">
              <span /> WHAT’S NEXT
            </p>
            <h2>
              Good work starts
              <br />
              with a conversation<span className="accent">.</span>
            </h2>
          </div>
          <div className="contact-copy">
            <p>
              Have a role, a project, or an interesting problem? I’m open to
              software engineering and AI/ML opportunities, and thoughtful
              collaborations.
            </p>
            <a className="contact-email" href={`mailto:${settings.email}`}>
              {settings.email}
              <ArrowUpRight size={22} />
            </a>
            <a
              className="text-link"
              href={settings.company}
              target="_blank"
              rel="noreferrer"
            >
              Product enquiries at NIPPYSKY <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Chukwudubem Osegbe</span>
          <span className="footer-location">{settings.location}</span>
          <div className="social-links">
            <a
              href={settings.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Code2 size={18} />
            </a>
            <a
              href={settings.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Link2 size={18} />
            </a>
            <a href={`mailto:${settings.email}`} aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
