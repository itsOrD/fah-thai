<script lang="ts">
  import type { MouthState } from './rig';

  /** Front view: lips, teeth, tongue tip — rounding/aperture/spread. */
  let { state }: { state: MouthState } = $props();

  const w = $derived(84 - state.rounding * 38); // spread ↔ rounded
  const h = $derived(6 + state.aperture * 46);
  const cx = 110;
  const cy = 112;
  const showTeeth = $derived(state.aperture > 0.12);
  const tipVisible = $derived(state.tongue === 'alveolarClosure' && state.aperture > 0.1);
</script>

<svg viewBox="0 0 220 220" role="img" aria-label="Front view of lips and teeth">
  <!-- face hints -->
  <path class="hint" d="M 60 30 Q 110 14 160 30" />
  <path class="hint" d="M 104 62 Q 110 74 104 84 Q 110 90 118 86" />

  <!-- mouth opening -->
  <ellipse class="mouth-inner" {cx} {cy} rx={w} ry={h} />

  {#if showTeeth}
    <g class="teeth">
      {#each [-3, -2, -1, 0, 1, 2] as i (i)}
        <rect x={cx - 9 + i * 13 - 4} y={cy - h + 3} width="9" height={Math.min(11, h * 0.5)} rx="2" />
      {/each}
    </g>
  {/if}

  {#if tipVisible}
    <path
      class="tongue-tip"
      d="M {cx - 16} {cy - h + 15} Q {cx} {cy - h + 4} {cx + 16} {cy - h + 15} Q {cx} {cy - h + 22} {cx - 16} {cy - h + 15} Z"
    />
  {/if}

  <!-- lips -->
  <ellipse
    class="lips"
    class:rounded={state.rounding > 0.5}
    {cx}
    {cy}
    rx={w + 7}
    ry={h + 7}
  />

  {#if state.puff}
    <g class="puff">
      <path d="M {cx - w - 24} {cy} h -12" />
      <path d="M {cx + w + 24} {cy} h 12" />
      <path d="M {cx} {cy + h + 22} v 10" />
    </g>
  {/if}
</svg>

<style>
  svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .hint {
    fill: none;
    stroke: var(--neon-cyan);
    stroke-width: 2;
    stroke-linecap: round;
    opacity: 0.35;
  }

  .mouth-inner {
    fill: #07070c;
    stroke: none;
  }

  .lips {
    fill: none;
    stroke: var(--neon-pink);
    stroke-width: 3;
    filter: drop-shadow(0 0 8px rgba(255, 46, 136, 0.4));
    transition: rx 120ms, ry 120ms;
  }

  .lips.rounded {
    stroke-width: 5;
  }

  .teeth rect {
    fill: none;
    stroke: var(--ink-dim);
    stroke-width: 1.5;
  }

  .tongue-tip {
    fill: color-mix(in srgb, var(--neon-pink) 35%, transparent);
    stroke: var(--neon-pink);
    stroke-width: 2;
  }

  .puff path {
    fill: none;
    stroke: var(--saffron-soft);
    stroke-width: 2;
    stroke-linecap: round;
    filter: drop-shadow(0 0 6px var(--saffron));
    animation: breathe 700ms infinite;
  }

  @keyframes breathe {
    0% { opacity: 0; }
    30% { opacity: 1; }
    100% { opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .puff path {
      animation: none;
    }
  }
</style>
