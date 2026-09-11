import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { socialPages, type SocialPage } from '@/content/social';
export async function renderSocialImage(page: SocialPage) {
  const card = socialPages[page];
  const logo = await readFile(
    join(process.cwd(), 'public/assets/NIPPYSKY-LOGO.svg'),
    'base64',
  );
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 70,
        background: '#0c1018',
        color: '#eef1f8',
        fontFamily: 'sans-serif',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            background: '#fff',
            borderRadius: 14,
            padding: 14,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse requires native image elements. */}
          <img
            src={`data:image/svg+xml;base64,${logo}`}
            width={52}
            height={45}
            alt=""
          />
        </div>
        <span style={{ fontSize: 22, color: '#a7b3c8', letterSpacing: 3 }}>
          OSEGBE.COM
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 29, color: '#b0bdd1', marginBottom: 22 }}>
          Chukwudubem Osegbe
        </div>
        <div
          style={{
            fontSize: 16,
            letterSpacing: 2,
            color: '#a7b3c8',
            marginBottom: 16,
          }}
        >
          {card.label}
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -3 }}>
          {card.lineOne}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: -3,
            color: '#8faaff',
          }}
        >
          {card.lineTwo}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          paddingTop: 25,
          borderTop: '1px solid #35405a',
          fontSize: 22,
          color: '#b0bdd1',
          justifyContent: 'space-between',
        }}
      >
        <span>{card.detail}</span>
        <span>MSc AI & Automation · Sweden</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
