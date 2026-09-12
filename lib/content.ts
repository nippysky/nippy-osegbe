import 'server-only';
import fallback from '@/content/portfolio.json';
import { cache } from 'react';
import { createClient } from '@sanity/client';
import type { Portfolio } from './types';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vuye8s8l',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-09-11',
  useCdn: true,
  perspective: 'published',
});

export const getPortfolio = cache(async (): Promise<Portfolio> => {
  try {
    // This explicit cutover is not inferred from a document editors can unpublish.
    if (process.env.SANITY_CONTENT_READY !== 'true')
      return fallback;
    const data = await sanityClient.fetch<Partial<Portfolio>>(
      `{
      "settings": *[_id == "siteSettings"][0]{name,shortName,email,location,github,linkedin,company,"cv":coalesce(cv.asset->url,cvUrl)},
      "profile": *[_id == "profile"][0]{eyebrow,headline,intro,currentFocus,availability,bio},
      "work": *[_type == "selectedWork" && hidden != true] | order(order asc){"id":coalesce(slug.current,_id),title,category,year,role,summary,contribution,decision,tags,url,"image":coalesce(image.asset->url,imageUrl),imageAlt,style,featured,order},
      "experience": *[_type == "experience"] | order(order asc){"id":_id,company,role,period,summary,order},
      "education": *[_type == "education"] | order(order asc){"id":_id,institution,qualification,period,detail,order}
    }`,
      {},
      { next: { revalidate: 300 } },
    );
    if (!data.profile || !data.settings)
      throw new Error('Required portfolio content unavailable');
    const defined = <T extends object>(value: Partial<T> | null | undefined) =>
      Object.fromEntries(
        Object.entries(value || {}).filter(
          ([, v]) => v !== null && v !== undefined,
        ),
      );
    return {
      settings: { ...fallback.settings, ...defined(data.settings) },
      profile: {
        eyebrow: data.profile.eyebrow || fallback.settings.name,
        headline: data.profile.headline || fallback.settings.name,
        intro: data.profile.intro || '',
        currentFocus: data.profile.currentFocus || '',
        availability: data.profile.availability || '',
        bio: data.profile.bio || '',
      },
      // Empty CMS collections remain empty.
      work: data.work || [],
      experience: data.experience || [],
      education: data.education || [],
    } as Portfolio;
  } catch {
    // Do not resurrect bundled projects when CMS content is withdrawn or unavailable.
    return {
      settings: fallback.settings,
      profile: {
        eyebrow: 'CHUKWUDUBEM OSEGBE',
        headline: 'Software.\nSystems.\nAI & ML.',
        intro: '',
        currentFocus: '',
        availability: 'Get in touch to discuss opportunities.',
        bio: 'My profile is temporarily unavailable. Please try again shortly.',
      },
      work: [],
      experience: [],
      education: [],
      unavailable: true,
    };
  }
});
