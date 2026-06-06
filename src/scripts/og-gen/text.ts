import { ogSlugFromPathname } from '../../utils/og';

export interface TitleParts {
  before: string;
  after?: string;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function outputFilenameFromHref(href: string): string {
  return `${ogSlugFromPathname(href)}.jpg`;
}

export function splitOgTitle(title: string): TitleParts {
  const normalized = normalizeWhitespace(title);
  const colonIndex = normalized.indexOf(':');
  const dashIndex = normalized.indexOf('—');
  const candidates = [colonIndex, dashIndex].filter((index) => index >= 0);

  if (candidates.length === 0) {
    return { before: normalized };
  }

  const splitIndex = Math.min(...candidates);
  const delimiter = normalized[splitIndex];
  const before = normalized.slice(0, delimiter === ':' ? splitIndex + 1 : splitIndex).trim();
  const after = normalized.slice(delimiter === ':' ? splitIndex + 1 : splitIndex).trim();

  return after ? { before, after } : { before: normalized };
}

export function resolveOgSummary(options: { ogSummary?: string; description: string }): string {
  if (options.ogSummary) {
    return normalizeWhitespace(options.ogSummary);
  }

  const normalized = normalizeWhitespace(options.description);
  const sentenceEnd = normalized.search(/[.!?](?:\s|$)/);
  const firstSentence = sentenceEnd >= 0 ? normalized.slice(0, sentenceEnd + 1) : normalized;
  const emDashIndex = firstSentence.indexOf(' — ');
  const colonListIndex = firstSentence.search(/:\s+\w+(?:,|\sand\s|\sor\s)/i);
  const cutPoints = [emDashIndex, colonListIndex, 160].filter((index) => index >= 0);
  const cutAt = Math.min(...cutPoints);
  const resolved = firstSentence.slice(0, cutAt).trim();

  return resolved || normalized.slice(0, 160).trim();
}

