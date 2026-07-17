import { describe, expect, it } from 'vitest';
import { ROUTES, hashFor, parseHash, tabOf } from './routes';

describe('parseHash', () => {
  it('maps the empty/root hashes to today', () => {
    for (const hash of ['', '#', '#/', '#//']) {
      expect(parseHash(hash)).toBe('today');
    }
  });

  it('maps every declared route round-trip through its own hash', () => {
    for (const route of ROUTES) {
      expect(parseHash(hashFor(route))).toBe(route);
    }
  });

  it('forgives trailing slashes and case', () => {
    expect(parseHash('#/Sounds/')).toBe('sounds');
    expect(parseHash('#/TONE')).toBe('tone');
  });

  it('falls back to today on unknown routes', () => {
    expect(parseHash('#/definitely-not-a-route')).toBe('today');
    expect(parseHash('#/sounds/extra/segments')).toBe('today');
  });
});

describe('tabOf', () => {
  it('assigns every route to a tab', () => {
    for (const route of ROUTES) {
      expect(['today', 'practice', 'progress', 'fah']).toContain(tabOf(route));
    }
  });

  it('groups journey under the fah tab and settings under progress', () => {
    expect(tabOf('journey')).toBe('fah');
    expect(tabOf('settings')).toBe('progress');
  });
});
