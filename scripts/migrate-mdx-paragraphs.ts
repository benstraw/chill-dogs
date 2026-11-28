/** One-time paragraph migration. Defaults to a dry run; use --write to apply. */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { migrateMdxParagraphs } from './lib/mdx-paragraphs';

const args = process.argv.slice(2);
if (args.some((arg) => arg !== '--write')) throw new Error('Usage: bun run scripts/migrate-mdx-paragraphs.ts [--write]');
const directory = fileURLToPath(new URL('../src/content/articles/', import.meta.url));
// Prepare every edit before writing, so a parse error cannot leave half a migration.
const edits = await Promise.all((await readdir(directory)).filter((file) => file.endsWith('.mdx')).sort().map(async (file) => {
  const path = join(directory, file);
  const source = await readFile(path, 'utf8');
  return { path, file, source, next: migrateMdxParagraphs(source) };
}));
const changed = edits.filter(({ source, next }) => source !== next);
if (args.includes('--write')) for (const { path, next } of changed) await writeFile(path, next);
console.log(`${args.includes('--write') ? 'Migrated' : 'Would migrate'} ${changed.length} of ${edits.length} articles`);
for (const { file } of changed) console.log(`  ${file}`);
