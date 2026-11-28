import { describe, expect, it } from 'vitest';

import {
  buildPhotoCardSvg,
  photoCardAccent,
  photoCardHeadline,
  wrapTitle,
} from '../../scripts/og-photo-card.mjs';
import { buildGeneralOgRecords } from '../scripts/generate-og-images.mjs';
import { ogCtaFor } from '../config/og-cta.mjs';

describe('photo share cards (#339)', () => {
  it('wraps a title on whole words into at most 3 lines', () => {
    const lines = wrapTitle('The Day Rhys Ran Off: What We Learned About Dog Tracking');
    expect(lines).toEqual(['The Day Rhys Ran Off: What We', 'Learned About Dog Tracking']);
  });

  it('ends an overlong title on a whole word with an ellipsis, never mid-word', () => {
    const title = 'How to Keep a Dog Cool in a Hot Car on a Long Summer Road Trip Across the Desert Southwest With Two Anxious Rescue Dogs';
    const lines = wrapTitle(title);
    expect(lines).toHaveLength(3);
    expect(lines[2].endsWith('…')).toBe(true);
    const lastWord = lines[2].slice(0, -1).split(' ').pop() ?? '';
    expect(title.split(' ')).toContain(lastWord);
    for (const line of lines) expect(line.length).toBeLessThanOrEqual(34);
  });

  it('draws the title and wordmark, escaping markup', () => {
    const svg = buildPhotoCardSvg({ headline: 'Cooling & Calming <Essentials>', accent: '#2F5B3D' });
    expect(svg).toContain('Cooling &amp; Calming &lt;Essentials&gt;');
    expect(svg).toContain('Chill-Dogs');
    expect(svg).toContain('rx="20"');
  });

  it('drops the site name from the share title', () => {
    expect(photoCardHeadline('Dog Road Trip Gear | Chill-Dogs')).toBe('Dog Road Trip Gear');
    expect(photoCardHeadline('Chill-Dogs — Cooling Picks')).toBe('Cooling Picks');
  });

  it('colors the card by pillar', () => {
    expect(photoCardAccent('/calming/x/')).toBe('#2F5B3D');
    expect(photoCardAccent('/about/')).toBe('#333333');
  });
});

describe('generated share-card buttons (#339)', () => {
  const records = buildGeneralOgRecords();

  it('never promises product picks on an article', () => {
    const articles = records.filter((record) => record.isArticle);
    expect(articles.length).toBeGreaterThan(10);
    for (const article of articles) {
      expect(ogCtaFor(article), article.pathname).not.toBe('See Top Product Picks');
    }
  });

  it('shows no button on search and subscribe pages', () => {
    const utility = records.filter((record) => ['/search/', '/subscribe/'].includes(record.pathname));
    expect(utility).toHaveLength(2);
    for (const record of utility) expect(ogCtaFor(record), record.pathname).toBe('');
  });
});
