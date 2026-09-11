'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

const links = [
  { href: '/work', label: 'Work' },
  { href: '/lab', label: 'AI & ML Lab' },
  { href: '/about', label: 'About' },
];
export function Header({ cv }: { cv: string }) {
  const path = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link
          className="brand"
          href="/"
          onClick={() => setOpen(false)}
          aria-label="Chukwudubem Osegbe home"
        >
          <span className="brand-mark">
            <Image
              src="/assets/NIPPYSKY-LOGO.svg"
              alt=""
              width={26}
              height={26}
            />
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={path.startsWith(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button theme-switch"
            aria-label="Switch between dark and light theme"
            onClick={() =>
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
          >
            <Sun className="sun-icon" size={19} />
            <Moon className="moon-icon" size={19} />
          </button>
          <Link
            className="header-contact"
            href="#contact"
            onClick={() => setOpen(false)}
          >
            Let’s talk <ArrowUpRight size={16} />
          </Link>
          <button
            className="icon-button menu-toggle"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
              <ArrowUpRight size={18} />
            </Link>
          ))}
          <Link href={cv} target="_blank" onClick={() => setOpen(false)}>
            View CV <ArrowUpRight size={18} />
          </Link>
        </nav>
      )}
    </header>
  );
}
