import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { SatoriOptions } from 'satori';

function readFont(relativePath: string): Buffer {
  const fullPath = path.join(process.cwd(), relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Missing OG font file: ${relativePath}`);
  }

  return readFileSync(fullPath);
}

export function loadOgFonts(): SatoriOptions['fonts'] {
  return [
    {
      name: 'Inter',
      data: readFont('node_modules/@fontsource/inter/files/inter-latin-400-normal.woff'),
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Inter',
      data: readFont('node_modules/@fontsource/inter/files/inter-latin-600-normal.woff'),
      weight: 600,
      style: 'normal',
    },
    {
      name: 'Inter',
      data: readFont('node_modules/@fontsource/inter/files/inter-latin-800-normal.woff'),
      weight: 800,
      style: 'normal',
    },
  ];
}

