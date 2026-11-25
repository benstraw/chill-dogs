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

describe('applyFirstImageOg', () => {
  const page = (main: string, meta = '<meta property="og:image" content="https://www.chill-dogs.com/og/default.jpg"><meta name="twitter:image" content="https://www.chill-dogs.com/og/default.jpg">') =>
    `<html><head>${meta}</head><body><main>${main}</main></body></html>`;

  it('points og:image and twitter:image at the first main image, made absolute', () => {
    const out = applyFirstImageOg(page('<img src="/_assets/rhys.webp" alt="Rhys">'));
    expect(out).toContain('<meta property="og:image" content="https://www.chill-dogs.com/_assets/rhys.webp">');
    expect(out).toContain('<meta name="twitter:image" content="https://www.chill-dogs.com/_assets/rhys.webp">');
  });

  it('refuses a cross-origin first image: share images stay self-hosted', () => {
    const html = page('<img src="https://m.media-amazon.com/images/I/x.jpg" alt="mat">');
    expect(applyFirstImageOg(html)).toBe(html);
  });

  it('leaves pages without a <main>, or with a data: image, untouched', () => {
    const noMain = '<html><head><meta property="og:image" content="https://www.chill-dogs.com/og/a.jpg"></head><body><img src="/x.jpg"></body></html>';
    expect(applyFirstImageOg(noMain)).toBe(noMain);
    const dataImage = page('<img src="data:image/png;base64,AAAA">');
    expect(applyFirstImageOg(dataImage)).toBe(dataImage);
  });

  it('adds content to a meta tag that had none, and skips a missing twitter tag', () => {
    const out = applyFirstImageOg(page('<img src="/a.jpg">', '<meta property="og:image">'));
    expect(out).toContain('<meta property="og:image" content="https://www.chill-dogs.com/a.jpg">');
    expect(out).not.toContain('twitter:image');
  });
});
