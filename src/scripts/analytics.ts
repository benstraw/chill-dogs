/**
 * Lightweight, provider-agnostic analytics utility for Chill-Dogs.
 * Uses event delegation on [data-track] attributes.
 * Sends events to Plausible (primary) and GA4 (secondary) when available.
 * Falls back to console logging in dev mode.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    plausible?: (...args: any[]) => void;
    posthog?: {
      capture: (eventName: string, props?: Record<string, any>) => void;
      [key: string]: any;
    };
  }
}

export function track(eventName: string, props: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  let sent = false;

  if (window.posthog) {
    window.posthog.capture(eventName, props);
    sent = true;
  }

  if (window.plausible) {
    window.plausible(eventName, { props });
    sent = true;
  }

  if (window.gtag) {
    window.gtag('event', eventName, props);
    sent = true;
  }

  if (!sent && import.meta.env.DEV) {
    console.log(`[analytics] ${eventName}`, props);
  }
}

function getTrackingData(el: HTMLElement): Record<string, any> {
  const data: Record<string, any> = {};
  for (const attr of el.attributes) {
    if (attr.name.startsWith('data-') && attr.name !== 'data-track') {
      const key = attr.name.slice(5).replace(/-/g, '_');
      data[key] = attr.value;
    }
  }
  return data;
}

function sendBeaconEvent(eventName: string, props: Record<string, any>): void {
  // Fire GA4 event
  track(eventName, props);

  // For outbound clicks, also use sendBeacon as a fallback
  // to ensure the event is captured even if the page unloads
  if (navigator.sendBeacon && eventName === 'amazon_outbound_click') {
    const payload = JSON.stringify({ event: eventName, ...props, ts: Date.now() });
    navigator.sendBeacon(
      '/api/track', // Will 404 in static — that's fine, GA4 is the real sink
      new Blob([payload], { type: 'application/json' })
    );
  }
}

export function init(): void {
  if (typeof document === 'undefined') return;

  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    const tracked = target.closest<HTMLElement>('[data-track]');
    if (!tracked) return;

    const eventName = tracked.getAttribute('data-track')!;
    const props = getTrackingData(tracked);

    if (eventName === 'amazon_outbound_click') {
      sendBeaconEvent(eventName, props);
    } else {
      track(eventName, props);
    }
  });
}
