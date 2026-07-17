import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Emits dist/version.json stamped with the commit SHA. The CI pipeline polls
 * this file (cache-busted) after each environment deploy to know propagation
 * finished before running smoke tests — GitHub Pages deploys are queued and
 * slow, so "the deploy step succeeded" never means "the site is live".
 */
function versionStamp(): Plugin {
  return {
    name: 'fah:version-stamp',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({
          sha: process.env.GITHUB_SHA ?? 'local',
          builtAt: new Date().toISOString(),
        }),
      });
    },
  };
}

export default defineConfig({
  // The Vite root is app/; pipeline/ and docs/ live beside it, outside the build.
  root: 'app',
  // Relative base is load-bearing: one artifact must serve /fah-thai/,
  // /fah-thai/staging/ and /fah-thai/test/ (build-once-promote, ADR-002).
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [
    svelte(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: '.',
      filename: 'sw.ts',
      injectRegister: false,
      manifest: {
        name: 'Fah — Thai by Night',
        short_name: 'Fah',
        description:
          'Pronunciation-first Thai: tones, mouth mechanics, spaced repetition, and real conversation practice.',
        // Relative start_url/scope resolve against the manifest URL, so the
        // same manifest works at any deploy subpath.
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0B0B12',
        theme_color: '#0B0B12',
        icons: [
          { src: 'icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Audio packs are runtime-cached (CacheFirst) with explicit prefetch,
        // never precached — the shell must stay small.
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
    }),
    versionStamp(),
  ],
  test: {
    // Vite's root is app/, but tests live across the whole repo.
    root: fileURLToPath(new URL('.', import.meta.url)),
    environment: 'node',
    include: ['app/src/**/*.test.ts', 'pipeline/**/*.test.ts'],
  },
});
