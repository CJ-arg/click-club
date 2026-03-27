import { isValidLinkedInUrl, CATEGORIES } from './config';

describe('Config', () => {
  describe('isValidLinkedInUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidLinkedInUrl('https://www.linkedin.com/in/john-doe')).toBe(true);
      expect(isValidLinkedInUrl('https://linkedin.com/in/john-doe')).toBe(true);
      expect(isValidLinkedInUrl('https://www.linkedin.com/posts/john-doe/123')).toBe(true);
      expect(isValidLinkedInUrl('https://www.linkedin.com/feed/update/urn:li:activity:123')).toBe(true);
      expect(isValidLinkedInUrl('https://www.linkedin.com/pulse/article-name-john-doe')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidLinkedInUrl('https://www.google.com')).toBe(false);
      expect(isValidLinkedInUrl('http://www.linkedin.com/in/john-doe')).toBe(false); // HTTP not HTTPS
      expect(isValidLinkedInUrl('https://www.linkedin.com/about')).toBe(false); // Invalid path
      expect(isValidLinkedInUrl('not-a-url')).toBe(false);
      expect(isValidLinkedInUrl('')).toBe(false);
    });
  });

  describe('CATEGORIES', () => {
    it('should have predefined categories', () => {
      expect(CATEGORIES.length).toBeGreaterThan(0);
      expect(CATEGORIES[0]).toHaveProperty('value');
      expect(CATEGORIES[0]).toHaveProperty('label');
      expect(CATEGORIES[0]).toHaveProperty('color');
    });
  });
});
