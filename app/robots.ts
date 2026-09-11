import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  return {
    rules:
      process.env.SITE_INDEXABLE === 'true'
        ? { userAgent: '*', allow: '/', disallow: '/api/' }
        : { userAgent: '*', disallow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
