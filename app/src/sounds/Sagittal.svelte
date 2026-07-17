<script lang="ts">
  import { tonguePath, type MouthState } from './rig';

  /**
   * Side cutaway, face in profile looking left. All motion comes from the
   * parent-computed MouthState; this component only draws.
   */
  let {
    state,
    compare = null,
    time = 0,
  }: {
    state: MouthState & { tonguePoints: number[][] };
    compare?: (MouthState & { tonguePoints: number[][] }) | null;
    time?: number;
  } = $props();

  // Jaw-driven offsets: lower lip/teeth/jaw drop with aperture.
  const jawDrop = $derived(state.aperture * 13);
  const protrude = $derived(state.rounding * 6);
  // Velum tip lerps between closed (rests on pharynx wall) and open (dropped).
  const velumTip = $derived({
    x: 152 - state.velumOpen * 5,
    y: 80 + state.velumOpen * 13,
  });
  // ร trill: fast tip jitter.
  const trillOffset = $derived(state.trill ? Math.sin(time * 55) * 4 : 0);
  const tongueD = $derived(
    tonguePath(
      state.tonguePoints.map(([x, y], i) => (i === 0 ? [x!, y! + trillOffset] : [x!, y!])),
    ),
  );
  const compareD = $derived(compare ? tonguePath(compare.tonguePoints) : null);
</script>

<svg viewBox="0 0 220 220" role="img" aria-label="Side view of mouth position">
  <!-- head profile cutaway -->
  <path
    class="anatomy"
    d="M 88 14 C 42 22 24 52 30 76 L 24 84 L 32 88 L 28 94"
  />
  <!-- upper lip → chin → jaw → neck -->
  <path
    class="anatomy"
    d="M {28 - protrude} {96 + 0}
       L {34 - protrude} 98 L 40 96"
  />
  <path
    class="anatomy"
    d="M {28 - protrude} {112 + jawDrop}
       L {34 - protrude} {111 + jawDrop} L 40 {112 + jawDrop}
       C 34 {130 + jawDrop} 38 {146 + jawDrop} 52 {158 + jawDrop}
       C 76 176 120 184 150 196"
  />
  <!-- hard palate -->
  <path class="anatomy" d="M 46 88 C 70 70 108 66 136 74" />
  <!-- velum (soft palate): drops for nasals -->
  <path class="velum" d="M 136 74 Q 145 {74 + state.velumOpen * 6} {velumTip.x} {velumTip.y}" />
  <!-- nasal passage: lights up when the velum opens -->
  <path
    class="nasal"
    style:opacity={state.velumOpen * 0.9}
    d="M 128 62 C 92 52 56 60 34 78"
  />
  <!-- pharynx wall down to the glottis -->
  <path class="anatomy" d="M 158 84 C 166 110 168 150 164 182" />
  <!-- teeth -->
  <rect class="teeth" x="41" y="87" width="5" height="9" rx="1.5" />
  <rect class="teeth" x="41" y={104 + jawDrop} width="5" height="9" rx="1.5" />

  <!-- English-trap ghost (what your mouth is wrongly doing) -->
  {#if compareD}
    <path class="ghost" d={compareD} />
    {#if compare?.puff}
      <g class="puff ghost-puff" transform="translate(0 {2})">
        <path d="M 22 100 q -8 -2 -14 -6" />
        <path d="M 22 106 q -10 0 -16 0" />
      </g>
    {/if}
  {/if}

  <!-- the tongue -->
  <path class="tongue" d={tongueD} />

  <!-- glottis: buzzes when voiced -->
  <g class="glottis" class:buzzing={state.voiced} transform="translate(158 186)">
    <path d="M -6 0 q 3 -3 6 0 q 3 3 6 0" />
  </g>

  <!-- aspiration puff -->
  {#if state.puff}
    <g class="puff">
      <path d="M 20 98 q -9 -3 -15 -8" />
      <path d="M 20 104 q -11 0 -18 -1" />
      <path d="M 20 110 q -9 3 -15 7" />
    </g>
  {/if}
</svg>

<style>
  svg {
    width: 100%;
    height: auto;
    display: block;
  }

  path,
  rect {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .anatomy {
    stroke: var(--neon-cyan);
    stroke-width: 2;
    opacity: 0.7;
  }

  .velum {
    stroke: var(--neon-cyan);
    stroke-width: 3.5;
  }

  .nasal {
    stroke: var(--saffron);
    stroke-width: 2;
    stroke-dasharray: 3 6;
    filter: drop-shadow(0 0 4px var(--saffron));
  }

  .teeth {
    stroke: var(--ink-dim);
    stroke-width: 1.5;
  }

  .tongue {
    fill: color-mix(in srgb, var(--neon-pink) 30%, transparent);
    stroke: var(--neon-pink);
    stroke-width: 2.5;
    filter: drop-shadow(0 0 8px rgba(255, 46, 136, 0.45));
  }

  .ghost {
    fill: none;
    stroke: var(--saffron);
    stroke-width: 2;
    stroke-dasharray: 5 5;
    opacity: 0.8;
  }

  .glottis path {
    stroke: var(--ink-faint);
    stroke-width: 2;
  }

  .glottis.buzzing path {
    stroke: var(--neon-pink);
    filter: drop-shadow(0 0 6px var(--neon-pink));
    animation: buzz 90ms infinite alternate;
  }

  .puff path {
    stroke: var(--saffron-soft);
    stroke-width: 2;
    filter: drop-shadow(0 0 6px var(--saffron));
    animation: fly 700ms infinite;
  }

  .ghost-puff path {
    stroke: var(--saffron);
    opacity: 0.6;
  }

  @keyframes buzz {
    from { transform: translateY(-0.6px); }
    to { transform: translateY(0.6px); }
  }

  @keyframes fly {
    0% { opacity: 0; transform: translateX(4px); }
    25% { opacity: 1; }
    100% { opacity: 0; transform: translateX(-7px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .glottis.buzzing path,
    .puff path {
      animation: none;
    }
  }
</style>
