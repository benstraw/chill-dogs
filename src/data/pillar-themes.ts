export type PillarThemeKey = 'cooling' | 'calming' | 'comfort' | 'gear';

export interface PillarTheme {
  key: PillarThemeKey;
  pathPrefixes: string[];
  accent: string;
  accentHover: string;
  accentText: string;
  link: string;
  linkHover: string;
  softBackground: string;
}

export const pillarThemes: Record<PillarThemeKey, PillarTheme> = {
  cooling: {
    key: 'cooling',
    pathPrefixes: ['/cooling/'],
    accent: 'hsl(200, 80%, 28%)',
    accentHover: 'hsl(200, 80%, 22%)',
    accentText: '#ffffff',
    link: '#1c4a5e',
    linkHover: '#143747',
    softBackground: 'hsl(195, 70%, 96%)',
  },
  calming: {
    key: 'calming',
    pathPrefixes: ['/calming/'],
    accent: 'hsl(155, 50%, 26%)',
    accentHover: 'hsl(155, 52%, 20%)',
    accentText: '#ffffff',
    link: '#2f5b3d',
    linkHover: '#21432d',
    softBackground: 'hsl(150, 30%, 96%)',
  },
  comfort: {
    key: 'comfort',
    pathPrefixes: ['/comforting/'],
    accent: 'hsl(345, 38%, 38%)',
    accentHover: 'hsl(345, 40%, 30%)',
    accentText: '#ffffff',
    link: '#8c4a52',
    linkHover: '#6f343d',
    softBackground: 'hsl(345, 40%, 97%)',
  },
  gear: {
    key: 'gear',
    pathPrefixes: ['/gear/', '/travel/', '/safety/'],
    accent: 'hsl(262, 45%, 38%)',
    accentHover: 'hsl(262, 47%, 30%)',
    accentText: '#ffffff',
    link: '#5b3d8c',
    linkHover: '#43286f',
    softBackground: 'hsl(262, 45%, 96%)',
  },
};

export function resolvePillarThemeFromPath(pathname: string): PillarTheme | undefined {
  const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return Object.values(pillarThemes).find((theme) =>
    theme.pathPrefixes.some((prefix) => normalizedPath.startsWith(prefix))
  );
}

export function pillarThemeStyle(theme: PillarTheme): string {
  return [
    `--pillar-accent: ${theme.accent}`,
    `--pillar-accent-hover: ${theme.accentHover}`,
    `--pillar-accent-text: ${theme.accentText}`,
    `--pillar-link: ${theme.link}`,
    `--pillar-link-hover: ${theme.linkHover}`,
    `--pillar-soft-bg: ${theme.softBackground}`,
    `--color-nav-accent: ${theme.accent}`,
    `--color-link: ${theme.link}`,
    `--color-link-hover: ${theme.linkHover}`,
    `--color-primary: ${theme.accent}`,
    `--color-primary-hover: ${theme.accentHover}`,
  ].join('; ');
}
