import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { decodeFile, MAX_IMAGE_BYTES } from './lab-source.mjs';

const escape = (value) =>
  value.replace(
    /[<>&"']/g,
    (char) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[char],
  );
function lines(text, width = 31) {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const result = [''];
  for (const word of words) {
    for (let i = 0; i < word.length; i += width) {
      const piece = word.slice(i, i + width);
      if ((result.at(-1) + ' ' + piece).trim().length > width)
        result.push(piece);
      else result[result.length - 1] = (result.at(-1) + ' ' + piece).trim();
    }
  }
  return result
    .slice(0, 4)
    .map((line, index) =>
      index === 3 && result.length > 4 ? line.slice(0, -1) + '…' : line,
    );
}
export function coverKey(lab) {
  return createHash('sha256')
    .update(
      JSON.stringify({
        version: 1,
        cover: lab.cover,
        title: lab.title,
        kind: lab.kind,
        language: lab.language,
      }),
    )
    .digest('hex');
}
export async function generatedCover(lab) {
  const title = lines(lab.title)
    .map(
      (line, i) =>
        `<text x="72" y="${224 + i * 67}" font-size="55" font-weight="700" fill="#f1f5f9">${escape(line)}</text>`,
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#091017"/>
    <rect x="1070" width="130" height="630" fill="#10252b"/>
    <path d="M1070 0V630M0 504H1200" fill="none" stroke="#27434a"/>
    <rect x="72" y="71" width="40" height="4" fill="#68e8cf"/>
    <g font-family="DejaVu Sans,Arial,sans-serif">
      <text x="130" y="82" font-size="22" letter-spacing="3" fill="#68e8cf">NIPPYSKY / LAB</text>
      ${title}
      <text x="72" y="555" font-size="22" fill="#9eb0bc">${escape([lab.kind, lab.language].filter(Boolean).join(' / '))}</text>
      <text x="72" y="593" font-size="18" fill="#6e8794">CHUKWUDUBEM OSEGBE · AI &amp; AUTOMATION</text>
    </g>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
export async function prepareCover(lab, json) {
  if (lab.cover) {
    const { repoName, sha } = lab.cover;
    if (!/^[\w.-]+\/[\w.-]+$/.test(repoName) || !/^[a-f0-9]{40,64}$/.test(sha))
      throw new Error('Invalid cover source');
    const file = await json(`/repos/${repoName}/git/blobs/${sha}`, {
      maxBytes: 4_500_000,
    });
    const bytes = decodeFile(file, MAX_IMAGE_BYTES);
    try {
      const input = sharp(bytes, {
        limitInputPixels: 32_000_000,
        animated: false,
      });
      const meta = await input.metadata();
      if (!['png', 'jpeg', 'webp'].includes(meta.format))
        throw new Error('Unsupported cover type');
      return {
        bytes: await input
          .resize({
            width: 1200,
            height: 630,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .png()
          .toBuffer(),
        origin: 'repository',
        alt: lab.cover.alt || `${lab.title} — project repository image`,
      };
    } catch {
      console.warn(
        `Using a branded cover for ${lab.sourceId}: repository image is not a supported raster image.`,
      );
    }
  }
  return {
    bytes: await generatedCover(lab),
    origin: 'generated',
    alt: `${lab.title} — ${[lab.kind, lab.language].filter(Boolean).join(', ')}`,
  };
}
