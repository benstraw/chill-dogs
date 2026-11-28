import { describe, expect, it } from 'vitest';
import { collectInventory, addReviewFindings } from '../../scripts/maintenance/inventory';
import { emptyState, reconcile, seedCaches, type Report } from '../../scripts/maintenance/model';
import { coverage } from '../../scripts/maintenance/providers';
import { reportFailed } from '../../scripts/maintenance/run';

describe('built maintenance inventory', () => {
  it('joins actual placements, variants, retired URLs, caches, and editorial findings without integrity errors', () => {
    const at = '2026-11-28T13:00:00.000Z';
    const collected = collectInventory(process.cwd(), at);
    const report: Report = { version: 1, mode: 'offline', generatedAt: at, ...collected, queue: [], coverage: { amazon: coverage(286), chewy: coverage(102) }, integrationStatus: {}, requestAccounting: [], errors: [] };
    const state = emptyState(); seedCaches(state, report.listings); addReviewFindings(report, state); reconcile(report, state);
    expect(reportFailed(report)).toBe(false);
    expect(report.inventory.find((p) => p.id === 'green-pet-shop-cooling-pad')?.pages).toContain('/');
    expect(report.inventory.find((p) => p.id === 'enovoe-car-window-shades')?.pages).toContain('/travel/dog-road-trip-gear/');
    expect(report.inventory.filter((p) => p.retired).every((p) => p.retired?.valid)).toBe(true);
    expect(report.findings.some((f) => f.id.startsWith('retirement-'))).toBe(false);
    expect(report.listings.some((l) => l.owners.some((o) => o.variantId))).toBe(true);
    expect(report.inventory.flatMap((p) => p.pages).some((p) => p.startsWith('/shop/') || p.startsWith('/admin/'))).toBe(false);
    expect(report.listings.filter((l) => l.cached).every((l) => l.cached?.source === 'cache' && l.cached.at === l.cacheAt)).toBe(true);
    expect(report.queue).toHaveLength(5);
  });
});
