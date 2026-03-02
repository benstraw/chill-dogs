import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { track, init } from '../scripts/analytics';

describe('track', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as any).gtag;
    delete (window as any).plausible;
    delete (window as any).posthog;
  });

  it('calls window.gtag when it is available', () => {
    const gtag = vi.fn();
    (window as any).gtag = gtag;

    track('test_event', { label: 'foo' });

    expect(gtag).toHaveBeenCalledWith('event', 'test_event', { label: 'foo' });
  });

  it('calls window.plausible when it is available', () => {
    const plausible = vi.fn();
    (window as any).plausible = plausible;

    track('test_event', { label: 'foo' });

    expect(plausible).toHaveBeenCalledWith('test_event', { props: { label: 'foo' } });
  });

  it('sends to both providers when both are available', () => {
    const gtag = vi.fn();
    const plausible = vi.fn();
    (window as any).gtag = gtag;
    (window as any).plausible = plausible;

    track('dual_event', { product: 'mat' });

    expect(gtag).toHaveBeenCalledWith('event', 'dual_event', { product: 'mat' });
    expect(plausible).toHaveBeenCalledWith('dual_event', { props: { product: 'mat' } });
  });

  it('does not throw when no providers are available', () => {
    delete (window as any).gtag;
    delete (window as any).plausible;
    expect(() => track('test_event', {})).not.toThrow();
  });

  it('passes the props object to gtag unchanged', () => {
    const gtag = vi.fn();
    (window as any).gtag = gtag;
    const props = { product: 'harness', position: 1 };

    track('view_item', props);

    expect(gtag).toHaveBeenCalledWith('event', 'view_item', props);
  });

  it('calls window.plausible when it is available', () => {
    const plausible = vi.fn();
    (window as any).plausible = plausible;

    track('test_event', { label: 'foo' });

    expect(plausible).toHaveBeenCalledWith('test_event', { props: { label: 'foo' } });
  });

  it('calls both gtag and plausible when both are available', () => {
    const gtag = vi.fn();
    const plausible = vi.fn();
    (window as any).gtag = gtag;
    (window as any).plausible = plausible;

    track('test_event', { label: 'bar' });

    expect(gtag).toHaveBeenCalledWith('event', 'test_event', { label: 'bar' });
    expect(plausible).toHaveBeenCalledWith('test_event', { props: { label: 'bar' } });
  });

  it('does not throw when window.plausible is absent', () => {
    delete (window as any).plausible;
    expect(() => track('test_event', {})).not.toThrow();
  });

  it('calls window.posthog.capture when posthog is available', () => {
    const capture = vi.fn();
    (window as any).posthog = { capture };

    track('test_event', { label: 'foo' });

    expect(capture).toHaveBeenCalledWith('test_event', { label: 'foo' });
  });

  it('sends to posthog, plausible, and gtag when all three are available', () => {
    const capture = vi.fn();
    const plausible = vi.fn();
    const gtag = vi.fn();
    (window as any).posthog = { capture };
    (window as any).plausible = plausible;
    (window as any).gtag = gtag;

    track('triple_event', { product: 'mat' });

    expect(capture).toHaveBeenCalledWith('triple_event', { product: 'mat' });
    expect(plausible).toHaveBeenCalledWith('triple_event', { props: { product: 'mat' } });
    expect(gtag).toHaveBeenCalledWith('event', 'triple_event', { product: 'mat' });
  });

  it('does not throw when window.posthog is absent', () => {
    delete (window as any).posthog;
    expect(() => track('test_event', {})).not.toThrow();
  });
});

describe('init — affiliate click tracking', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as any).gtag;
    delete (window as any).plausible;
    delete (window as any).posthog;
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

  it('fires plausible for a [data-track] click', () => {
    const plausible = vi.fn();
    (window as any).plausible = plausible;

    document.body.innerHTML =
      '<a data-track="affiliate_click" data-product-name="Cool Harness" href="#">Buy</a>';

    init();

    document.querySelector('a')!.click();

    expect(plausible).toHaveBeenCalledWith(
      'affiliate_click',
      { props: expect.objectContaining({ product_name: 'Cool Harness' }) }
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

  it('fires plausible for a [data-track] click', () => {
    const plausible = vi.fn();
    (window as any).plausible = plausible;

    document.body.innerHTML =
      '<a data-track="hero_click_cooling" data-section="hero" href="#">Shop Cooling</a>';

    init();
    document.querySelector('a')!.click();

    expect(plausible).toHaveBeenCalledWith(
      'hero_click_cooling',
      { props: expect.objectContaining({ section: 'hero' }) }
    );
  });

  it('fires posthog.capture for a [data-track] click', () => {
    const capture = vi.fn();
    (window as any).posthog = { capture };

    document.body.innerHTML =
      '<a data-track="amazon_outbound_click" data-asin="B002" href="#">Amazon</a>';

    init();
    document.querySelector('a')!.click();

    expect(capture).toHaveBeenCalledWith(
      'amazon_outbound_click',
      expect.objectContaining({ asin: 'B002' })
    );
  });
});
