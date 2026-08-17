/**
 * Lightweight analytics utility for chill-dogs.
 * Uses event delegation on [data-track] attributes.
 * Sends events to PostHog when available.
 */

declare global {
  interface Window {
    posthog?: {
      capture: (eventName: string, props?: Record<string, any>) => void;
      [key: string]: any;
    };
  }
}

/**
 * Local dev servers and Vercel preview deploys were producing roughly half of all raw
 * events, which makes conversion rates on the real site unreadable. Capture is off on
 * those hosts by default. Set `localStorage['chill-dogs:analytics'] = 'on'` to opt a
 * dev session back in when you need to test tracking.
 *
 * The PostHog loader in src/components/Analytics.astro applies the same rule inline —
 * it has to, because it is an is:inline script and cannot import this module. Keep the
 * two in sync.
 */
export function shouldCaptureAnalytics(hostname: string): boolean {
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '0.0.0.0') return false;
  if (hostname.endsWith('.localhost')) return false;
  if (/^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname)) return false;
  if (hostname.endsWith('.vercel.app')) return false;
  return true;
}

function capturingEnabled(): boolean {
  try {
    if (window.localStorage.getItem('chill-dogs:analytics') === 'on') return true;
  } catch {
    // storage blocked; fall through to host rules
  }
  return shouldCaptureAnalytics(window.location.hostname);
}

export function track(eventName: string, props: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  if (!capturingEnabled()) return;

  if (window.posthog && typeof window.posthog.capture === 'function') {
    window.posthog.capture(eventName, props);
  }
}

function getTrackingData(el: HTMLElement): Record<string, any> {
  const data: Record<string, any> = {};
  for (const attr of el.attributes) {
    if (attr.name.startsWith('data-') && attr.name !== 'data-track' && attr.name !== 'data-track-also') {
      const key = attr.name.slice(5).replace(/-/g, '_');
      data[key] = attr.value;
    }
  }
  return data;
}

export function init(): void {
  if (typeof document === 'undefined') return;

  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    const tracked = target.closest<HTMLElement>('[data-track]');
    if (!tracked) return;

    const eventName = tracked.getAttribute('data-track')!;
    const props = getTrackingData(tracked);
    track(eventName, props);

    const alsoEventName = tracked.getAttribute('data-track-also');
    if (alsoEventName) {
      track(alsoEventName, props);
    }
  });
}
