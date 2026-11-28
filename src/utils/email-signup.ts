/**
 * Newsletter signup placements and ids.
 *
 * Every EmailSignup form names where it sits (`placement`) and gets a `signup_id`
 * unique to that placement on that page. Both ride on every PostHog event the form
 * sends (`email_signup_view`, `email_signup_start`, `email_signup_submit`) and on the
 * Buttondown subscriber's metadata, so a signup can be traced to the exact form.
 */

export const SIGNUP_PLACEMENTS = ['footer', 'homepage_inline', 'subscribe_page', 'article_inline'] as const;
export type SignupPlacement = (typeof SIGNUP_PLACEMENTS)[number];

export function normalizeIdSegment(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '/') return 'root';
  return (
    trimmed
      .replace(/^\/+|\/+$/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'root'
  );
}

/** `email-signup-<placement>-<page>`, e.g. `email-signup-article-inline-lifestyle-how-to-…`. */
export function signupId(placement: SignupPlacement, page: string): string {
  return `email-signup-${normalizeIdSegment(placement)}-${normalizeIdSegment(page)}`;
}
