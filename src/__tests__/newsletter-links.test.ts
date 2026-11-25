import { describe, expect, it } from 'vitest';

import { linkedPaths, utmSources } from '../../scripts/newsletter-links';

describe('newsletter link parsing', () => {
  it('collects site paths once each, in order, without query or fragment', () => {
    const body = [
      '[Mats](https://www.chill-dogs.com/cooling/cooling-mats/?utm_source=chill-dogs&utm_medium=email)',
      'and https://chill-dogs.com/calming/#faq and again',
      '<https://www.chill-dogs.com/cooling/cooling-mats/>',
      '[elsewhere](https://example.com/cooling/)',
    ].join('\n');
    expect(linkedPaths(body)).toEqual(['/cooling/cooling-mats/', '/calming/']);
    expect(linkedPaths()).toEqual([]);
  });

  it('collects distinct utm_source values', () => {
    expect(utmSources('?utm_source=chill-dogs&x=1 ?utm_source=buttondown ?utm_source=chill-dogs')).toEqual(['chill-dogs', 'buttondown']);
  });
});
