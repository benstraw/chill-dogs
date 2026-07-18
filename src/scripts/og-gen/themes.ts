import type { SitemapPage } from '../../data/content-sitemap';

export type OgThemeKey = 'cooling' | 'calming' | 'comfort' | 'gear';

export interface OgTheme {
  key: OgThemeKey;
  bg: string;
  rightBg: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  dotColor: string;
  ruleColor: string;
  label: string;
}

export const OG_THEMES: Record<OgThemeKey, OgTheme> = {
  cooling: {
    key: 'cooling',
    bg: '#f0f5f7',
    rightBg: '#e6eff3',
    accent: '#1c4a5e',
    accentBg: 'rgba(28,74,94,0.10)',
    accentBorder: 'rgba(28,74,94,0.28)',
    dotColor: 'rgba(0,0,0,0.05)',
    ruleColor: 'rgba(0,0,0,0.07)',
    label: 'Cooling Guide',
  },
  calming: {
    key: 'calming',
    bg: '#eff7f2',
    rightBg: '#e6f0ea',
    accent: '#2f5b3d',
    accentBg: 'rgba(47,91,61,0.10)',
    accentBorder: 'rgba(47,91,61,0.28)',
    dotColor: 'rgba(0,0,0,0.05)',
    ruleColor: 'rgba(0,0,0,0.07)',
    label: 'Calming Guide',
  },
  comfort: {
    key: 'comfort',
    bg: '#f8f0f2',
    rightBg: '#f1e5e8',
    accent: '#8c4a52',
    accentBg: 'rgba(140,74,82,0.10)',
    accentBorder: 'rgba(140,74,82,0.28)',
    dotColor: 'rgba(0,0,0,0.05)',
    ruleColor: 'rgba(0,0,0,0.08)',
    label: 'Comforting Guide',
  },
  gear: {
    key: 'gear',
    bg: '#f4f1f9',
    rightBg: '#ece7f4',
    accent: '#5b3d8c',
    accentBg: 'rgba(91,61,140,0.10)',
    accentBorder: 'rgba(91,61,140,0.28)',
    dotColor: 'rgba(0,0,0,0.05)',
    ruleColor: 'rgba(0,0,0,0.08)',
    label: 'Gear Guide',
  },
};

export function resolveOgTheme(page: SitemapPage): OgTheme {
  if (page.href.startsWith('/cooling/')) return OG_THEMES.cooling;
  if (page.href.startsWith('/calming/')) return OG_THEMES.calming;
  if (page.href.startsWith('/comforting/')) return OG_THEMES.comfort;
  if (page.href.startsWith('/gear/')) return OG_THEMES.gear;

  return OG_THEMES.gear;
}

