/**
 * Classify an Amazon /dp/ response for `bun run check:asins`. Kept free of I/O so it
 * can be tested against fixture pages.
 */

export type Status = 'OK' | 'UNAVAILABLE' | 'REMOVED' | 'RATE LIMITED' | `ERROR ${number}` | 'UNKNOWN' | 'FETCH ERROR';

export function classify(responseStatus: number, html: string, finalUrl: string): { status: Status; detail?: string } {
  if (responseStatus === 404) return { status: 'REMOVED', detail: '404' };
  if (responseStatus === 429 || responseStatus === 503) return { status: 'RATE LIMITED', detail: `HTTP ${responseStatus}` };
  if (responseStatus !== 200) return { status: `ERROR ${responseStatus}` };

  // Redirected away from /dp/ — product no longer has its own page
  if (!finalUrl.includes('/dp/')) {
    return { status: 'REMOVED', detail: 'redirected off product page' };
  }

  const lower = html.toLowerCase();
  const hasProductTitle = html.includes('id="productTitle"') || html.includes("id='productTitle'");

  // Unavailable — product page exists but item can't be bought
  if (lower.includes('currently unavailable') || lower.includes('this item is not available')) {
    return { status: 'UNAVAILABLE' };
  }

  // A real product page is live, whatever else its text says. The error-page phrases
  // below used to be checked first, so a live listing mentioning that one size
  // "isn't available" was reported REMOVED and failed the weekly check.
  if (hasProductTitle) return { status: 'OK' };

  // Amazon "page not found" / error pages
  if (
    lower.includes("isn't available") ||
    lower.includes('page not found') ||
    lower.includes('looking for something?') ||
    lower.includes('dogs of amazon')
  ) {
    return { status: 'REMOVED', detail: 'error page' };
  }

  // CAPTCHA or bot-detection wall — couldn't assess
  if (lower.includes('captcha') || lower.includes('robot check')) {
    return { status: 'UNKNOWN', detail: 'CAPTCHA / bot check' };
  }

  return { status: 'UNKNOWN', detail: 'no product title found in page' };
}
