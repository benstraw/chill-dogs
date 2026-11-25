/**
 * Variant picker behavior (ProductVariantPicker.astro). Selecting a size, pack count
 * or colorway repoints the card's affiliate CTAs to that variant's listing. Exported
 * with an injectable `track` so the dist tests can run it against a built page.
 */

import { track as defaultTrack } from './analytics';

type Track = (event: string, props: Record<string, unknown>) => void;

interface VariantMerchantOffer {
  url: string;
  merchantProductId?: string;
  asin?: string;
}

interface VariantEntry {
  label: string;
  note?: string;
  image?: { src: string; alt: string };
  merchants: Record<string, VariantMerchantOffer>;
}

export function select(picker: HTMLElement, optionId: string, fromClick: boolean, track: Track = defaultTrack): void {
  const table: Record<string, VariantEntry> = JSON.parse(picker.dataset.variantOffers || '{}');
  const entry = table[optionId];
  if (!entry) return;

  picker.dataset.variantSelected = optionId;

  const chips = [...picker.querySelectorAll<HTMLAnchorElement>('[data-variant-option]')];
  for (const chip of chips) {
    const active = chip.dataset.variantOption === optionId;
    chip.classList.toggle('variant-chip--selected', active);
    chip.setAttribute('aria-checked', String(active));
    chip.tabIndex = active ? 0 : -1;
  }

  const note = picker.querySelector<HTMLElement>('[data-variant-note]');
  if (note) note.textContent = entry.note ?? '';

  // The offer stack wraps the picker and the CTAs it repoints.
  const scope = picker.closest<HTMLElement>('[data-variant-scope]');
  if (!scope) return;

  // Colorways swap the card image, which lives outside the offer stack.
  const image = picker.closest('.product-card')?.querySelector<HTMLImageElement>('img');
  if (image && entry.image) {
    image.src = entry.image.src;
    image.srcset = '';
    image.alt = entry.image.alt;
  }

  const ctas = [...scope.querySelectorAll<HTMLAnchorElement>('a[data-affiliate="true"]')];
  for (const cta of ctas) {
    const offer = entry.merchants[cta.dataset.merchant ?? ''];

    if (!offer) {
      cta.hidden = true;
      continue;
    }

    cta.hidden = false;
    cta.href = offer.url;
    cta.dataset.variantAxis = picker.dataset.variantAxis ?? '';
    cta.dataset.variantOption = optionId;

    if (offer.asin) cta.dataset.asin = offer.asin;
    else delete cta.dataset.asin;

    if (offer.merchantProductId) cta.dataset.merchantProductId = offer.merchantProductId;
    else delete cta.dataset.merchantProductId;
  }

  // Keep the filled/outlined pairing correct when a merchant drops out.
  const visible = ctas.filter((cta) => !cta.hidden);
  visible.forEach((cta, i) => {
    cta.dataset.variant = i === 0 ? 'primary' : 'secondary';
  });

  if (fromClick) {
    track('product_variant_select', {
      product_id: picker.dataset.productId,
      variant_axis: picker.dataset.variantAxis,
      variant_option: optionId,
      page_slug: picker.dataset.pageSlug,
      position: picker.dataset.position,
    });
  }
}

function upgrade(picker: HTMLElement, track: Track): void {
  const options = picker.querySelector<HTMLElement>('[data-variant-options]');
  const chips = [...picker.querySelectorAll<HTMLAnchorElement>('[data-variant-option]')];
  if (!options || chips.length === 0) return;

  // Only claim radio semantics once the script is running — without it the
  // chips are plain links and should read as plain links.
  options.setAttribute('role', 'radiogroup');
  for (const chip of chips) {
    chip.setAttribute('role', 'radio');
    chip.removeAttribute('target');
  }

  select(picker, picker.dataset.variantSelected ?? chips[0].dataset.variantOption!, false, track);
}

function move(picker: HTMLElement, step: number, track: Track): void {
  const chips = [...picker.querySelectorAll<HTMLAnchorElement>('[data-variant-option]')];
  const current = chips.findIndex((chip) => chip.dataset.variantOption === picker.dataset.variantSelected);
  const next = chips[(current + step + chips.length) % chips.length];
  if (!next) return;

  select(picker, next.dataset.variantOption!, true, track);
  next.focus();
}

/** Upgrade every picker under `root` and listen for chip clicks and arrow keys. */
export function initVariantPickers(root: Document, track: Track = defaultTrack): void {
  root.querySelectorAll<HTMLElement>('[data-variant-picker]').forEach((picker) => upgrade(picker, track));

  root.addEventListener('click', (event) => {
    const chip = (event.target as HTMLElement).closest<HTMLAnchorElement>('[data-variant-option]');
    const picker = chip?.closest<HTMLElement>('[data-variant-picker]');
    if (!chip || !picker) return;

    event.preventDefault();
    select(picker, chip.dataset.variantOption!, true, track);
  });

  root.addEventListener('keydown', (event) => {
    const chip = (event.target as HTMLElement).closest<HTMLAnchorElement>('[data-variant-option]');
    const picker = chip?.closest<HTMLElement>('[data-variant-picker]');
    if (!chip || !picker) return;

    const { key } = event as KeyboardEvent;
    if (key === 'ArrowRight' || key === 'ArrowDown') {
      event.preventDefault();
      move(picker, 1, track);
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      event.preventDefault();
      move(picker, -1, track);
    }
  });
}
