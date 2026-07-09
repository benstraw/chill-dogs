import { beforeEach, describe, expect, it, vi } from 'vitest';

const searchChewyCatalogItems = vi.fn();
const writeChewyCatalogItemCache = vi.fn();
const deleteChewyCatalogItemCache = vi.fn();
const clearChewyCatalogCache = vi.fn();

vi.mock('../lib/affiliate/impact', () => ({
  cleanConfigValue: (value: string | undefined) => {
    const cleanValue = value?.trim();
    if (!cleanValue || cleanValue === '...' || /^<[^>]+>$/.test(cleanValue)) return undefined;
    return cleanValue;
  },
  listJoinedPrograms: vi.fn(),
  listChewyCatalogItems: vi.fn(),
  listChewyCatalogs: vi.fn(),
  retrieveChewyCatalogItem: vi.fn(),
  searchChewyCatalogItems,
}));

vi.mock('../scripts/chewy-cache', () => ({
  clearChewyCatalogCache,
  DEFAULT_CHEWY_CACHE_THRESHOLD_DAYS: 90,
  deleteChewyCatalogItemCache,
  isChewyCacheEntryStale: vi.fn(() => false),
  normalizeChewyCatalogItem: (item: Record<string, unknown>) => ({
    catalogItemId: item.CatalogItemId,
    name: item.Name,
    provider: 'impact',
  }),
  readChewyCacheManifest: vi.fn(async () => ({})),
  writeChewyCatalogItemCache,
}));

describe('fetch-chewy-data CLI', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('supports search discovery without writing cache files', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exit = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
    const originalArgv = process.argv;
    process.argv = ['bun', 'scripts/fetch-chewy-data.ts', '--search', 'cooling mat', '--no-cache'];
    searchChewyCatalogItems.mockResolvedValue([{ CatalogItemId: 'item-1', Name: 'Cooling Mat' }]);

    await import('../../scripts/fetch-chewy-data.ts');

    expect(searchChewyCatalogItems).toHaveBeenCalledWith({ keyword: 'cooling mat', pageSize: 100, page: 1 });
    expect(writeChewyCatalogItemCache).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith('Found: item-1 (Cooling Mat)');
    expect(log).toHaveBeenCalledWith('\nDone. Found: 1, Cached: 0 (--no-cache)');
    expect(error).not.toHaveBeenCalled();
    expect(exit).not.toHaveBeenCalledWith(1);

    process.argv = originalArgv;
    log.mockRestore();
    error.mockRestore();
    exit.mockRestore();
  });

  it('deletes cache entries without calling Impact', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exit = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
    const originalArgv = process.argv;
    process.argv = ['bun', 'scripts/fetch-chewy-data.ts', '--delete-cache', 'item-1'];
    deleteChewyCatalogItemCache.mockResolvedValue(true);

    await import('../../scripts/fetch-chewy-data.ts');

    expect(deleteChewyCatalogItemCache).toHaveBeenCalledWith('item-1');
    expect(searchChewyCatalogItems).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith('Deleted Chewy cache entry: item-1');
    expect(error).not.toHaveBeenCalled();

    process.argv = originalArgv;
    log.mockRestore();
    error.mockRestore();
    exit.mockRestore();
  });
});
