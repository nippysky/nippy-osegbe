import "server-only";
import { sanityClient } from "./content";
import type { LabFeed } from "./types";

type Source = {
  sourceId: string;
  title: string;
  summary: string;
  url: string;
  topics: string[];
  language: string;
  updatedAt: string | null;
  kind: string;
  lastVerifiedAt: string;
  image?: string;
  imageAlt?: string;
};
type Editorial = {
  sourceId: string;
  title?: string;
  summary?: string;
  kind?: string;
  hidden?: boolean;
  featured?: boolean;
  learningNotes?: string;
  image?: string;
  imageAlt?: string;
  order?: number;
};
export async function getLabs(): Promise<LabFeed> {
  try {
    const data = await sanityClient.fetch<{
      synced: boolean;
      lastSuccess: string | null;
      sources: Source[];
      editorial: Editorial[];
    }>(
      `{
      "synced": defined(*[_id == "labSyncStatus"][0].lastSuccess),
      "lastSuccess": *[_id == "labSyncStatus"][0].lastSuccess,
      "sources": *[_type == "githubLabSource"]{sourceId,title,summary,url,topics,language,updatedAt,kind,lastVerifiedAt,imageAlt,"image":image.asset->url},
      "editorial": *[_type == "labEditorial"]{"sourceId":source->sourceId,title,summary,kind,hidden,featured,learningNotes,imageAlt,order,"image":image.asset->url}
    }`,
      {},
      { next: { revalidate: 300 } },
    );
    if (!data.synced || !data.lastSuccess) {
      return { labs: [], unavailable: true };
    }
    const lastSuccess = Date.parse(data.lastSuccess);
    const stale = !Number.isFinite(lastSuccess) || Date.now() - lastSuccess >= 86400000;
    return {
      unavailable: stale,
      labs: (stale ? [] : data.sources || [])
        .filter(
          (source) =>
            Date.now() - Date.parse(source.lastVerifiedAt) < 86400000,
        )
        .flatMap((source) => {
          const editorial = (data.editorial || []).find(
            (item) => item.sourceId === source.sourceId,
          );
          if (!editorial || editorial.hidden) return [];
          return [
            {
              id: source.sourceId,
              title: editorial?.title || source.title,
              summary: editorial?.summary || source.summary,
              url: source.url,
              topics: source.topics || [],
              language: source.language || "",
              updatedAt: source.updatedAt,
              kind: editorial?.kind || source.kind,
              featured: editorial?.featured || false,
              learningNotes: editorial?.learningNotes,
              image: editorial?.image || source.image,
              imageAlt: editorial?.image ? editorial.imageAlt : source.imageAlt,
              order: editorial?.order ?? 10,
            },
          ];
        })
        .sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) ||
            a.order - b.order ||
            (b.updatedAt || "").localeCompare(a.updatedAt || ""),
        ),
    };
  } catch {
    return { labs: [], unavailable: true };
  }
}
