import { describe, expect, it } from 'vitest';

import {
  applyFirstImageOg,
  extractFirstImageSrc,
  photoCardSlug,
  photoNeedingCard,
} from '../../scripts/apply-first-page-image-og.mjs';

describe('apply first page image OG script helpers', () => {
  it('skips images explicitly marked as unsuitable for Open Graph previews', () => {
    expect(
      extractFirstImageSrc(`
        <main>
          <img src="/images/pinterest/tall-pin.png" data-og-hero data-og-image-skip="true">
          <figure><img src="/images/article/photo.jpg" alt="Dog in shade" data-og-hero></figure>
        </main>
      `)
    ).toBe('/images/article/photo.jpg');
  });

  it('ignores unmarked images: logos, badges and listing thumbnails never become the share image (#339)', () => {
    expect(
      extractFirstImageSrc(`
        <main>
          <img src="/_assets/paw-logo.webp" alt="Chill-Dogs paw print">
          <a class="card"><img src="/_assets/road-trip-car.webp" alt=""></a>
          <img src="/_assets/rhys-approved-horizontal.webp" alt="Rhys Approved">
        </main>
      `)
    ).toBeNull();
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

  it('leaves a page with only unmarked images on its generated card', () => {
    const html = page('<img src="/_assets/paw-logo.webp" alt="logo"><img src="/_assets/car.webp" alt="">');
    expect(applyFirstImageOg(html)).toBe(html);
  });

  it('points og:image and twitter:image at the marked hero image, made absolute', () => {
    const out = applyFirstImageOg(page('<img src="/_assets/logo.webp"><img src="/_assets/rhys.webp" alt="Rhys" data-og-hero>'));
    expect(out).toContain('<meta property="og:image" content="https://www.chill-dogs.com/_assets/rhys.webp">');
    expect(out).toContain('<meta name="twitter:image" content="https://www.chill-dogs.com/_assets/rhys.webp">');
  });

  it('refuses a cross-origin first image: share images stay self-hosted', () => {
    const html = page('<img src="https://m.media-amazon.com/images/I/x.jpg" alt="mat" data-og-hero>');
    expect(applyFirstImageOg(html)).toBe(html);
  });

  it('leaves pages without a <main>, or with a data: image, untouched', () => {
    const noMain = '<html><head><meta property="og:image" content="https://www.chill-dogs.com/og/a.jpg"></head><body><img src="/x.jpg"></body></html>';
    expect(applyFirstImageOg(noMain)).toBe(noMain);
    const dataImage = page('<img src="data:image/png;base64,AAAA" data-og-hero>');
    expect(applyFirstImageOg(dataImage)).toBe(dataImage);
  });

  it('adds content to a meta tag that had none, and skips a missing twitter tag', () => {
    const out = applyFirstImageOg(page('<img src="/a.jpg" data-og-hero>', '<meta property="og:image">'));
    expect(out).toContain('<meta property="og:image" content="https://www.chill-dogs.com/a.jpg">');
    expect(out).not.toContain('twitter:image');
  });
});

describe('photoNeedingCard', () => {
  const head = (image: string) => `<html><head><meta property="og:title" content="T"><meta property="og:image" content="${image}"></head><body></body></html>`;

  it('picks a local photo used as the share image', () => {
    expect(photoNeedingCard(head('https://www.chill-dogs.com/_assets/bishop-peak.Cf1LSFW2.jpg'))).toBe('/_assets/bishop-peak.Cf1LSFW2.jpg');
    expect(photoNeedingCard(head('https://www.chill-dogs.com/_assets/car.webp'))).toBe('/_assets/car.webp');
  });

  it('leaves generated cards, the default card, other sites and non-photos alone', () => {
    expect(photoNeedingCard(head('https://www.chill-dogs.com/og/calming.jpg'))).toBeNull();
    expect(photoNeedingCard(head('https://www.chill-dogs.com/og/photo/travel-x.jpg'))).toBeNull();
    expect(photoNeedingCard(head('https://www.chill-dogs.com/og-default.jpg'))).toBeNull();
    expect(photoNeedingCard(head('https://m.media-amazon.com/images/I/x.jpg'))).toBeNull();
    expect(photoNeedingCard(head('https://www.chill-dogs.com/images/logo.svg'))).toBeNull();
    expect(photoNeedingCard('<html><head></head></html>')).toBeNull();
  });

  it('names cards after the page path', () => {
    expect(photoCardSlug('/travel/dog-road-trip-gear/')).toBe('travel-dog-road-trip-gear');
    expect(photoCardSlug('/')).toBe('home');
  });
});
