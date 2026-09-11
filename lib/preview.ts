import 'server-only';
import { draftMode } from 'next/headers';
import type { SanityClient } from '@sanity/client';
export async function previewContext(client: SanityClient) {
  const draft = await draftMode();
  const token = process.env.SANITY_READ_TOKEN;
  const preview = Boolean(draft.isEnabled && token);
  return {
    preview,
    client: preview
      ? client.withConfig({ useCdn: false, perspective: 'drafts', token })
      : client,
  };
}
