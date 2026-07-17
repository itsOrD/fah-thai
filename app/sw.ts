/// <reference lib="webworker" />
/**
 * Service worker (injectManifest strategy).
 *
 * Cache names are derived from the registration scope at runtime — this is
 * what lets the same built artifact run at /fah-thai/, /fah-thai/staging/ and
 * /fah-thai/test/ on one origin without the three installs clobbering each
 * other's caches (ADR-002). Never hard-code a cache name here.
 */
import { clientsClaim, setCacheNameDetails } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

const scopePath = new URL(self.registration.scope).pathname;
const envKey = scopePath.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'root';

setCacheNameDetails({ prefix: `fah-${envKey}` });

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

self.skipWaiting();
clientsClaim();
