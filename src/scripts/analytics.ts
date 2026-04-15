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

export function track(eventName: string, props: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  if (window.posthog && typeof window.posthog.capture === 'function') {
    window.posthog.capture(eventName, props);
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

export function init(): void {
  if (typeof document === 'undefined') return;

  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    const tracked = target.closest<HTMLElement>('[data-track]');
    if (!tracked) return;

    const eventName = tracked.getAttribute('data-track')!;
    const props = getTrackingData(tracked);
    track(eventName, props);
  });
}
