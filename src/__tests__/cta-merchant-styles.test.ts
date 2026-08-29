/**
 * Merchant branding must survive the CTA cascade.
 *
 * `AffiliateOfferStack` renders offer 0 as `primary` and every later offer as
 * `secondary`. That means the same merchant is styled two different ways depending
 * only on how many offers a product has. A Chewy offer paired with Amazon arrives
 * as `.ui-cta[data-tone='neutral'][data-variant='secondary']` — specificity (0,3,0)
 * — which beat the old `.ui-cta[data-merchant='chewy']` at (0,2,0) and stripped the
 * brand fill. Chewy-only products kept it, so the bug only showed on paired offers.
 *
 * This asserts the cascade directly rather than the one instance: every selector
 * that sets `background` for a merchant must outrank every selector that sets
 * `background` off a tone/variant combination.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const cssPath = path.join(process.cwd(), 'src/styles/cta.css');

interface Rule {
  selector: string;
  body: string;
}

/** Strips comments, then pulls out every `selector { body }` pair. */
function parseRules(css: string): Rule[] {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: Rule[] = [];

  for (const match of withoutComments.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const body = match[2].trim();
    // A comma-separated selector list applies the body at each selector's own
    // specificity, so split it and score each one independently.
    for (const selector of match[1].split(',')) {
      const trimmed = selector.trim();
      if (trimmed) rules.push({ selector: trimmed, body });
    }
  }

  return rules;
}

/**
 * CSS specificity as [id, class/attribute/pseudo-class, element], compared
 * left to right. Enough for this file, which uses no ids and no `:where()`.
 */
function specificity(selector: string): [number, number, number] {
  const bare = selector.replace(/::?[a-z-]+(\([^)]*\))?/gi, ' ');
  const ids = (bare.match(/#[\w-]+/g) ?? []).length;
  const attributes = (bare.match(/\[[^\]]+\]/g) ?? []).length;
  const classes = (bare.match(/\.[\w-]+/g) ?? []).length;
  const pseudoClasses = (selector.match(/(?<!:):[a-z-]+/gi) ?? []).length;
  const elements = (bare.replace(/[.#[][^\s]*/g, ' ').match(/\b[a-z][\w-]*/gi) ?? []).length;

  return [ids, attributes + classes + pseudoClasses, elements];
}

function outranks(a: [number, number, number], b: [number, number, number]): boolean {
  for (let i = 0; i < 3; i += 1) {
    if (a[i] !== b[i]) return a[i] > b[i];
  }
  return false;
}

const rules = parseRules(readFileSync(cssPath, 'utf8'));
const setsBackground = (rule: Rule) => /(^|;)\s*background\s*:/.test(rule.body);

describe('CTA merchant branding beats tone and variant', () => {
  const merchantRules = rules.filter((r) => r.selector.includes('data-merchant') && setsBackground(r));
  const themeRules = rules.filter(
    (r) =>
      !r.selector.includes('data-merchant') &&
      /data-(tone|variant)/.test(r.selector) &&
      setsBackground(r)
  );

  it('finds merchant and theme background rules to compare', () => {
    expect(merchantRules.length).toBeGreaterThan(0);
    expect(themeRules.length).toBeGreaterThan(0);
  });

  it('has at least one merchant selector outranking every theme selector', () => {
    // Each merchant/state pair declares a low-specificity selector plus a higher
    // one; the high one is what must win. Group by pseudo-class state so a
    // `:hover` rule is only ever compared against other `:hover` rules.
    const stateOf = (selector: string) => (selector.match(/:[a-z-]+$/i) ?? [''])[0];
    const failures: string[] = [];

    for (const state of new Set(themeRules.map((r) => stateOf(r.selector)))) {
      const themesInState = themeRules.filter((r) => stateOf(r.selector) === state);
      const strongestTheme = themesInState
        .map((r) => ({ rule: r, spec: specificity(r.selector) }))
        .sort((a, b) => (outranks(a.spec, b.spec) ? -1 : 1))[0];

      for (const merchant of new Set(
        merchantRules
          .filter((r) => stateOf(r.selector) === state)
          .map((r) => r.selector.match(/data-merchant='([^']+)'/)?.[1] ?? '')
      )) {
        const best = merchantRules
          .filter((r) => stateOf(r.selector) === state && r.selector.includes(`'${merchant}'`))
          .map((r) => ({ rule: r, spec: specificity(r.selector) }))
          .sort((a, b) => (outranks(a.spec, b.spec) ? -1 : 1))[0];

        if (!best || !outranks(best.spec, strongestTheme.spec)) {
          failures.push(
            `${merchant}${state}: strongest merchant selector "${best?.rule.selector}" ` +
              `(${best?.spec.join(',')}) does not outrank "${strongestTheme.rule.selector}" ` +
              `(${strongestTheme.spec.join(',')})`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it('overrides the border shorthand, not just border-color', () => {
    // The secondary rule sets `border: 1px solid …`. A merchant rule that only sets
    // `border-color` leaves the secondary rule's width and style in place.
    const shorthandUsers = rules.filter(
      (r) => /data-(tone|variant)/.test(r.selector) && /(^|;)\s*border\s*:/.test(r.body)
    );

    if (shorthandUsers.length > 0) {
      for (const rule of merchantRules) {
        expect(rule.body, `${rule.selector} must set the border shorthand`).toMatch(
          /(^|;)\s*border\s*:/
        );
      }
    }
  });
});

describe('specificity helper', () => {
  it('scores the selectors this file actually relies on', () => {
    expect(specificity(".ui-cta[data-merchant='chewy']")).toEqual([0, 2, 0]);
    expect(specificity(".ui-cta[data-tone='neutral'][data-variant='secondary']")).toEqual([0, 3, 0]);
    expect(specificity(".ui-cta[data-tone][data-variant][data-merchant='chewy']")).toEqual([0, 4, 0]);
  });
});
