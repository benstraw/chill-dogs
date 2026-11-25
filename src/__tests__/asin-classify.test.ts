import { describe, expect, it } from 'vitest';

import { classify } from '../../scripts/asin-classify';

const DP = 'https://www.amazon.com/dp/B0TEST0001';
const live = (body = '') => `<html><span id="productTitle">Cooling Mat</span>${body}</html>`;

describe('check:asins classify', () => {
  it('reports a live product page as OK', () => {
    expect(classify(200, live(), DP).status).toBe('OK');
  });

  it('keeps a live page OK even when its text says a size "isn\'t available"', () => {
    expect(classify(200, live('<p>This size isn\'t available right now.</p>'), DP).status).toBe('OK');
  });

  it('reports a buy box with no offer as UNAVAILABLE', () => {
    expect(classify(200, live('<div>Currently unavailable.</div>'), DP).status).toBe('UNAVAILABLE');
  });

  it('reports Amazon\'s error pages as REMOVED', () => {
    expect(classify(200, '<html>Sorry! We couldn\'t find that page. Meet the dogs of Amazon.</html>', DP)).toEqual({
      status: 'REMOVED',
      detail: 'error page',
    });
    expect(classify(404, '', DP).status).toBe('REMOVED');
    expect(classify(200, live(), 'https://www.amazon.com/s?k=mat').status).toBe('REMOVED');
  });

  it('never calls a bot wall a result', () => {
    expect(classify(200, '<html>Type the characters you see. Robot Check</html>', DP).status).toBe('UNKNOWN');
    expect(classify(503, '', DP).status).toBe('RATE LIMITED');
    expect(classify(429, '', DP).status).toBe('RATE LIMITED');
    expect(classify(500, '', DP).status).toBe('ERROR 500');
  });
});
