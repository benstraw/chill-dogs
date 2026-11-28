import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
import { reportFailed, runMaintenance } from '../src/scripts/maintenance/run';
import type { Report } from '../src/scripts/maintenance/model';

export async function main(args = process.argv.slice(2)): Promise<number> {
  const allowed = ['--offline', '--live', '--chewy-smoke', '--publish', '--output', '--gate'];
  if (args.some((arg) => arg.startsWith('--') && !allowed.includes(arg)) || ['--offline', '--live', '--chewy-smoke'].filter((flag) => args.includes(flag)).length > 1) throw new Error('Choose --offline, --live, or --chewy-smoke; optional --publish and --output <directory>.');
  const outputIndex = args.indexOf('--output');
  if (outputIndex >= 0 && (!args[outputIndex + 1] || args[outputIndex + 1].startsWith('--'))) throw new Error('--output needs a directory.');
  const output = resolve(outputIndex >= 0 ? args[outputIndex + 1] : '.cache/maintenance');
  if (args.includes('--gate')) return reportFailed(JSON.parse(readFileSync(resolve(output, 'report.json'), 'utf8')) as Report) ? 1 : 0;
  const report = await runMaintenance({ root: process.cwd(), output, mode: args.includes('--live') ? 'all' : args.includes('--chewy-smoke') ? 'chewy-smoke' : 'offline', publish: args.includes('--publish') });
  console.log(`Maintenance: ${report.inventory.length} products and historical URLs; ${report.listings.length} listings; ${report.findings.length} findings; ${report.queue.length} review tasks.`);
  for (const [name, c] of Object.entries(report.coverage)) console.log(`${name}: ${c.status}; checked=${c.checked}, skipped=${c.skipped}, unknown=${c.unknown}, failed=${c.failed}, budget-limited=${c.budgetLimited}, unconfigured=${c.unconfigured}`);
  console.log(`Reports: ${output}`);
  for (const error of report.errors) console.error(error);
  return reportFailed(report) ? 1 : 0;
}
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().then((code) => { process.exitCode = code; }).catch(() => { console.error('Maintenance command failed; see previously written reports.'); process.exitCode = 1; });
}
