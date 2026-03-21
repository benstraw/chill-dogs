/**
 * Extracts the ASIN from an Amazon product URL.
 * Returns empty string if no ASIN is found.
 *
 * @example
 * extractAsin('https://www.amazon.com/dp/B0FH8GDBLX/?tag=chill-dogs-20') // 'B0FH8GDBLX'
 */
export function extractAsin(url: string): string {
  return url.match(/\/dp\/([A-Z0-9]+)/)?.[1] ?? '';
}
