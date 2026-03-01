import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { track, init } from '../scripts/analytics';

describe('track', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as any).gtag;
  });

  it('calls window.gtag when it is available', () => {
    const gtag = vi.fn();
    (window as any).gtag = gtag;

    track('test_event', { label: 'foo' });

    expect(gtag).toHaveBeenCalledWith('event', 'test_event', { label: 'foo' });
  });

  it('does not throw when window.gtag is absent', () => {
    delete (window as any).gtag;
    expect(() => track('test_event', {})).not.toThrow();
  });

  it('passes the props object to gtag unchanged', () => {
    const gtag = vi.fn();
    (window as any).gtag = gtag;
    const props = { product: 'harness', position: 1 };

    track('view_item', props);

    expect(gtag).toHaveBeenCalledWith('event', 'view_item', props);
  });
});

describe('init — affiliate click tracking', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as any).gtag;
  });

  it('fires track for a [data-track] click', () => {
    const gtag = vi.fn();
    (window as any).gtag = gtag;

    document.body.innerHTML =
      '<a data-track="affiliate_click" data-product-name="Cool Harness" href="#">Buy</a>';

    init();

    document.querySelector('a')!.click();

    expect(gtag).toHaveBeenCalledWith(
      'event',
      'affiliate_click',
      expect.objectContaining({ product_name: 'Cool Harness' })
    );
  });

  it('ignores clicks on elements without [data-track]', () => {
    const gtag = vi.fn();
    (window as any).gtag = gtag;

    document.body.innerHTML = '<button id="btn">No tracking</button>';
    init();

    (document.querySelector('#btn') as HTMLElement).click();

    expect(gtag).not.toHaveBeenCalled();
  });

  it('fires sendBeacon for amazon_outbound_click events', () => {
    const sendBeacon = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, 'sendBeacon', { value: sendBeacon, writable: true, configurable: true });

    document.body.innerHTML =
      '<a data-track="amazon_outbound_click" data-asin="B001" href="#">Amazon</a>';

    init();
    document.querySelector('a')!.click();

    expect(sendBeacon).toHaveBeenCalledWith(
      '/api/track',
      expect.any(Blob)
    );
  });
});
