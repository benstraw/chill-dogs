/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

/**
 * Pinterest pin for a `/shop/<id>/` product page — 1000×1500.
 *
 * The Save button used to hand Pinterest the raw Amazon product photo, so a pin was a
 * bare square catalogue shot with no title, no branding, and the wrong aspect ratio.
 * Pinterest crops anything squarer than 2:3 and buries it; a pin has to work as a
 * thumbnail in a scrolling feed.
 *
 * Portrait, not the 1200×630 OG card: those are different surfaces with different
 * crops. This shares the OG pipeline's fonts, themes, and image cache, but lays out
 * vertically and sizes type for a phone-sized thumbnail.
 *
 * The hand-illustrated pins in `public/images/pinterest/` are the brand reference —
 * cream ground, navy headline, blue accent, wordmark-and-tagline footer. Those are
 * bespoke infographics and stay hand-made; this is the generated per-product companion,
 * simpler by necessity because there is one product and no editorial illustration.
 */

import type { JSXNode } from 'satori/jsx';
import type { OgTheme } from './themes';

export interface ProductPinTemplateData {
  /** Product name — the headline. */
  name: string;
  /** Readable category, e.g. "Cooling Mats". Becomes the eyebrow. */
  category: string;
  /** Up to three short selling points. */
  bullets: readonly string[];
  /** Product photo as a data URI, or null to render the empty frame. */
  productImageDataUri: string | null;
  logoDataUri: string | null;
  theme: OgTheme;
}

const INK = '#152a3a';
const MUTED = '#5a6470';
const CREAM = '#f7f3ec';

export const PIN_WIDTH = 1000;
export const PIN_HEIGHT = 1500;

/** Headline sizing: long product names must not overflow the fixed band. */
function headlineSize(name: string): number {
  if (name.length <= 22) return 84;
  if (name.length <= 34) return 70;
  if (name.length <= 48) return 58;
  return 48;
}

function PawMark({ color, size }: { color: string; size: number }): JSXNode {
  // Four toes and a pad. The brand's paw motif, drawn with divs because satori
  // supports no SVG path rendering.
  const toe = Math.round(size * 0.26);
  const pad = Math.round(size * 0.46);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: size,
        height: size,
      }}
    >
      <div style={{ display: 'flex', width: size, justifyContent: 'space-between' }}>
        {[0, 1, 2].map((index) => (
          <div
            style={{
              width: toe,
              height: toe,
              borderRadius: toe,
              background: color,
              marginTop: index === 1 ? 0 : Math.round(size * 0.06),
            }}
          />
        ))}
      </div>
      <div
        style={{
          width: pad,
          height: Math.round(pad * 0.8),
          borderRadius: pad,
          background: color,
          marginTop: Math.round(size * 0.06),
        }}
      />
    </div>
  );
}

export function ProductPinTemplate(data: ProductPinTemplateData): JSXNode {
  const { name, category, bullets, productImageDataUri, logoDataUri, theme } = data;
  const points = bullets.slice(0, 3);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: PIN_WIDTH,
        height: PIN_HEIGHT,
        background: CREAM,
        fontFamily: 'Inter',
      }}
    >
      {/* Accent rule across the top — the pin reads as ours before any text is read. */}
      <div style={{ display: 'flex', width: PIN_WIDTH, height: 14, background: theme.accent }} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          padding: '56px 64px 0 64px',
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              padding: '10px 22px',
              borderRadius: 999,
              background: theme.accentBg,
              border: `2px solid ${theme.accentBorder}`,
              color: theme.accent,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            {category}
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: headlineSize(name),
            fontWeight: 800,
            color: INK,
            lineHeight: 1.08,
            letterSpacing: -1,
          }}
        >
          {name}
        </div>

        {/* Product photo — the reason a product pin exists. White card so cut-out
            catalogue shots on transparent or white backgrounds still read as framed.
            It grows to absorb slack: a product with two short bullets gets a bigger
            photo rather than a band of dead cream above the footer. */}
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            width: 872,
            flexGrow: 1,
            minHeight: 560,
            borderRadius: 28,
            background: '#ffffff',
            border: `3px solid ${theme.accentBorder}`,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {productImageDataUri ? (
            <img
              src={productImageDataUri}
              width={800}
              height={560}
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <div style={{ display: 'flex', color: MUTED, fontSize: 28 }}>Product photo</div>
          )}
        </div>

        {/* Selling points, sitting just above the footer band. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 36,
            marginBottom: 44,
          }}
        >
          {points.map((point, index) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: 14,
                  height: 14,
                  borderRadius: 14,
                  background: theme.accent,
                  marginTop: 12,
                  marginRight: 18,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  fontSize: 30,
                  color: MUTED,
                  lineHeight: 1.35,
                  width: 800,
                }}
              >
                {point}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer band — wordmark and tagline, matching the hand-made pins. */}
      <div
        style={{
          display: 'flex',
          width: PIN_WIDTH,
          height: 168,
          background: theme.accent,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 64px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {logoDataUri ? (
            <img src={logoDataUri} width={72} height={72} style={{ marginRight: 22 }} />
          ) : (
            <div style={{ display: 'flex', marginRight: 22 }}>
              <PawMark color="#ffffff" size={64} />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 44,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: -0.5,
              }}
            >
              Chill-Dogs
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 19,
                color: 'rgba(255,255,255,0.82)',
                letterSpacing: 3,
                marginTop: 4,
              }}
            >
              COOL · CALM · COMFORTABLE
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            padding: '16px 30px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.16)',
            border: '2px solid rgba(255,255,255,0.4)',
            color: '#ffffff',
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          See the details
        </div>
      </div>
    </div>
  );
}
