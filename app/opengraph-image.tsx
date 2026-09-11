import { renderSocialImage } from '@/lib/social-image';
import { socialPages } from '@/content/social';
export const alt = socialPages['/'].alt;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return renderSocialImage('/');
}
