import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="section shell">
      <p className="eyebrow">404 / NOT FOUND</p>
      <h1 style={{ fontSize: 'clamp(2rem,6vw,4rem)', margin: '25px 0' }}>
        This page has moved on.
      </h1>
      <p style={{ color: 'var(--muted)', marginBottom: 30 }}>
        The work is still here. Let’s find your way back.
      </p>
      <Link className="button button-primary" href="/">
        Back to the homepage
      </Link>
    </section>
  );
}
