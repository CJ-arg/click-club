/**
 * App configuration.
 * The INVITE_CODE is the secret that goes in the QR link.
 * In production, set this via environment variable INVITE_CODE.
 */

export const INVITE_CODE = process.env.INVITE_CODE || 'CLICKCLUB2026';
// 3 days in seconds
export const POST_TTL_SEC = 72 * 60 * 60;

export const CATEGORIES = [
  { value: 'fullstack', label: 'Full Stack Web', color: '#6C5CE7' },
  { value: 'ai', label: 'AI Engineering', color: '#00B894' },
  { value: 'data', label: 'Data Analytics', color: '#0984E3' },
];

export function isLinkedInPost(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'www.linkedin.com' && parsed.hostname !== 'linkedin.com') return false;

    return (
      parsed.pathname.startsWith('/posts/') ||
      parsed.pathname.startsWith('/feed/update/') ||
      parsed.pathname.startsWith('/pulse/')
    );
  } catch {
    return false;
  }
}

export function isLinkedInProfile(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'www.linkedin.com' && parsed.hostname !== 'linkedin.com') return false;

    // A valid profile URL looks like https://www.linkedin.com/in/username/
    return parsed.pathname.startsWith('/in/') && parsed.pathname.length > 4;
  } catch {
    return false;
  }
}
