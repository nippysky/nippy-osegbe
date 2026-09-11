import { timingSafeEqual } from 'node:crypto';
import { revalidateTag, revalidatePath } from 'next/cache';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || secret.length < 24)
    return Response.json(
      { error: 'Revalidation is not configured.' },
      { status: 503 },
    );
  const supplied = request.headers.get('authorization') || '';
  const expected = `Bearer ${secret}`;
  if (
    Buffer.byteLength(supplied) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))
  )
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  revalidateTag('portfolio', { expire: 0 });
  revalidateTag('labs', { expire: 0 });
  revalidatePath('/', 'layout');
  return Response.json({ revalidated: true });
}
