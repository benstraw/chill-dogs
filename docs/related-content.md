# Related Content

This document explains the Wave 1 related-content system. The helper and metadata are available, but public rendering still uses existing manual `InternalLinkStrip` and `RelatedGuides` arrays until later migration waves.

## Source Of Truth

Related pages are derived from the complete build-time sitemap inventory:

- Static sitemap registrations live in `src/data/content-sitemap.ts`.
- Article collectors are discovered by `src/data/sitemap-inventory.ts` from MDX frontmatter.
- The related helper lives in `src/utils/related-pages.ts`.

Every related target must be a real sitemap page. Do not add one-off links in page bodies when the relationship should be reusable across pages.

## Metadata Fields

Add these fields to `createSitemapPage()` calls or article frontmatter when a page needs relationship intent:

```yaml
topics:
  - cooling
  - car-cooling
pinnedRelated:
  - /cooling/car-cooling-for-dogs/
excludeRelated:
  - /cooling/freezable-dog-toys/
```

- `topics` are ranking signals, not mandatory filters. Use them when a section is too broad to produce good matches.
- `pinnedRelated` is for intentional editorial relationships that should outrank algorithmic matches.
- `excludeRelated` prevents poor, redundant, or conflicting recommendations.
- If a href appears in both `pinnedRelated` and `excludeRelated`, exclusion wins.

## Ranking

`getRelatedPages()` filters out self, excluded hrefs, `noindex`, `attractor`, and `informer` pages. It then ranks eligible pages by:

1. pinned order
2. topic overlap
3. same sitemap section
4. page type: `converter` > `collector · article` > `collector · section`
5. deterministic tie-breaker

Use only official page types: `converter`, `collector`, `attractor`, and `informer`. For articles, keep `pageType: 'collector'` with `collectorSubtype: 'article'`; do not create fake page types.

## Authoring Checklist

When adding a page:

- Register it in the sitemap inventory through the correct static section or article frontmatter.
- Declare the correct `pageType` and `collectorSubtype`.
- Add `topics` if the page belongs to a broad section like Comfort, Travel, or Tracking.
- Add `pinnedRelated` only for editorially important relationships.
- Add `excludeRelated` when an automatic match would be unhelpful.
- Keep manual rendered related arrays in place until the relevant migration wave replaces them.
