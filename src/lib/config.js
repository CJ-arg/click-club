/**
 * App configuration.
 * The INVITE_CODE is the secret that goes in the QR link.
 * In production, set this via environment variable INVITE_CODE.
 */

export const INVITE_CODE = process.env.INVITE_CODE || 'CLICKCLUB2026';

export const CATEGORIES = [
  { value: 'fullstack', label: 'Full Stack Web', color: '#6C5CE7' },
  { value: 'ai', label: 'AI Engineering', color: '#00B894' },
  { value: 'data', label: 'Data Analytics', color: '#0984E3' },
];

export function isValidLinkedInUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'https:' &&
      (parsed.hostname === 'www.linkedin.com' || parsed.hostname === 'linkedin.com') &&
      (parsed.pathname.startsWith('/in/') ||
        parsed.pathname.startsWith('/posts/') ||
        parsed.pathname.startsWith('/feed/') ||
        parsed.pathname.startsWith('/pulse/'))
    );
  } catch {
    return false;
  }
}
