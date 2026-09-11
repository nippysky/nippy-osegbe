import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import type { SiteSettings } from './types';
import { socialPages, type SocialPage } from '@/content/social';

export const SITE_URL = 'https://osegbe.com';
export const SITE_NAME = 'Chukwudubem Osegbe';
export const HOME_TITLE = 'Chukwudubem Osegbe | Software, Systems & AI/ML';
export const HOME_DESCRIPTION =
  'Software and infrastructure engineer in Sweden, NIPPYSKY founder and MSc AI & Automation student. Explore my products, experience and growing AI/ML practice.';

export async function pageMetadata(
  title: string,
  description: string,
  path: SocialPage,
): Promise<Metadata> {
  const { isEnabled } = await draftMode();
  const indexable = process.env.SITE_INDEXABLE === 'true' && !isEnabled;
  const imageUrl = `${SITE_URL}${path === '/' ? '' : path}/opengraph-image`;
  const fullTitle = path === '/' ? title : `${title} | ${SITE_NAME}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    robots: indexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        }
      : { index: false, follow: false },
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: `${SITE_URL}${path}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: socialPages[path].alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}

export function identityGraph(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: settings.name,
        alternateName: 'nippysky',
        url: SITE_URL,
        jobTitle: 'Software & Infrastructure Engineer',
        description: HOME_DESCRIPTION,
        sameAs: [settings.github, settings.linkedin],
        worksFor: { '@id': `${settings.company}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${settings.company}/#organization`,
        name: 'NIPPYSKY',
        url: settings.company,
        founder: { '@id': `${SITE_URL}/#person` },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: settings.name,
        alternateName: 'Osegbe',
        inLanguage: 'en',
        publisher: { '@id': `${SITE_URL}/#person` },
      },
    ],
  };
}

export function profileGraph(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/about#profile`,
    url: `${SITE_URL}/about`,
    name: `About ${settings.name}`,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: settings.name,
      alternateName: 'nippysky',
      sameAs: [settings.github, settings.linkedin],
    },
  };
}
