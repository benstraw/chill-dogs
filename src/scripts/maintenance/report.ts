import { lastObservation, type Report, type State } from './model';
import { ROUTES } from '../../data/routes';

const START = '<!-- product-maintenance:start -->';
const END = '<!-- product-maintenance:end -->';
const escape = (value: unknown): string => String(value ?? 'not recorded').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const markdown = (value: string) => value.replace(/[\r\n]/g, ' ').replace(/[\[\]<>]/g, '');
const htmlLink = (href: string, label: string): string => {
  try {
    const url = new URL(href, 'https://www.chill-dogs.com');
    if (url.protocol === 'https:') return `<a href="${escape(url.href)}" target="_blank" rel="noopener noreferrer">${escape(label)}</a>`;
  } catch { /* Invalid configuration stays readable in the diagnostic report. */ }
  return escape(label);
};
export function renderIssue(report: Report, state: State, previous: string, reportBase: string, runUrl?: string): string {
  const tasks = report.queue.map((f) => `- [ ] **${markdown(f.name)}** (${f.productId}${f.listing ? `; ${f.listing}` : ''}) — ${markdown(f.action)} Evidence (${f.at}): ${markdown(f.evidence)} Pages: ${f.pages.join(', ') || 'none'}. <!-- maintenance:${f.id}:${f.fingerprint}:${Date.parse(state.findings[f.id]?.acknowledgedAt ?? '') || 0} -->`);
  const acknowledged = Object.entries(state.findings).flatMap(([id, h]) => (h.acknowledgments ?? (h.checkedText ? [{ text: h.checkedText, fingerprint: h.acknowledgedFingerprint, cycle: '0' }] : [])).map((ack) => `- [x] ${ack.text} <!-- maintenance:${id}:${ack.fingerprint}:${ack.cycle ?? '0'} -->`));
  const rows = Object.entries(report.coverage).map(([name, c]) => `| ${name} | ${c.status} | ${c.checked} | ${c.skipped} | ${c.unknown} | ${c.failed} | ${c.budgetLimited} | ${c.unconfigured} |`);
  const details = Object.entries(report.coverage).map(([name, c]) => `**${name}:** ${markdown(c.detail)}`);
  const generated = [START, `Last report: ${report.generatedAt} (${report.mode}).`, '', ...tasks, tasks.length ? '' : 'No new review tasks are due.', '', 'Full findings, listing owners/variants, dates, retired URLs, and unused caches:', `[HTML inventory](${reportBase}/inventory.html) · [JSON report](${reportBase}/report.json)${runUrl ? ` · [Download Actions artifacts](${runUrl})` : ''}`, '', '| Integration | Status | Checked | Skipped | Unknown | Failed | Budget limited | Unconfigured |', '|---|---|---:|---:|---:|---:|---:|---:|', ...rows, '', ...details, '', ...report.errors.map((e) => `Maintenance error: ${markdown(e)}`), '', 'Checking a routine review records a human review. Checking a problem acknowledges it; unresolved evidence returns after 14 days, or sooner if it changes.', '', '### Acknowledged tasks (retained)', '', ...acknowledged, '', END].join('\n');
  state.issueGenerated = generated;
  const notes = state.humanNotes?.filter((note) => !previous.slice(0, previous.indexOf(START)).includes(note) && !previous.slice(previous.indexOf(END) + END.length).includes(note));
  if (previous.includes(START) && previous.includes(END)) {
    return previous.slice(0, previous.indexOf(START)) + generated + previous.slice(previous.indexOf(END) + END.length) + (notes?.length ? `\n\nPreserved notes:\n${notes.join('\n')}\n` : '');
  }
  return `${previous || 'Weekly review queue, maintained by CI. Keep human notes outside the generated section.'}\n\n${generated}\n\n## Human notes\n`;
}
export function renderHtml(report: Report, state: State): string {
  const products = report.inventory.map((p) => `<tr><td>${htmlLink(`${ROUTES.shop}${p.id}/`, p.name)}<br><code>${escape(p.id)}</code>${p.retired ? `<br>Retired → ${p.retired.destination ? htmlLink(p.retired.destination, p.retired.destination) : 'not recorded'} (${p.retired.valid ? 'valid' : 'invalid'})` : ''}</td><td>${p.pages.map((page) => htmlLink(page, page)).join('<br>') || 'No editorial placements'}${p.prominent ? '<br>Homepage / hero pick' : ''}</td><td>${escape(p.reviewedAt)}</td><td>${p.listings.map((key) => {
    const l = report.listings.find((l) => l.key === key)!;
    const last = lastObservation(state, key);
    const checked = state.observations.filter((o) => o.listing === key && o.source === 'live').sort((a, b) => b.at.localeCompare(a.at))[0];
    return `<p>${htmlLink(l.url, key)}<br>Impact item: ${escape(l.itemId)}<br>Cache: ${escape(l.cacheAt)}<br>Provider check: ${escape(checked?.at)}<br>Latest evidence: ${escape(last?.at)} (${escape(last?.source)}), ${escape(last?.verdict)}; ${escape(last?.stock)}<br>Owners: ${l.owners.map((o) => escape(`${o.productId}${o.variantId ? ` / ${o.variantId}` : ' / default'}`)).join(', ')}</p>`;
  }).join('')}</td></tr>`);
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Product maintenance inventory</title><style>body{font:16px system-ui;margin:2rem;color:#182328}table{border-collapse:collapse;width:100%}th,td{text-align:left;vertical-align:top;border:1px solid #ccd5d9;padding:.7rem}th{background:#edf3f5}code{overflow-wrap:anywhere}li{margin:1rem 0}input{font:inherit;padding:.7rem;width:25rem;max-width:90%}</style><h1>Product maintenance inventory</h1><p>${escape(report.generatedAt)} · ${escape(report.mode)} · ${report.inventory.length} products and retired URLs · ${report.listings.length} unique listings.</p><p>Cache age is informational. Missing dates mean not recorded. Impact availability is feed-reported; confirm storefront availability manually.</p><h2>Coverage</h2><pre>${escape(JSON.stringify(report.coverage, null, 2))}</pre><h2>All findings (${report.findings.length})</h2><ol>${report.findings.map((f) => `<li><b>${escape(f.name)}</b> (${escape(f.productId)}; ${escape(f.listing)}) — ${escape(f.evidence)}<br>Evidence date: ${escape(f.at)}<br>Pages: ${f.pages.map(escape).join(', ') || 'none'}<br>Next: ${escape(f.action)}<br>ID: ${escape(f.id)}${state.findings[f.id]?.acknowledgedAt ? `<br>Acknowledged: ${escape(state.findings[f.id].acknowledgedAt)}` : ''}</li>`).join('')}</ol><h2>Inventory</h2><label>Filter products <input id="filter" type="search"></label><table><thead><tr><th>Product / URL history</th><th>Editorial placements</th><th>Human review</th><th>Listings / evidence dates</th></tr></thead><tbody>${products.join('')}</tbody></table><h2>Unused cache files</h2><pre>${escape(report.unusedCaches.join('\n') || 'none')}</pre><h2>Request accounting</h2><pre>${escape(JSON.stringify(report.requestAccounting, null, 2))}</pre><h2>Maintenance errors</h2><pre>${escape(report.errors.join('\n') || 'none')}</pre><script>document.getElementById('filter').addEventListener('input',e=>{for(const r of document.querySelectorAll('tbody tr'))r.hidden=!r.textContent.toLowerCase().includes(e.target.value.toLowerCase())})</script></html>`;
}
