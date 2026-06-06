/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

import type { JSXNode } from 'satori/jsx';
import type { SitemapHeroProduct } from '../../data/content-sitemap';
import type { OgTheme } from './themes';
import { splitOgTitle } from './text';

export interface ProductOgTemplateData {
  title: string;
  summary: string;
  heroProduct: SitemapHeroProduct;
  heroImageDataUri: string | null;
  logoDataUri: string | null;
  theme: OgTheme;
  year: number;
}

const ink = '#1e2326';
const muted = '#5a6470';

function DotGrid({ color }: { color: string }): JSXNode {
  const dots = [];
  for (let y = 11; y < 630; y += 22) {
    for (let x = 11; x < 1200; x += 22) {
	      dots.push(<div style={{
	        display: 'flex',
	        position: 'absolute',
	        left: x,
        top: y,
        width: 2,
        height: 2,
        borderRadius: 999,
        background: color,
      }} />);
    }
  }

  return <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>{dots}</div>;
}

function Title({ title, accent }: { title: string; accent: string }): JSXNode {
  const parts = splitOgTitle(title);

  return (
	    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
	      <div style={{
	        display: 'flex',
	        fontFamily: 'Inter',
        fontSize: 46,
        fontWeight: 800,
        color: ink,
        lineHeight: 1.08,
        letterSpacing: -1,
      }}>
        {parts.before}
      </div>
      {parts.after && (
	        <div style={{
	          display: 'flex',
	          fontFamily: 'Inter',
          fontSize: 46,
          fontWeight: 800,
          color: accent,
          lineHeight: 1.08,
          letterSpacing: -1,
        }}>
          {parts.after}
        </div>
      )}
    </div>
  );
}

export function ProductOgTemplate(data: ProductOgTemplateData): JSXNode {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: data.theme.bg,
      }}
    >
      <DotGrid color={data.theme.dotColor} />

      <div
        style={{
          position: 'relative',
          width: 615,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          padding: '50px 58px 42px',
          background: data.theme.bg,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26 }}>
	          <div
	            style={{
	              display: 'flex',
	              fontFamily: 'Inter',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 2.5,
              textTransform: 'uppercase',
              color: data.theme.accent,
              background: data.theme.accentBg,
              border: `1px solid ${data.theme.accentBorder}`,
              padding: '5px 12px',
              borderRadius: 4,
            }}
          >
            {data.theme.label}
          </div>
	          <div style={{ display: 'flex', flex: 1, height: 1, background: data.theme.ruleColor }} />
	          <div
	            style={{
	              display: 'flex',
	              fontFamily: 'Inter',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 1,
              color: '#9da7b0',
              textTransform: 'uppercase',
            }}
          >
            {data.year}
          </div>
        </div>

        <Title title={data.title} accent={data.theme.accent} />

	        <div
	          style={{
	            display: 'flex',
	            fontFamily: 'Inter',
            fontSize: 15.5,
            fontWeight: 400,
            color: muted,
            lineHeight: 1.65,
            flex: 1,
            marginBottom: 28,
          }}
        >
          {data.summary}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 18,
            borderTop: `1px solid ${data.theme.ruleColor}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            {data.logoDataUri && (
              <img src={data.logoDataUri} width={24} height={24} style={{ objectFit: 'contain' }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
	              <div style={{ display: 'flex', fontFamily: 'Inter', fontSize: 15, fontWeight: 800, color: ink }}>
	                Chill-Dogs
	              </div>
	              <div
	                style={{
	                  display: 'flex',
	                  fontFamily: 'Inter',
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: 2.5,
                  textTransform: 'uppercase',
                  color: '#9da7b0',
                }}
              >
                Cool · Calm · Comfortable
              </div>
            </div>
          </div>
	          <div
	            style={{
	              display: 'flex',
	              fontFamily: 'Inter',
              fontSize: 12,
              fontWeight: 600,
              color: data.theme.accent,
              letterSpacing: 0.5,
              opacity: 0.85,
            }}
          >
            Read the guide -&gt;
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          flex: 1,
          height: 630,
          background: data.theme.rightBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
	        <div style={{
	          display: 'flex',
	          position: 'absolute',
          width: 520,
          height: 520,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.42)',
          top: 55,
          left: 70,
        }} />
        {[580, 460, 340].map((size, index) => (
	          <div style={{
	            display: 'flex',
	            position: 'absolute',
            width: size,
            height: size,
            borderRadius: 999,
            border: '1px solid rgba(0,0,0,0.05)',
            top: 315 - size / 2 - index * 4,
            left: 300 - size / 2 + index * 10,
          }} />
	        ))}
	        <div style={{
	          display: 'flex',
	          position: 'absolute',
	          left: -20,
	          top: 0,
          bottom: 0,
          width: 40,
          background: 'linear-gradient(to right, rgba(0,0,0,0.055), transparent)',
        }} />

	        {data.heroImageDataUri ? (
	          <div style={{
	            display: 'flex',
	            position: 'relative',
	            width: 390,
	            height: 390,
	            alignItems: 'center',
            justifyContent: 'center',
            transform: 'rotate(2deg) translateY(6px)',
            filter: 'drop-shadow(0 14px 32px rgba(0,0,0,0.14))',
          }}>
            <img
              src={data.heroImageDataUri}
              width={370}
              height={370}
              style={{ objectFit: 'contain' }}
            />
          </div>
        ) : (
          <div style={{
            position: 'relative',
            width: 350,
            height: 350,
            borderRadius: 24,
            background: data.theme.accentBg,
            border: `1px solid ${data.theme.accentBorder}`,
          }} />
        )}

        <div
          style={{
            position: 'absolute',
            bottom: 48,
            right: 30,
            background: 'rgba(255,255,255,0.84)',
            border: '1px solid rgba(0,0,0,0.07)',
            borderRadius: 6,
            padding: '8px 14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
	          <div
	            style={{
	              display: 'flex',
	              fontFamily: 'Inter',
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: data.theme.accent,
              marginBottom: 3,
            }}
          >
            {data.heroProduct.badge}
          </div>
	          <div style={{ display: 'flex', fontFamily: 'Inter', fontSize: 12.5, fontWeight: 800, color: ink }}>
	            {data.heroProduct.name}
	          </div>
        </div>
      </div>
    </div>
  );
}
