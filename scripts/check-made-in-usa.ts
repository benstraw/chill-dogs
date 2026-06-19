import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const CACHE_DIR = join(import.meta.dir, '../src/data/amazon-products');

const USA_PATTERNS = [
  /made in (the )?u\.?s\.?a\.?/i,
  /made in (the )?united states/i,
  /american.made/i,
  /proudly made in/i,
  /manufactured in (the )?u\.?s\.?a\.?/i,
  /manufactured in (the )?united states/i,
];

function matchesUSA(text: string): boolean {
  return USA_PATTERNS.some((p) => p.test(text));
}

const files = (await readdir(CACHE_DIR)).filter(
  (f) => f.endsWith('.json') && !f.startsWith('_')
);

const hits: { asin: string; title: string; matches: string[] }[] = [];
let total = 0;

for (const file of files) {
  const raw = await readFile(join(CACHE_DIR, file), 'utf-8');
  const data = JSON.parse(raw);

  // Normalise across SearchAPI (data.product) and SerpAPI (data.product_results) formats
  const isSearchApi = !!data?.product?.asin;
  const asin: string   = isSearchApi ? data.product.asin        : (data?.product_results?.asin ?? file.replace('.json', ''));
  const title: string  = isSearchApi ? (data.product.title ?? '') : (data?.product_results?.title ?? '');
  const bullets: string[] = isSearchApi
    ? (data.product.feature_bullets ?? [])
    : (Array.isArray(data.about_item) ? data.about_item : []);
  const attributes: { name?: string; value?: string }[] = isSearchApi
    ? (data.product.attributes ?? [])
    : Object.entries(data.item_specifications ?? {}).map(([name, value]) => ({ name, value: String(value) }));
  const description: string = isSearchApi ? (data.product.description ?? '') : '';

  if (!asin) continue;
  total++;

  const matches: string[] = [];

  for (const bullet of bullets) {
    if (matchesUSA(bullet)) matches.push(`bullet: ${bullet.trim().slice(0, 140)}`);
  }

  if (description && matchesUSA(description)) {
    matches.push(`description: ${description.slice(0, 120).replace(/\n/g, ' ')}…`);
  }

  for (const attr of attributes) {
    const val = `${attr.name}: ${attr.value}`;
    if (matchesUSA(val) || attr.name?.toLowerCase().includes('country')) {
      matches.push(`attribute: ${val}`);
    }
  }

  if (matches.length) hits.push({ asin, title, matches });
}

console.log(`\nScanned ${total} cache files\n`);

if (!hits.length) {
  console.log('No "made in USA" mentions found.');
} else {
  console.log(`Found ${hits.length} product(s):\n`);
  for (const hit of hits) {
    console.log(`  ${hit.asin}  ${hit.title}`);
    for (const m of hit.matches) console.log(`    → ${m}`);
    console.log('');
  }
}
