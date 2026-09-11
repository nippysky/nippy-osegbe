import { timingSafeEqual } from 'node:crypto';
import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  const secret = process.env.SANITY_PREVIEW_SECRET;
  if (!secret || secret.length < 24 || !process.env.SANITY_READ_TOKEN)
    return Response.json(
      { error: 'Draft preview is not configured.' },
      { status: 503 },
    );
  const url = new URL(request.url);
  const supplied = url.searchParams.get('secret') || '';
  if (
    Buffer.byteLength(supplied) !== Buffer.byteLength(secret) ||
    !timingSafeEqual(Buffer.from(supplied), Buffer.from(secret))
  )
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const path = url.searchParams.get('path') || '/';
  if (!['/', '/work', '/about', '/lab'].includes(path))
    return Response.json({ error: 'Invalid preview path' }, { status: 400 });
  (await draftMode()).enable();
  const response = NextResponse.redirect(new URL(path, url.origin));
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
