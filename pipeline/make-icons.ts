/**
 * Generates all PWA icons from one in-code SVG source of truth.
 *
 *   pnpm icons
 *
 * Design: the Thai HIGH tone contour — which actually *rises*, [45] in Chao
 * numbers, contrary to every textbook's flat line — drawn as a neon
 * pink→cyan curve under a moonlight star (Fah = sky). Pure paths, no text
 * glyphs, so rendering never depends on installed fonts.
 *
 * Establishes the repo's generated-asset pattern: artifacts are reproducible
 * from committed inputs, never hand-exported from a design tool.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app', 'public', 'icons');

/**
 * @param opts.pad     0..1 fraction of canvas padding around the motif
 *                     (maskable icons need the motif inside the 80% safe zone)
 * @param opts.rounded rounded-rect background (false for full-bleed bg where
 *                     the platform applies its own mask)
 */
function iconSvg({ pad = 0.08, rounded = true } = {}): string {
  const s = 512;
  const inset = s * pad;
  const w = s - inset * 2;
  const p = (x: number, y: number) => `${inset + x * w},${inset + y * w}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="neon" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#FF2E88"/>
      <stop offset="1" stop-color="#22D3EE"/>
    </linearGradient>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
  </defs>
  ${
    rounded
      ? `<rect width="${s}" height="${s}" rx="${s * 0.19}" fill="#0B0B12"/>`
      : `<rect width="${s}" height="${s}" fill="#0B0B12"/>`
  }
  <!-- high-tone contour [45]: starts mid, rises to the top -->
  <path d="M ${p(0.1, 0.62)} C ${p(0.32, 0.6)} ${p(0.5, 0.52)} ${p(0.66, 0.36)} S ${p(0.84, 0.14)} ${p(0.88, 0.08)}"
        fill="none" stroke="url(#neon)" stroke-width="${w * 0.075}"
        stroke-linecap="round" filter="url(#glow)" opacity="0.85"/>
  <path d="M ${p(0.1, 0.62)} C ${p(0.32, 0.6)} ${p(0.5, 0.52)} ${p(0.66, 0.36)} S ${p(0.84, 0.14)} ${p(0.88, 0.08)}"
        fill="none" stroke="url(#neon)" stroke-width="${w * 0.055}"
        stroke-linecap="round"/>
  <!-- Fah's star, high in the night sky -->
  <path d="M ${p(0.24, 0.18)} l ${w * 0.028} ${w * 0.068} l ${w * 0.068} ${w * 0.028} l ${-w * 0.068} ${w * 0.028} l ${-w * 0.028} ${w * 0.068} l ${-w * 0.028} ${-w * 0.068} l ${-w * 0.068} ${-w * 0.028} l ${w * 0.068} ${-w * 0.028} Z"
        fill="#F4F0FF" opacity="0.92"/>
  <circle cx="${inset + 0.24 * w}" cy="${inset + 0.214 * w}" r="${w * 0.075}" fill="#F4F0FF"
          opacity="0.28" filter="url(#glow)"/>
</svg>`;
}

async function render(svg: string, size: number, file: string): Promise<void> {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(OUT, file));
  console.log(`  icons/${file} (${size}x${size})`);
}

await mkdir(OUT, { recursive: true });

// Standard PWA icons: rounded-rect bg, modest padding.
await render(iconSvg(), 512, 'pwa-512.png');
await render(iconSvg(), 192, 'pwa-192.png');
// Maskable: full-bleed bg, motif pulled into the 80% safe zone.
await render(iconSvg({ pad: 0.16, rounded: false }), 512, 'pwa-maskable-512.png');
// Apple touch: full-bleed bg — iOS applies its own corner mask.
await render(iconSvg({ pad: 0.1, rounded: false }), 180, 'apple-touch-icon.png');

// Favicon ships as the SVG itself.
await writeFile(join(ROOT, 'app', 'public', 'favicon.svg'), iconSvg());
console.log('  favicon.svg');
console.log('done.');
