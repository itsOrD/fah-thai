<script lang="ts">
  import { loadPack } from '../../content/loaders';
  import type { ContentPackT, PhonemeT } from '../../content/schema';
  import { TONE_SPECS } from '../../tone/contours';
  import type { Tone } from '../../tone/types';
  import MouthViews from './MouthViews.svelte';
  import ToneCurve from '../../ui/ToneCurve.svelte';

  let pack = $state<ContentPackT | null>(null);
  let error = $state<string | null>(null);
  let selectedId = $state<string | null>(null);

  $effect(() => {
    loadPack('t0-sounds')
      .then((p) => (pack = p))
      .catch((e: unknown) => (error = e instanceof Error ? e.message : String(e)));
  });

  const GROUPS: { title: string; note: string; ids: string[] }[] = [
    {
      title: 'The three-way families',
      note: 'No puff · puff · voiced — the contrast English collapses.',
      ids: ['bp', 'ph', 'b', 'dt', 'th', 'd', 'g', 'kh'],
    },
    { title: 'Nasals & liquids', note: 'The ง that starts words, and the ร/ล pair.', ids: ['ng', 'r', 'l'] },
    { title: 'Vowels English lacks', note: 'Unround your lips and hold the length.', ids: ['ue', 'ue-long', 'oe-long'] },
  ];

  const TONES: Tone[] = ['mid', 'low', 'falling', 'high', 'rising'];

  const byId = $derived(new Map((pack?.phonemes ?? []).map((p) => [p.id, p])));
  const selected = $derived(selectedId ? (byId.get(selectedId) ?? null) : null);

  function exampleWords(p: PhonemeT): { thai: string; paiboon: string; gloss: string }[] {
    if (!pack) return [];
    const letters = new Set(p.thaiLetters);
    const seen = new Set<string>();
    const out: { thai: string; paiboon: string; gloss: string }[] = [];
    for (const set of pack.drillSets) {
      for (const w of set.words) {
        if (!seen.has(w.thai) && [...w.analysis.initial].some((ch) => letters.has(ch))) {
          seen.add(w.thai);
          out.push({ thai: w.thai, paiboon: w.paiboon, gloss: w.gloss });
        }
      }
    }
    return out.slice(0, 4);
  }
</script>

<section>
  <h1>Sound Lab</h1>
  <p class="lede">
    Every sound, from the inside. Watch the cutaway, copy the mouth, then say
    it — audio lands with the recording pilot.
  </p>

  {#if error}
    <p class="error">Couldn't load the sound pack: {error}</p>
  {:else if !pack}
    <p class="lede">loading…</p>
  {:else}
    {#each GROUPS as group (group.title)}
      <h2>{group.title}</h2>
      <p class="group-note">{group.note}</p>
      <div class="grid">
        {#each group.ids as id (id)}
          {@const p = byId.get(id)}
          {#if p}
            <button
              class="cell"
              class:active={selectedId === id}
              onclick={() => (selectedId = selectedId === id ? null : id)}
            >
              <span class="thai" lang="th">{p.thaiLetters[0]}</span>
              <span class="paiboon">{p.paiboon}</span>
            </button>
          {/if}
        {/each}
      </div>

      {#if selected && group.ids.includes(selected.id)}
        <article class="detail">
          <header>
            <span class="thai big" lang="th">{selected.thaiLetters.join(' ')}</span>
            <div>
              <p class="paiboon-big">{selected.paiboon} <span class="ipa">/{selected.ipa}/</span></p>
              <p class="howto">{selected.howTo}</p>
            </div>
          </header>
          <MouthViews phoneme={selected} />
          {#if selected.englishTrap}
            <p class="trap"><strong>The trap:</strong> {selected.englishTrap}</p>
          {/if}
          {#if exampleWords(selected).length > 0}
            <div class="examples">
              {#each exampleWords(selected) as w (w.thai)}
                <span class="example"
                  ><span class="thai" lang="th">{w.thai}</span> {w.paiboon} · {w.gloss}</span
                >
              {/each}
            </div>
          {/if}
        </article>
      {/if}
    {/each}

    <h2>The five tones</h2>
    <p class="group-note">
      Drawn from real Bangkok speech — notice the “high” tone actually rises.
    </p>
    <div class="tones">
      {#each TONES as tone (tone)}
        <div class="tone-card">
          <ToneCurve {tone} />
          <p class="tone-name">
            <span class="thai" lang="th">{TONE_SPECS[tone].thaiName}</span>
            <span class="tone-label">{tone} · {TONE_SPECS[tone].chao}</span>
          </p>
        </div>
      {/each}
    </div>
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    padding-bottom: var(--sp-6);
  }

  h1 {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--neon-cyan);
    text-shadow: var(--glow-text-cyan);
  }

  h2 {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    margin-top: var(--sp-4);
  }

  .lede,
  .group-note {
    color: var(--ink-dim);
    font-size: var(--text-sm);
  }

  .error {
    color: var(--neon-pink);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--sp-2);
  }

  .cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: var(--sp-3) 0;
    background: var(--bg-raised);
    border: 1px solid var(--edge);
    border-radius: var(--radius-md);
    transition:
      border-color var(--dur-fast) var(--ease-out),
      box-shadow var(--dur-fast) var(--ease-out);
  }

  .cell .thai {
    font-size: var(--text-xl);
    line-height: 1.1;
  }

  .cell .paiboon {
    font-size: var(--text-xs);
    color: var(--ink-faint);
  }

  .cell.active {
    border-color: var(--neon-pink);
    box-shadow: var(--glow-pink);
  }

  .detail {
    background: var(--bg-raised);
    border: 1px solid var(--edge-strong);
    border-radius: var(--radius-lg);
    padding: var(--sp-4);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .detail header {
    display: flex;
    gap: var(--sp-4);
    align-items: center;
  }

  .thai.big {
    font-size: var(--text-thai-hero);
    color: var(--neon-pink);
    text-shadow: var(--glow-text-pink);
    line-height: 1;
  }

  .paiboon-big {
    font-size: var(--text-lg);
    font-weight: 600;
  }

  .ipa {
    color: var(--ink-faint);
    font-weight: 400;
  }

  .howto {
    color: var(--ink-dim);
    font-size: var(--text-sm);
  }

  .trap {
    font-size: var(--text-sm);
    color: var(--saffron-soft);
    border-left: 3px solid var(--saffron);
    padding-left: var(--sp-3);
  }

  .examples {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-2);
  }

  .example {
    font-size: var(--text-sm);
    color: var(--ink-dim);
    background: var(--bg-overlay);
    border-radius: var(--radius-pill);
    padding: var(--sp-1) var(--sp-3);
  }

  .example .thai {
    color: var(--ink);
  }

  .tones {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--sp-3);
  }

  .tone-card {
    background: var(--bg-raised);
    border: 1px solid var(--edge);
    border-radius: var(--radius-md);
    padding: var(--sp-3);
  }

  .tone-name {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-sm);
    margin-top: var(--sp-2);
  }

  .tone-label {
    color: var(--ink-faint);
    text-transform: capitalize;
  }
</style>
