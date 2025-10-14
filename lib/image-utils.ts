import { Image as DirectusImage } from './directus';

/**
 * Get the proper image URL with fallback logic
 * Priority:
 * 1. Directus file (directus_file_id) - preferred
 * 2. Legacy WordPress URL (image_url) - temporary fallback
 * 3. null - no image available
 */
export function getImageUrl(image: DirectusImage | undefined): string | null {
  if (!image) return null;

  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

  // Priority 1: Use Directus file
  if (image.directus_file_id && directusUrl) {
    return `${directusUrl}/assets/${image.directus_file_id}`;
  }

  // Priority 2: Legacy WordPress URL (temporary - will be removed after migration)
  if (image.image_url) {
    return image.image_url;
  }

  return null;
}

/**
 * Get alt text for an image with fallback
 */
export function getImageAlt(image: DirectusImage | undefined, fallback: string = ''): string {
  if (!image) return fallback;
  return image.image_alt_text || fallback;
}
