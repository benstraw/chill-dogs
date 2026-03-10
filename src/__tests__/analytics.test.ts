import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { track, init } from '../scripts/analytics';

describe('track', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as any).posthog;
  });

  it('calls window.posthog.capture when posthog is available', () => {
    const capture = vi.fn();
    (window as any).posthog = { capture };

    track('test_event', { label: 'foo' });

    expect(capture).toHaveBeenCalledWith('test_event', { label: 'foo' });
  });

  it('does not throw when posthog is absent', () => {
    delete (window as any).posthog;
    expect(() => track('test_event', {})).not.toThrow();
  });

  it('passes the props object to posthog unchanged', () => {
    const capture = vi.fn();
    (window as any).posthog = { capture };
    const props = { product: 'harness', position: 1 };

    track('view_item', props);

    expect(capture).toHaveBeenCalledWith('view_item', props);
  });
});

describe('init — click tracking', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as any).posthog;
  });

  it('fires posthog.capture for a [data-track] click', () => {
    const capture = vi.fn();
    (window as any).posthog = { capture };

    document.body.innerHTML =
      '<a data-track="affiliate_click" data-product-name="Cool Harness" href="#">Buy</a>';

    init();
    document.querySelector('a')!.click();

    expect(capture).toHaveBeenCalledWith(
      'affiliate_click',
      expect.objectContaining({ product_name: 'Cool Harness' })
    );
  });

  it('ignores clicks on elements without [data-track]', () => {
    const capture = vi.fn();
    (window as any).posthog = { capture };

    document.body.innerHTML = '<button id="btn">No tracking</button>';
    init();

    (document.querySelector('#btn') as HTMLElement).click();

    expect(capture).not.toHaveBeenCalled();
  });

  it('fires posthog.capture for amazon_outbound_click events', () => {
    const capture = vi.fn();
    (window as any).posthog = { capture };

    document.body.innerHTML =
      '<a data-track="amazon_outbound_click" data-asin="B001" href="#">Amazon</a>';

    init();
    document.querySelector('a')!.click();

    expect(capture).toHaveBeenCalledWith(
      'amazon_outbound_click',
      expect.objectContaining({ asin: 'B001' })
    );
  });

  it('fires posthog.capture for hero click events', () => {
    const capture = vi.fn();
    (window as any).posthog = { capture };

    document.body.innerHTML =
      '<a data-track="hero_click_cooling" data-section="hero" href="#">Shop Cooling</a>';

    init();
    document.querySelector('a')!.click();

    expect(capture).toHaveBeenCalledWith(
      'hero_click_cooling',
      expect.objectContaining({ section: 'hero' })
    );
  });
});
