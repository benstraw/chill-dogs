import { describe, expect, it } from 'vitest';

import { applyFirstImageOg, extractFirstImageSrc } from '../../scripts/apply-first-page-image-og.mjs';

describe('apply first page image OG script helpers', () => {
  it('skips images explicitly marked as unsuitable for Open Graph previews', () => {
    expect(
      extractFirstImageSrc(`
        <main>
          <img src="/images/pinterest/tall-pin.png" data-og-image-skip="true">
          <figure><img src="/images/article/photo.jpg" alt="Dog in shade"></figure>
        </main>
      `)
    ).toBe('/images/article/photo.jpg');
  });

  it('preserves existing OG metadata when every main image is skipped', () => {
    const html = `
      <html>
        <head>
          <meta property="og:image" content="https://www.chill-dogs.com/og/original.jpg">
          <meta name="twitter:image" content="https://www.chill-dogs.com/og/original.jpg">
        </head>
        <body>
          <main><img src="/images/pinterest/tall-pin.png" data-og-image-skip="true"></main>
        </body>
      </html>
    `;

    expect(applyFirstImageOg(html)).toBe(html);
  });
});
