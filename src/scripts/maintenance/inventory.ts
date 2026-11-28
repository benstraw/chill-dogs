import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { computeBuildStamp } from '../../../scripts/build-stamp.mjs';
import { productCatalogItems, type ProductCatalogItem } from '../../data/product-catalog';
import { buildProductPageMap } from '../../data/product-page-map';
import { PUBLISHED_PRODUCT_IDS } from '../../data/product-url-history';
import { redirects } from '../../data/redirects';
import { staticSitemapSections } from '../../data/content-sitemap';
import { ROUTES } from '../../data/routes';
import { amazonObservation, chewyDestination, chewyObservation, record } from './providers';
import { DAY, makeFinding, type Finding, type InventoryProduct, type Listing, type Report, type State } from './model';

export function readJson(file: string): any {
  return JSON.parse(readFileSync(file, 'utf8'));
}
function optionalJson(file: string): any {
  return existsSync(file) ? readJson(file) : {};
}
export function validDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}
export function assembleListings(products: ProductCatalogItem[]): Listing[] {
  const listings = new Map<string, Listing>();
  for (const product of products) {
    const groups = [{ variantId: undefined as string | undefined, offers: product.offers }, ...(product.variantGroup?.variants ?? []).filter((v) => v.status !== 'unavailable').map((v) => ({ variantId: v.id, offers: v.offers }))];
    for (const group of groups) for (const offer of group.offers) {
      if (offer.status === 'unavailable') continue;
      const id = offer.merchant === 'amazon' ? offer.asin : offer.merchant === 'chewy' ? chewyDestination(offer.canonicalUrl ?? offer.url) ?? offer.merchantProductId ?? offer.url : offer.canonicalUrl ?? offer.url;
      const key = `${offer.merchant}:${id}`;
      const listing = listings.get(key) ?? { key, merchant: offer.merchant, id, url: offer.url, canonicalUrl: offer.canonicalUrl, owners: [] };
      if (!listing.owners.some((o) => o.productId === product.id && o.variantId === group.variantId)) listing.owners.push({ productId: product.id, variantId: group.variantId });
      listings.set(key, listing);
    }
  }
  return [...listings.values()].sort((a, b) => a.key.localeCompare(b.key));
}
export function mapChewyCache(listing: Listing, rawItems: unknown[], manifest: Record<string, any>): void {
  const destination = chewyDestination(listing.canonicalUrl ?? listing.url);
  if (!destination) return;
  const matches = rawItems.map(record).filter((item) => chewyDestination(String(item.Url ?? '')) === destination && /^product_\d+_.+/.test(String(item.Id ?? '')));
  if (matches.length !== 1) return;
  const item = matches[0];
  if (String(item.Id) !== `product_${item.CatalogId}_${item.CatalogItemId}`) return;
  const uri = String(item.Uri ?? '').match(/\/Catalogs\/(\d+)\/(Item|Items)\/([^/?]+)$/);
  if (item.Uri && (!uri || uri[1] !== String(item.CatalogId) || uri[3] !== item.Id)) return;
  listing.itemId = item.Id;
  listing.catalogId = String(item.CatalogId);
  listing.itemEndpoint = uri?.[2] === 'Item' ? 'Item' : 'Items';
  const cacheAt = manifest[String(item.CatalogItemId)]?.fetchedAt;
  if (validDate(cacheAt)) {
    listing.cacheAt = new Date(cacheAt).toISOString();
    const observation = chewyObservation(item, listing, listing.cacheAt, 'cache');
    if (observation.verdict !== 'integration-failure' && observation.verdict !== 'identity-mismatch') listing.cached = observation;
  }
}
function filesUnder(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? filesUnder(join(dir, e.name)) : [join(dir, e.name)]);
}
const decode = (value: string) => value.replace(/&amp;/g, '&').replace(/&#(?:x27|39);/g, "'").replace(/&quot;/g, '"');
export function editorialPlacements(pages: { pathname: string; html: string }[], listings: Listing[], productIds: string[]): Map<string, string[]> {
  const result = new Map(productIds.map((id) => [id, [] as string[]]));
  const productLinks = new Map(productIds.map((id) => [`${ROUTES.shop}${id}/`, id]));
  const amazonOwners = new Map<string, Set<string>>(), chewyOwners = new Map<string, Set<string>>();
  for (const listing of listings) {
    const index = listing.merchant === 'amazon' ? amazonOwners : listing.merchant === 'chewy' ? chewyOwners : undefined;
    const key = listing.merchant === 'amazon' ? listing.id : chewyDestination(listing.canonicalUrl ?? listing.url);
    if (!index || !key) continue;
    const owners = index.get(key) ?? new Set<string>();
    listing.owners.forEach((owner) => owners.add(owner.productId));
    index.set(key, owners);
  }
  for (const { pathname, html } of pages) {
    if (pathname.startsWith(ROUTES.shop) || pathname.startsWith('/admin/') || /http-equiv=["']refresh/i.test(html)) continue;
    // Inspect rendered links and picker ownership; an ASIN in JSON-LD, a script,
    // or a cache URL is not evidence of an editorial card.
    const promoted = new Set<string>();
    const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
    for (const match of visibleHtml.matchAll(/<a\b[^>]*>|<[^>]+\bdata-product-id=["'][^"']+["'][^>]*>/gi)) {
      const tag = match[0];
      const attrs = Object.fromEntries([...tag.matchAll(/([\w-]+)=["']([^"']*)["']/g)].map((m) => [m[1], decode(m[2])]));
      if (attrs['data-product-id'] && result.has(attrs['data-product-id'])) promoted.add(attrs['data-product-id']);
      const href = attrs.href ?? '';
      const productId = productLinks.get(href);
      if (productId) promoted.add(productId);
      const asin = attrs['data-asin'] ?? href.match(/amazon\.com\/(?:dp|gp\/product)\/([A-Z0-9]{10})/)?.[1];
      const chewy = chewyDestination(href);
      if (asin) amazonOwners.get(asin)?.forEach((id) => promoted.add(id));
      if (chewy) chewyOwners.get(chewy)?.forEach((id) => promoted.add(id));
    }
    for (const id of promoted) if (result.has(id)) result.get(id)!.push(pathname);
  }
  return result;
}
export function collectInventory(root: string, at: string): Pick<Report, 'inventory' | 'listings' | 'unusedCaches' | 'findings'> {
  const products = productCatalogItems;
  const listings = assembleListings(products);
  const findings: Finding[] = [];
  const add = (id: string, productId: string, name: string, evidence: string, action: string, priority = 1, pages: string[] = [], listing?: string) => findings.push(makeFinding({ id, productId, name, evidence, action, priority, pages, at, listing }));
  const dist = join(root, 'dist');
  if (!existsSync(join(dist, 'index.html'))) throw new Error('Build the site before collecting maintenance placements.');
  const stamp = join(root, '.cache/dist-build-stamp');
  if (!existsSync(stamp) || readFileSync(stamp, 'utf8').trim() !== computeBuildStamp()) throw new Error('Built site is stale or unverified; rebuild before auditing placements.');
  const pages = filesUnder(dist).filter((file) => file.endsWith('/index.html')).map((file) => ({ pathname: `${file.slice(dist.length).replace(/index\.html$/, '')}`, html: readFileSync(file, 'utf8') }));
  const placementMap = editorialPlacements(pages, listings, products.map((p) => p.id));
  const heroes = new Set(staticSitemapSections.flatMap((s) => s.pages).map((p) => p.heroProduct?.asin).filter(Boolean));
  const inventory: InventoryProduct[] = products.map((p) => {
    const productListings = listings.filter((l) => l.owners.some((o) => o.productId === p.id));
    const productPages = [...new Set(placementMap.get(p.id) ?? [])].sort();
    return { id: p.id, name: p.name, source: p.source, pages: productPages, prominent: productPages.includes(ROUTES.home) || productListings.some((l) => heroes.has(l.id)), listings: productListings.map((l) => l.key) };
  });
  const expectedMap = buildProductPageMap();
  const ids = new Set<string>();
  for (const product of products) {
    const entry = inventory.find((p) => p.id === product.id)!;
    if (ids.has(product.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.id)) add(`config-${product.id}`, product.id, product.name, 'Duplicate or invalid public product ID.', 'Repair the canonical product configuration.');
    ids.add(product.id);
    if (!PUBLISHED_PRODUCT_IDS.includes(product.id)) add(`history-${product.id}`, product.id, product.name, 'Published product URL is missing from product-url-history.', 'Append the current product ID to the published URL history.');
    const images = [product.image, ...(product.images ?? []), ...(product.variantGroup?.variants.map((v) => v.image) ?? [])].filter(Boolean);
    if (!product.image || images.some((image) => image!.src.startsWith('/') && !existsSync(join(root, 'public', image!.src)))) add(`asset-${product.id}`, product.id, product.name, 'A required product image is missing.', 'Restore the missing asset or review the canonical image reference.', 1, entry.pages);
    if (!entry.listings.length || !existsSync(join(dist, ROUTES.shop, product.id, 'index.html'))) add(`config-listings-${product.id}`, product.id, product.name, 'No active listing or built product page.', 'Repair the product offers or product-page configuration.', 1, entry.pages);
    if (product.variantGroup) {
      const variants = product.variantGroup.variants;
      const defaultVariant = variants.find((v) => v.id === product.variantGroup!.defaultVariantId);
      if (!defaultVariant || defaultVariant.status === 'unavailable' || new Set(variants.map((v) => v.id)).size !== variants.length) add(`variants-${product.id}`, product.id, product.name, 'Invalid default variant or duplicate variant identifiers.', 'Repair default/variant ownership before checking merchant data.', 1, entry.pages);
    }
    for (const expected of expectedMap[product.id] ?? []) {
      if (!pages.some((p) => p.pathname === expected.href)) add(`placement-${product.id}-${expected.href.replace(/\W/g, '-')}`, product.id, product.name, `Declared editorial page ${expected.href} is absent from the build.`, 'Repair the page-placement map or restore the page.', 1, entry.pages);
      else if (!entry.pages.includes(expected.href)) add(`placement-${product.id}-${expected.href.replace(/\W/g, '-')}`, product.id, product.name, `Declared placement on ${expected.href} was not found in the rendered page.`, 'Inspect the rendered product card and repair its placement or the placement map.', 1, entry.pages);
    }
  }
  for (const listing of listings) {
    if (listing.merchant === 'amazon' && !/^[A-Z0-9]{10}$/.test(listing.id) || !/^https:\/\//.test(listing.url)) for (const owner of listing.owners) add(`offer-${owner.productId}-${listing.id.replace(/\W/g, '-')}`, owner.productId, products.find((p) => p.id === owner.productId)!.name, `Invalid ${listing.merchant} listing identifier or offer URL.`, 'Fix the canonical merchant offer.', 1, [], listing.key);
  }
  const edgeRedirects = optionalJson(join(root, 'vercel.json')).redirects ?? [];
  for (const id of PUBLISHED_PRODUCT_IDS.filter((id) => !ids.has(id))) {
    const route = `${ROUTES.shop}${id}/`;
    const rule = redirects[route];
    const destination = typeof rule === 'string' ? rule : rule?.destination;
    const status = typeof rule === 'object' ? rule.status : 301;
    const target = destination?.split(/[?#]/)[0];
    const targetFile = target ? join(dist, target, 'index.html') : '';
    const fragment = destination?.split('#')[1];
    const targetExists = !!target && target.startsWith('/') && existsSync(targetFile) && !redirects[target] && (!fragment || readFileSync(targetFile, 'utf8').includes(`id="${decodeURIComponent(fragment)}"`));
    const valid = !!destination && targetExists && [301, 308].includes(status) && [route, route.slice(0, -1)].every((source) => edgeRedirects.some((r: any) => r.source === source && r.destination === destination && (r.permanent || [301, 308].includes(r.statusCode))));
    inventory.push({ id, name: id, source: 'published URL history', pages: [], prominent: false, listings: [], retired: { destination, valid } });
    if (!valid) add(`retirement-${id}`, id, id, 'Retired URL lacks matching permanent redirects to a built destination.', 'Repair both redirect surfaces and retain the ID in published-product history.');
  }
  const amazonDir = join(root, 'src/data/amazon-products'), chewyDir = join(root, 'src/data/chewy-products');
  const amazonManifest = optionalJson(join(amazonDir, '_index.json')), chewyManifest = optionalJson(join(chewyDir, '_index.json'));
  const unusedCaches: string[] = [];
  for (const file of filesUnder(amazonDir).filter((f) => f.endsWith('.json') && !f.endsWith('/_index.json'))) {
    const id = file.split('/').pop()!.replace(/\.json$/, '');
    const listing = listings.find((l) => l.key === `amazon:${id}`);
    if (!listing) { unusedCaches.push(file.slice(root.length + 1)); continue; }
    try {
      const cacheAt = amazonManifest[id]?.fetchedAt;
      if (validDate(cacheAt)) {
        const raw = readJson(file);
        listing.cacheAt = new Date(cacheAt).toISOString();
        const observation = amazonObservation(raw, listing, listing.cacheAt, String(amazonManifest[id].provider ?? 'unknown'), 'cache');
        if (observation.verdict !== 'integration-failure' && observation.verdict !== 'identity-mismatch') listing.cached = observation;
      }
    } catch { add(`cache-amazon-${id}`, listing.owners[0].productId, id, 'Malformed Amazon cache JSON.', 'Refresh only this cache entry after reviewing its canonical ASIN.'); }
  }
  const chewyRaw: { file: string; data: unknown }[] = [];
  for (const file of filesUnder(chewyDir).filter((f) => f.endsWith('.json') && !f.endsWith('/_index.json'))) {
    try { chewyRaw.push({ file, data: readJson(file) }); } catch {
      const id = file.split('/').pop()!.replace(/\.json$/, '');
      const destination = chewyDestination(String(chewyManifest[id]?.url ?? ''));
      const referenced = destination && listings.find((l) => l.merchant === 'chewy' && chewyDestination(l.canonicalUrl ?? l.url) === destination);
      if (referenced) add(`cache-chewy-${id}`, referenced.owners[0].productId, products.find((p) => p.id === referenced.owners[0].productId)!.name, 'Malformed referenced Chewy cache JSON.', 'Review and selectively refresh this cache entry.', 1, [], referenced.key);
      else unusedCaches.push(file.slice(root.length + 1));
    }
  }
  for (const listing of listings.filter((l) => l.merchant === 'chewy')) mapChewyCache(listing, chewyRaw.map((r) => r.data), chewyManifest);
  for (const item of chewyRaw) if (!listings.some((l) => l.merchant === 'chewy' && l.itemId === record(item.data).Id)) unusedCaches.push(item.file.slice(root.length + 1));
  for (const id of Object.keys(amazonManifest)) if (!listings.some((l) => l.key === `amazon:${id}`) && !existsSync(join(amazonDir, `${id}.json`))) unusedCaches.push(`src/data/amazon-products/_index.json#${id}`);
  for (const id of Object.keys(chewyManifest)) if (!listings.some((l) => l.merchant === 'chewy' && l.itemId?.endsWith(`_${id}`)) && !existsSync(join(chewyDir, `${id}.json`))) unusedCaches.push(`src/data/chewy-products/_index.json#${id}`);
  return { inventory, listings, unusedCaches: unusedCaches.sort(), findings };
}
export function addReviewFindings(report: Report, state: State): void {
  const at = report.generatedAt;
  for (const product of report.inventory.filter((p) => !p.retired)) {
    const add = (id: string, priority: number, evidence: string, action: string, listing?: string, routine?: boolean, evidenceAt = at) => report.findings.push(makeFinding({ id, priority, evidence, action, listing, routine, productId: product.id, name: product.name, pages: product.pages, at: evidenceAt }));
    product.reviewedAt = state.reviews[product.id];
    if (!product.pages.length) add(`unplaced-${product.id}`, 4, 'No editorial placement found in the built site.', 'Decide whether to feature this product on a relevant article or converter, or retire it through a reviewed PR.');
    if (!product.reviewedAt || Date.parse(at) - Date.parse(product.reviewedAt) > 90 * DAY) add(`review-${product.id}`, 5, 'Human editorial review is not recorded or is over 90 days old.', 'Review fit, claims, alternatives, and placements; check this task to record the review.', undefined, true);
    for (const key of product.listings) {
      const listing = report.listings.find((l) => l.key === key)!;
      const observations = state.observations.filter((o) => o.listing === key).sort((a, b) => b.at.localeCompare(a.at));
      const last = observations.find((o) => o.identityVerified && o.title);
      if (listing.merchant === 'chewy' && !listing.itemId) add(`mapping-${product.id}-${listing.id.replace(/\W/g, '-')}`, 3, 'No unique Impact item ID maps from existing cache to the canonical Chewy destination.', 'Resolve the catalog-item mapping manually; do not substitute the Chewy /dp/ number.', key);
      const identity = observations.find((o) => o.identityVerified || o.verdict === 'identity-mismatch');
      const stock = observations.find((o) => ['available', 'unavailable'].includes(o.verdict));
      const endpoint = observations.find((o) => o.identityVerified || o.verdict === 'missing-item');
      const problem = identity?.verdict === 'identity-mismatch' ? identity : stock?.verdict === 'unavailable' ? stock : endpoint?.verdict === 'missing-item' ? endpoint : undefined;
      if (problem) {
        const lastPositive = observations.find((o) => o.verdict === 'available' && o.at <= problem.at);
        const repeated = problem.verdict === 'unavailable' && observations.some((o) => o.verdict === 'unavailable' && o.at <= problem.at && (!lastPositive || o.at > lastPositive.at) && Date.parse(problem.at) - Date.parse(o.at) >= 7 * DAY);
        add(`listing-${product.id}-${key.replace(/\W/g, '-')}`, repeated || problem.verdict === 'identity-mismatch' ? 2 : 3,
          `${problem.source === 'cache' ? 'Cached evidence' : 'Provider evidence'}: ${problem.verdict}; ${problem.detail}${problem.stock ? ` Stock: ${problem.stock}.` : ''}${repeated ? ' Negative observations at least seven days apart.' : ''}`,
          'Open the canonical listing and confirm identity and availability. Review an alternative or retirement only after human verification.', key, undefined, problem.at);
      }
      if (!last) continue;
      if (last.newerModel) add(`newer-${product.id}-${key.replace(/\W/g, '-')}`, 3, `Provider explicitly suggests newer-model ASIN ${last.newerModel}.`, 'Compare the suggested model with the current recommendation before changing the product.', key, undefined, last.at);
      const prior = state.observations.filter((o) => o.listing === key && o.at < last.at && o.title).sort((a, b) => b.at.localeCompare(a.at))[0];
      if (prior?.title && last.title && prior.title !== last.title) add(`changed-${product.id}-${key.replace(/\W/g, '-')}`, 3, `Provider title changed from “${prior.title}” to “${last.title}”.`, 'Check whether the listing now represents a different product or model. Keep editorial copy unchanged until reviewed.', key, undefined, last.at);
    }
  }
  if (report.unusedCaches.length) report.findings.push(makeFinding({ id: 'unused-caches', productId: 'cache-cleanup', name: 'Unused provider caches', priority: 4, evidence: `${report.unusedCaches.length} unused cache files: ${report.unusedCaches.join(', ')}`, action: 'Review the full inventory and remove unused raw cache files and manifest entries in a normal PR.', at, pages: [] }));
  for (const [integration, status] of Object.entries(report.coverage)) {
    if (status.status === 'not configured' || status.status === 'integration failure') report.findings.push(makeFinding({ id: `setup-${integration}`, productId: `integration-${integration}`, name: `${integration} integration`, priority: status.status === 'integration failure' ? 1 : 3, evidence: status.detail, action: status.status === 'not configured' ? 'Configure the documented Actions secret and repository variables, then dispatch the bounded smoke check.' : 'Repair the integration using sanitized logs and fixture tests; do not mark products unavailable.', at, pages: [] }));
  }
}
