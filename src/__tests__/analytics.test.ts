import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { track, init, shouldCaptureAnalytics } from '../scripts/analytics';

// jsdom runs on localhost, where capture is off by default. The suite opts in through
// the same escape hatch a developer would use, which keeps it exercised.
function optIn() {
  window.localStorage.setItem('chill-dogs:analytics', 'on');
}

describe('shouldCaptureAnalytics', () => {
  it('captures on the production host', () => {
    expect(shouldCaptureAnalytics('www.chill-dogs.com')).toBe(true);
    expect(shouldCaptureAnalytics('chill-dogs.com')).toBe(true);
  });

  it('does not capture on local dev servers', () => {
    for (const h of ['localhost', '127.0.0.1', '0.0.0.0', '::1', '127.0.0.53', 'foo.localhost']) {
      expect(shouldCaptureAnalytics(h), h).toBe(false);
    }
  });

  it('does not capture on private network addresses', () => {
    for (const h of ['192.168.1.14', '10.0.0.7', '172.16.0.3', '172.31.255.1']) {
      expect(shouldCaptureAnalytics(h), h).toBe(false);
    }
  });

  it('does not capture on any Vercel preview host', () => {
    for (const h of [
      'chill-dogs-navy.vercel.app',
      'chill-dogs-git-claude-chill-dogs-conv-6dcb1f-benstraws-projects.vercel.app',
    ]) {
      expect(shouldCaptureAnalytics(h), h).toBe(false);
    }
  });

  it('still captures on hosts that merely contain a blocked term', () => {
    expect(shouldCaptureAnalytics('vercel.app.chill-dogs.com')).toBe(true);
    expect(shouldCaptureAnalytics('localhost.chill-dogs.com')).toBe(true);
  });
});

describe('track', () => {
  beforeEach(optIn);

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    delete (window as any).posthog;
  });

  it('does not capture on a dev host without the opt-in', () => {
    window.localStorage.clear();
    const capture = vi.fn();
    (window as any).posthog = { capture };

    track('test_event', { label: 'foo' });

    expect(capture).not.toHaveBeenCalled();
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

  it('does not log analytics events when posthog is absent', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    delete (window as any).posthog;

    track('test_event', {});

    expect(log).not.toHaveBeenCalled();
  });
});

describe('init — click tracking', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    optIn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
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

  it('fires a secondary event from data-track-also without leaking track_also props', () => {
    const capture = vi.fn();
    (window as any).posthog = { capture };

    document.body.innerHTML =
      '<a data-track="affiliate_outbound_click" data-track-also="amazon_outbound_click" data-merchant="amazon" data-asin="B001" data-product-name="Toy" href="#">Go</a>';

    init();
    document.querySelector('a')!.click();

    expect(capture).toHaveBeenNthCalledWith(
      1,
      'affiliate_outbound_click',
      expect.objectContaining({ merchant: 'amazon', asin: 'B001', product_name: 'Toy' })
    );
    expect(capture).toHaveBeenNthCalledWith(
      2,
      'amazon_outbound_click',
      expect.objectContaining({ merchant: 'amazon', asin: 'B001', product_name: 'Toy' })
    );
    expect(capture.mock.calls[0][1]).not.toHaveProperty('track_also');
    expect(capture.mock.calls[1][1]).not.toHaveProperty('track_also');
  });
});
