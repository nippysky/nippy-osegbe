import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/work', '/about', '/lab'].map((path) => ({
    url: `https://osegbe.com${path}`,
    changeFrequency: path === '/lab' ? 'weekly' : 'monthly',
    priority: path ? 0.8 : 1,
  }));
}
