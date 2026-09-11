'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="section shell">
      <h1 style={{ fontSize: 36, marginBottom: 20 }}>Something didn’t load.</h1>
      <p style={{ marginBottom: 24 }}>
        Please try again, or reach me at nsinfo247@gmail.com.
      </p>
      <button className="button button-primary" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
