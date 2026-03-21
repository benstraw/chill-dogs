import { describe, it, expect } from 'vitest';
import { extractAsin } from '../utils/affiliate';

describe('extractAsin', () => {
  it('extracts ASIN from a standard Amazon dp URL', () => {
    expect(extractAsin('https://www.amazon.com/dp/B0FH8GDBLX/?tag=chill-dogs-20')).toBe('B0FH8GDBLX');
  });

  it('extracts ASIN when there is no query string', () => {
    expect(extractAsin('https://www.amazon.com/dp/B0BYGGBLKM/')).toBe('B0BYGGBLKM');
  });

  it('extracts ASIN from a URL with a long path prefix', () => {
    expect(extractAsin('https://www.amazon.com/Some-Product-Name/dp/B0BW4X784G/ref=sr_1_1')).toBe('B0BW4X784G');
  });

  it('returns empty string when URL contains no ASIN', () => {
    expect(extractAsin('https://www.amazon.com/s?k=dog+gps')).toBe('');
  });

  it('returns empty string for an empty string input', () => {
    expect(extractAsin('')).toBe('');
  });
});
