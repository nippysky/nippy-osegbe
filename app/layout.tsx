import type { Metadata } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getPortfolio } from '@/lib/content';
import {
  SITE_URL,
  SITE_NAME,
  HOME_TITLE,
  HOME_DESCRIPTION,
  identityGraph,
} from '@/lib/seo';
import { StructuredData } from '@/components/structured-data';
const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  applicationName: SITE_NAME,
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, unavailable } = await getPortfolio();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <ThemeProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Header cv={settings.cv} />
          <main id="main">
            {unavailable && (
              <div className="content-notice shell" role="status">
                Portfolio details are temporarily unavailable. Please try again
                shortly or get in touch below.
              </div>
            )}
            {children}
          </main>
          <Footer settings={settings} />
        </ThemeProvider>
        <StructuredData data={identityGraph(settings)} />
      </body>
    </html>
  );
}
