<script lang="ts">
  import { TONE_SPECS } from '../tone/contours';
  import type { Tone } from '../tone/types';

  /** Glowing contour glyph for one of the five tones (modern Bangkok shapes). */
  let { tone, showDot = true }: { tone: Tone; showDot?: boolean } = $props();

  const spec = $derived(TONE_SPECS[tone]);

  const W = 120;
  const H = 80;
  const PAD = 10;

  function toXY(t: number, y: number): [number, number] {
    return [PAD + t * (W - PAD * 2), H - PAD - y * (H - PAD * 2)];
  }

  const path = $derived.by(() => {
    const pts = spec.points.map((p) => toXY(p.t, p.y));
    let d = `M ${pts[0]![0]} ${pts[0]![1]}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]!;
      const cur = pts[i]!;
      const cx = (prev[0] + cur[0]) / 2;
      d += ` C ${cx} ${prev[1]} ${cx} ${cur[1]} ${cur[0]} ${cur[1]}`;
    }
    return d;
  });
</script>

<svg viewBox="0 0 {W} {H}" style:--tone-color="var(--tone-{tone})" role="img" aria-label="{tone} tone contour">
  <line class="baseline" x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} />
  <path class="glow" d={path} />
  <path class="curve" d={path} />
  {#if showDot}
    <circle class="dot" r="3.5" style:offset-path="path('{path}')" />
  {/if}
</svg>

<style>
  svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .baseline {
    stroke: var(--edge-strong);
    stroke-width: 1;
  }

  .glow,
  .curve {
    fill: none;
    stroke: var(--tone-color);
    stroke-linecap: round;
  }

  .glow {
    stroke-width: 7;
    opacity: 0.28;
    filter: blur(4px);
  }

  .curve {
    stroke-width: 3;
  }

  .dot {
    fill: var(--ink);
    filter: drop-shadow(0 0 5px var(--tone-color));
    animation: trace 2200ms cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes trace {
    0% { offset-distance: 0%; opacity: 0; }
    12% { opacity: 1; }
    82% { opacity: 1; }
    100% { offset-distance: 100%; opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dot {
      animation: none;
      offset-distance: 100%;
    }
  }
</style>
