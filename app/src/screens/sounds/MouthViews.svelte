<script lang="ts">
  import type { PhonemeT } from '../../content/schema';
  import { englishTrapArticulation } from '../../sounds/compare';
  import { programFor, stateAt } from '../../sounds/rig';
  import FrontMouth from '../../sounds/FrontMouth.svelte';
  import Sagittal from '../../sounds/Sagittal.svelte';

  /** Owns the animation clock; both views render the same interpolated state. */
  let { phoneme }: { phoneme: PhonemeT } = $props();

  const LOOP_MS = 2600;
  let t = $state(0.55); // start at the post-release frame — informative when paused
  let playing = $state(true);
  let showTrap = $state(false);
  let raf = 0;
  let clock = $state(0);

  const reduced =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const program = $derived(programFor(phoneme.articulation));
  const trapArticulation = $derived(englishTrapArticulation(phoneme));
  const trapProgram = $derived(trapArticulation ? programFor(trapArticulation) : null);
  const current = $derived(stateAt(program, t));
  const trapState = $derived(showTrap && trapProgram ? stateAt(trapProgram, t) : null);

  $effect(() => {
    if (!playing || reduced) return;
    let start: number | null = null;
    const tick = (now: number) => {
      start ??= now - t * LOOP_MS;
      const elapsed = (now - start) % LOOP_MS;
      t = elapsed / LOOP_MS;
      clock = now / 1000;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });
</script>

<div class="views">
  <figure>
    <Sagittal state={current} compare={trapState} time={clock} />
    <figcaption>side cutaway</figcaption>
  </figure>
  <figure>
    <FrontMouth state={current} />
    <figcaption>front</figcaption>
  </figure>
</div>

<div class="controls">
  <button class="ctl" onclick={() => (playing = !playing)}>
    {playing && !reduced ? '⏸' : '▶'}
  </button>
  <input
    type="range"
    min="0"
    max="1"
    step="0.005"
    value={t}
    oninput={(e) => {
      playing = false;
      t = Number(e.currentTarget.value);
    }}
    aria-label="Scrub the mouth animation"
  />
  {#if trapProgram}
    <button class="ctl trap-toggle" class:on={showTrap} onclick={() => (showTrap = !showTrap)}>
      EN ghost
    </button>
  {/if}
</div>

<style>
  .views {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-3);
  }

  figure {
    margin: 0;
    background: #07070c;
    border: 1px solid var(--edge);
    border-radius: var(--radius-md);
    padding: var(--sp-2);
  }

  figcaption {
    text-align: center;
    font-size: var(--text-xs);
    color: var(--ink-faint);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
  }

  .ctl {
    padding: var(--sp-1) var(--sp-3);
    background: var(--bg-overlay);
    border: 1px solid var(--edge-strong);
    border-radius: var(--radius-pill);
    color: var(--ink);
    font-size: var(--text-sm);
  }

  .trap-toggle.on {
    border-color: var(--saffron);
    color: var(--saffron-soft);
    box-shadow: var(--glow-saffron);
  }

  input[type='range'] {
    flex: 1;
    accent-color: var(--neon-pink);
  }
</style>
