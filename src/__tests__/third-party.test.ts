import { describe, expect, it } from 'vitest';

import { shouldLoadPinterestTag } from '../utils/third-party';

describe('shouldLoadPinterestTag', () => {
  it('loads only on indexable production pages with a configured tag', () => {
    expect(
      shouldLoadPinterestTag({
        tagId: '2612767302267',
        noindex: false,
        vercelEnv: 'production',
      })
    ).toBe(true);
  });

  it('does not load without a tag id', () => {
    expect(
      shouldLoadPinterestTag({
        tagId: '',
        noindex: false,
        vercelEnv: 'production',
      })
    ).toBe(false);
  });

  it('does not load on noindex pages', () => {
    expect(
      shouldLoadPinterestTag({
        tagId: '2612767302267',
        noindex: true,
        vercelEnv: 'production',
      })
    ).toBe(false);
  });

  it('does not load outside production', () => {
    expect(
      shouldLoadPinterestTag({
        tagId: '2612767302267',
        noindex: false,
        vercelEnv: 'preview',
      })
    ).toBe(false);
  });
});
