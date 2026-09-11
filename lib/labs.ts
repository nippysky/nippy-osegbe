import "server-only";
import { sanityClient } from "./content";
import { collectGithubLabs } from "@/scripts/lab-source.mjs";
import type { LabFeed } from "./types";
import { previewContext } from "./preview";

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
    const { client, preview } = await previewContext(sanityClient);
    const data = await client.fetch<{
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
      preview
        ? { cache: "no-store" }
        : { next: { revalidate: 300, tags: ["labs"] } },
    );
    let sources = data.sources || [];
    // Live public discovery keeps the Lab useful before scheduled mirroring is configured.
    if (!data.synced) {
      sources = (await collectGithubLabs({
        fetchImpl: (url, options) =>
          fetch(url, {
            ...options,
            next: { revalidate: 3600, tags: ["labs"] },
          }),
      })) as Source[];
    }
    const stale =
      data.synced &&
      (!data.lastSuccess ||
        Date.now() - Date.parse(data.lastSuccess) >= 86400000);
    return {
      unavailable: stale,
      labs: sources
        .filter(
          (source) =>
            !data.synced ||
            Date.now() - Date.parse(source.lastVerifiedAt) < 86400000,
        )
        .flatMap((source) => {
          const editorial = (data.editorial || []).find(
            (item) => item.sourceId === source.sourceId,
          );
          if (editorial?.hidden || (data.synced && !editorial)) return [];
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
