/**
 * Assembles curation data into validated content packs + manifest.
 *
 *   pnpm content:build
 *
 * Two gates run on every build:
 *  1. zod validation against content/schema.ts (shared with the app).
 *  2. The tone engine re-derives every drill word's tone from its analysis;
 *     any disagreement with the authored tone FAILS the build. A wrong tone
 *     must never reach a flashcard silently (ADR-006).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ContentManifest, ContentPack } from '../app/src/content/schema';
import { toneOfSyllable } from '../app/src/tone/engine';
import { DRILLS_T0 } from './curation/drills-t0';
import { PHONEMES_T0 } from './curation/phonemes-t0';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app', 'public', 'content');

// Gate 2: engine cross-check.
const disagreements: string[] = [];
for (const set of DRILLS_T0) {
  for (const word of set.words) {
    const derived = toneOfSyllable(
      {
        initial: word.analysis.initial,
        mark: word.analysis.mark,
        final: word.analysis.final,
        vowelLength: word.analysis.vowelLength,
      },
      word.thai,
    );
    if (derived !== word.tone) {
      disagreements.push(
        `${set.id} · ${word.thai}: authored=${word.tone} engine=${String(derived)}`,
      );
    }
  }
}
if (disagreements.length > 0) {
  console.error('TONE ENGINE DISAGREES WITH CURATION:\n' + disagreements.join('\n'));
  console.error('\nEach line is an engine bug, a data bug, or a new exception — resolve before shipping.');
  process.exit(1);
}

// Gate 1: schema validation (throws with a precise path on failure).
const t0 = ContentPack.parse({
  id: 't0-sounds',
  title: 'T0 · The sound system',
  version: 1,
  phonemes: PHONEMES_T0,
  drillSets: DRILLS_T0,
});

await mkdir(OUT, { recursive: true });
const t0Json = JSON.stringify(t0);
await writeFile(join(OUT, 't0-sounds.json'), t0Json);

const manifest = ContentManifest.parse({
  generatedAt: new Date().toISOString(),
  packs: [
    {
      id: t0.id,
      title: t0.title,
      version: t0.version,
      path: 't0-sounds.json',
      bytes: Buffer.byteLength(t0Json),
    },
  ],
});
await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log(
  `built ${manifest.packs.length} pack(s): ${t0.phonemes.length} phonemes, ` +
    `${t0.drillSets.length} drill sets, ${t0.drillSets.reduce((n, s) => n + s.words.length, 0)} words — all engine-verified.`,
);
