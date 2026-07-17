/**
 * Route table + pure hash parsing. Kept free of browser APIs so it unit-tests
 * without a DOM; the reactive half lives in router.svelte.ts.
 */

export const ROUTES = [
  'today',
  'practice',
  'sounds',
  'review',
  'ear',
  'script',
  'tone',
  'voice',
  'journey',
  'progress',
  'settings',
  'lab',
  'fah',
] as const;

export type RouteId = (typeof ROUTES)[number];

/** Which bottom tab owns each route (for active-tab highlighting). */
export const TABS = ['today', 'practice', 'progress', 'fah'] as const;
export type TabId = (typeof TABS)[number];

const TAB_OF: Record<RouteId, TabId> = {
  today: 'today',
  practice: 'practice',
  sounds: 'practice',
  review: 'practice',
  ear: 'practice',
  script: 'practice',
  tone: 'practice',
  voice: 'practice',
  progress: 'progress',
  settings: 'progress',
  lab: 'progress',
  fah: 'fah',
  journey: 'fah',
};

export function tabOf(route: RouteId): TabId {
  return TAB_OF[route];
}

/**
 * `#/` → today; `#/sounds` → sounds; unknown/garbage → today.
 * Trailing slashes and case are forgiven — this is a phone URL bar.
 */
export function parseHash(hash: string): RouteId {
  const cleaned = hash
    .replace(/^#\/?/, '')
    .replace(/\/+$/, '')
    .toLowerCase();
  if (cleaned === '') return 'today';
  return (ROUTES as readonly string[]).includes(cleaned)
    ? (cleaned as RouteId)
    : 'today';
}

export function hashFor(route: RouteId): string {
  return route === 'today' ? '#/' : `#/${route}`;
}
