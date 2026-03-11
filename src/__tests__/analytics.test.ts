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

  it('fires event when clicking a child of a [data-track] element', () => {
    const capture = vi.fn();
    (window as any).posthog = { capture };

    document.body.innerHTML =
      '<a data-track="affiliate_click" data-product-name="Cool Harness" href="#"><span id="child">Buy</span></a>';

    init();
    document.querySelector<HTMLElement>('#child')!.click();

    expect(capture).toHaveBeenCalledWith(
      'affiliate_click',
      expect.objectContaining({ product_name: 'Cool Harness' })
    );
  });

  it('maps multiple data-* attrs to snake_case props', () => {
    const capture = vi.fn();
    (window as any).posthog = { capture };

    document.body.innerHTML =
      '<a data-track="click" data-asin="B001" data-product-name="Toy" data-section="hero" href="#">Go</a>';

    init();
    document.querySelector('a')!.click();

    expect(capture).toHaveBeenCalledWith('click', {
      asin: 'B001',
      product_name: 'Toy',
      section: 'hero',
    });
  });
});
