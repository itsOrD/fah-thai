/**
 * Google Cloud TTS batch generator (ADR-006/007).
 *
 *   pnpm tts -- --dry-run          # print the batch plan, no API, no key
 *   pnpm tts -- --pilot            # first N minimal-pair items only
 *   pnpm tts                       # full batch
 *
 * Requires GOOGLE_TTS_API_KEY in .env for real runs (docs/todo-tts-key.md is
 * the one-paste setup). Filenames are sha1(voice|text|rate).mp3 — re-runs
 * skip existing files, so generation is idempotent and git history stays
 * write-once.
 *
 * Voices: Fah's voice (th-TH-Neural2-C) renders everything at normal +
 * 0.78-rate slow; the perception roster renders drill words at normal rate
 * for HVPT multi-talker variability (plan §4).
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DRILLS_T0 } from './curation/drills-t0';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app', 'public', 'audio');

export const FAH_VOICE = 'th-TH-Neural2-C';
/** Perception roster — distinct voices for HVPT drills (A/B'd in the pilot). */
export const PERCEPTION_ROSTER = [
  'th-TH-Neural2-C',
  'th-TH-Standard-A',
  'th-TH-Chirp3-HD-Kore',
  'th-TH-Chirp3-HD-Leda',
  'th-TH-Chirp3-HD-Puck',
  'th-TH-Chirp3-HD-Charon',
] as const;

export interface TtsJob {
  text: string;
  voice: string;
  rate: number;
  hash: string;
}

export function jobHash(voice: string, text: string, rate: number): string {
  return createHash('sha1').update(`${voice}|${text}|${rate}`).digest('hex');
}

/** Builds the full job list from curation (deduped by hash). */
export function planJobs({ pilot = false }: { pilot?: boolean } = {}): TtsJob[] {
  const sets = pilot ? DRILLS_T0 : DRILLS_T0; // later tranches append here
  const jobs = new Map<string, TtsJob>();
  const add = (text: string, voice: string, rate: number) => {
    const hash = jobHash(voice, text, rate);
    jobs.set(hash, { text, voice, rate, hash });
  };
  for (const set of sets) {
    for (const word of set.words) {
      add(word.thai, FAH_VOICE, 1.0); // model audio
      add(word.thai, FAH_VOICE, 0.78); // learner-speed
      for (const voice of PERCEPTION_ROSTER) add(word.thai, voice, 1.0); // HVPT
    }
  }
  return [...jobs.values()];
}

async function synthesize(job: TtsJob, apiKey: string): Promise<Buffer> {
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        input: { text: job.text },
        voice: { languageCode: 'th-TH', name: job.voice },
        audioConfig: { audioEncoding: 'MP3', speakingRate: job.rate, sampleRateHertz: 24000 },
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`TTS ${res.status} for ${job.voice} "${job.text}": ${await res.text()}`);
  }
  const body = (await res.json()) as { audioContent: string };
  return Buffer.from(body.audioContent, 'base64');
}

async function main(): Promise<void> {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has('--dry-run');
  const pilot = args.has('--pilot');

  const jobs = planJobs({ pilot });
  const chars = jobs.reduce((n, j) => n + j.text.length, 0);
  console.log(`${jobs.length} jobs, ~${chars} chars (free tier: 1M/month).`);

  if (dryRun) {
    for (const j of jobs.slice(0, 12)) console.log(`  ${j.hash.slice(0, 8)} ${j.voice} @${j.rate} ${j.text}`);
    if (jobs.length > 12) console.log(`  … ${jobs.length - 12} more`);
    return;
  }

  let apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey && existsSync(join(ROOT, '.env'))) {
    const env = await readFile(join(ROOT, '.env'), 'utf8');
    apiKey = /^GOOGLE_TTS_API_KEY=(.+)$/m.exec(env)?.[1]?.trim();
  }
  if (!apiKey) {
    console.error('GOOGLE_TTS_API_KEY missing — see docs/todo-tts-key.md (one paste, ~3 minutes).');
    process.exit(2);
  }

  await mkdir(OUT, { recursive: true });
  let done = 0;
  let skipped = 0;
  const queue = [...jobs];
  const workers = Array.from({ length: 8 }, async () => {
    for (;;) {
      const job = queue.shift();
      if (!job) return;
      const file = join(OUT, `${job.hash}.mp3`);
      if (existsSync(file)) {
        skipped += 1;
        continue;
      }
      const audio = await synthesize(job, apiKey);
      await writeFile(file, audio);
      done += 1;
      if (done % 25 === 0) console.log(`  ${done}/${jobs.length}…`);
    }
  });
  await Promise.all(workers);
  console.log(`done: ${done} generated, ${skipped} already existed (idempotent).`);
}

const invokedDirectly = process.argv[1]?.endsWith('tts-batch.ts');
if (invokedDirectly) await main();
