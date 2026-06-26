import { readFile } from 'node:fs/promises';

import {
  createChewyAffiliateLinkWithBase,
  type ChewyAffiliateOptions,
} from '../src/lib/affiliate/chewy';
import {
  getChewyImpactTrackingConfig,
  getChewyTrackingLinkFromImpact,
  hasImpactTrackingConfig,
  retrieveChewyProgram,
} from '../src/lib/affiliate/impact';

interface ChewyLinkCliOptions extends ChewyAffiliateOptions {
  chewyProductUrl: string;
}

interface CsvInputRow {
  name: string;
  chewy_url: string;
  article_slug?: string;
  placement?: string;
}

interface CsvOutputRow extends CsvInputRow {
  affiliate_url: string;
}

const args = process.argv.slice(2);

if (import.meta.main) {
  try {
    await runChewyLinkCli(args);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

export async function runChewyLinkCli(argv: string[]): Promise<void> {
  const command = argv[0];

  if (command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  if (command === 'verify') {
    await runVerifyCommand();
    return;
  }

  if (command === 'csv') {
    const csvPath = argv[1];
    if (!csvPath) throw new Error('Missing CSV path.');
    const output = await generateChewyCsv(await readFile(csvPath, 'utf8'));
    process.stdout.write(output);
    return;
  }

  const options = parseSingleLinkArgs(argv);
  const affiliateUrl = await generateChewyAffiliateUrl(options);
  console.log(affiliateUrl);
}

export async function generateChewyAffiliateUrl(options: ChewyLinkCliOptions): Promise<string> {
  const trackingBase = await resolveChewyTrackingBase();
  return createChewyAffiliateLinkWithBase(trackingBase, options.chewyProductUrl, {
    articleSlug: options.articleSlug,
    placement: options.placement,
    campaign: options.campaign,
  });
}

export async function generateChewyCsv(csvInput: string): Promise<string> {
  const rows = parseCsv(csvInput);
  const outputRows: CsvOutputRow[] = [];

  for (const row of rows) {
    const chewyUrl = row.chewy_url?.trim();
    if (!chewyUrl) {
      throw new Error(`CSV row "${row.name}" is missing chewy_url.`);
    }

    outputRows.push({
      ...row,
      affiliate_url: await generateChewyAffiliateUrl({
        chewyProductUrl: chewyUrl,
        articleSlug: row.article_slug,
        placement: row.placement,
      }),
    });
  }

  return formatCsv(outputRows, ['name', 'chewy_url', 'article_slug', 'placement', 'affiliate_url']);
}

export function parseCsv(csvInput: string): CsvInputRow[] {
  const rows = parseCsvTable(csvInput);
  if (rows.length === 0) return [];

  const [header, ...records] = rows;
  const normalizedHeader = header.map((cell) => cell.trim());
  const required = ['name', 'chewy_url'];
  for (const column of required) {
    if (!normalizedHeader.includes(column)) {
      throw new Error(`CSV is missing required column "${column}".`);
    }
  }

  return records
    .filter((record) => record.some((cell) => cell.trim()))
    .map((record) => {
      const row: Record<string, string> = {};
      normalizedHeader.forEach((column, index) => {
        row[column] = record[index]?.trim() ?? '';
      });
      return row as unknown as CsvInputRow;
    });
}

export function formatCsv<T extends Record<string, string | undefined>>(rows: T[], columns: string[]): string {
  const lines = [columns.join(',')];

  for (const row of rows) {
    lines.push(columns.map((column) => formatCsvCell(row[column] ?? '')).join(','));
  }

  return `${lines.join('\n')}\n`;
}

async function runVerifyCommand(): Promise<void> {
  const cachedBase = process.env.CHEWY_IMPACT_BASE_URL?.trim();
  const officialBase = hasImpactTrackingConfig() ? await getChewyTrackingLinkFromImpact(getChewyImpactTrackingConfig()) : undefined;

  if (process.env.CHEWY_IMPACT_CAMPAIGN_ID?.trim() && hasImpactTrackingConfig()) {
    const program = await retrieveChewyProgram({ campaignId: process.env.CHEWY_IMPACT_CAMPAIGN_ID });
    if (program.CampaignName) {
      console.log(`Chewy Impact program: ${program.CampaignName}`);
    }
  }

  const activeBase = officialBase ?? cachedBase;
  if (!activeBase) {
    throw new Error('Missing Impact credentials/IDs and CHEWY_IMPACT_BASE_URL.');
  }

  console.log(`Current Chewy Impact tracking base: ${activeBase}`);

  if (cachedBase && officialBase && cachedBase !== officialBase) {
    console.warn('Warning: CHEWY_IMPACT_BASE_URL does not match the official Impact tracking link.');
  }
}

async function resolveChewyTrackingBase(): Promise<string> {
  if (hasImpactTrackingConfig()) {
    return getChewyTrackingLinkFromImpact(getChewyImpactTrackingConfig());
  }

  const cachedBase = process.env.CHEWY_IMPACT_BASE_URL?.trim();
  if (!cachedBase) {
    throw new Error('Missing Impact credentials/IDs and CHEWY_IMPACT_BASE_URL.');
  }

  return cachedBase;
}

function parseSingleLinkArgs(argv: string[]): ChewyLinkCliOptions {
  const chewyProductUrl = argv.find((arg) => !arg.startsWith('--'));
  if (!chewyProductUrl) {
    throw new Error('Missing Chewy product URL.');
  }

  return {
    chewyProductUrl,
    articleSlug: getFlagValue(argv, '--article'),
    placement: getFlagValue(argv, '--placement'),
    campaign: getFlagValue(argv, '--campaign'),
  };
}

function getFlagValue(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  if (index === -1) return undefined;
  return argv[index + 1];
}

function parseCsvTable(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    const nextChar = input[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      cell += '"';
      index++;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') index++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  if (cell || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function formatCsvCell(value: string): string {
  if (!/[",\n\r]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

function printHelp(): void {
  console.log(`
Usage:
  bun run chewy-link -- "https://www.chewy.com/example-product/dp/123456" --article best-cooling-products --placement product-card
  bun run chewy-link:verify
  bun run chewy-link:csv -- ./chewy-products.csv
`);
}
