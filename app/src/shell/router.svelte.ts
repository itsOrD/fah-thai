/**
 * The reactive half of the ~60-line hand-rolled router (ADR-002).
 * State follows location.hash; navigation writes location.hash so back/forward
 * and shared links behave, even inside an installed PWA.
 */
import { hashFor, parseHash, type RouteId } from './routes';

export const router = $state({
  route: parseHash(typeof location !== 'undefined' ? location.hash : ''),
});

export function navigate(to: RouteId): void {
  if (to === router.route) return;
  location.hash = hashFor(to);
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    router.route = parseHash(location.hash);
  });
}
