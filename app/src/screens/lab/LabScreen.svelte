<script lang="ts">
  import { CHATGPT_LINKS, PROBES, buildReport, type ProbeResult } from './probes';

  let results = $state(new Map<string, ProbeResult>());
  let running = $state<string | null>(null);
  let copied = $state(false);

  async function runProbe(id: string): Promise<void> {
    const probe = PROBES.find((p) => p.id === id);
    if (!probe || running) return;
    running = id;
    try {
      const result = await probe.run();
      results = new Map(results).set(id, result);
    } finally {
      running = null;
    }
  }

  /**
   * Runs only non-interactive probes. iOS grants ONE transient user
   * activation per tap — chaining permission-consuming probes behind a
   * single tap made later ones fail silently (measured, phase 1). The
   * interactive probes require their own taps by design.
   */
  async function runAll(): Promise<void> {
    for (const probe of PROBES.filter((p) => !p.interactive)) {
      await runProbe(probe.id);
    }
  }

  function copyReport(): void {
    // Synchronous in the tap handler — iOS clipboard rule.
    void navigator.clipboard.writeText(buildReport(results)).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 2000);
    });
  }

  function badge(r: ProbeResult | undefined, id: string): string {
    if (running === id) return '…';
    if (!r) return '·';
    if (r.ok === null) return 'ℹ︎';
    return r.ok ? '✓' : '✗';
  }
</script>

<section>
  <header>
    <h1>Device Lab</h1>
    <p>
      Hardware probes for the APIs this app bets on. <strong>Run all</strong>
      covers the automatic ones; probes marked <em>tap</em> each need their own
      tap (iOS allows one permission-prompt per gesture). Then
      <strong>Copy report</strong> and paste it back into the build session.
      Run once in Safari and once from the installed icon.
    </p>
  </header>

  <div class="actions">
    <button class="primary" onclick={runAll} disabled={running !== null}>Run all (auto)</button>
    <button class="primary" class:copied onclick={copyReport}>
      {copied ? 'Copied ✓' : 'Copy report'}
    </button>
  </div>

  {#each PROBES as probe (probe.id)}
    {@const r = results.get(probe.id)}
    <article class:pass={r?.ok === true} class:fail={r?.ok === false}>
      <button class="row" onclick={() => runProbe(probe.id)} disabled={running !== null}>
        <span class="badge">{badge(r, probe.id)}</span>
        <span class="title">{probe.title}</span>
        {#if probe.interactive}<span class="tag">tap</span>{/if}
      </button>
      {#if r}
        <pre>{r.lines.join('\n')}</pre>
      {/if}
    </article>
  {/each}

  <h2>ChatGPT deep links</h2>
  <p class="hint">
    Universal links need a real tap. Observe what happens and dictate it back —
    these three results decide the voice-handoff design (ADR-004).
  </p>
  {#each CHATGPT_LINKS as link (link.label)}
    <article class="link">
      <a href={link.href} target="_blank" rel="noopener">{link.label} ↗</a>
      <p class="expect">{link.expect}</p>
    </article>
  {/each}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    padding-bottom: var(--sp-6);
  }

  header p,
  .hint {
    color: var(--ink-dim);
    font-size: var(--text-sm);
    margin-top: var(--sp-2);
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
    margin-top: var(--sp-5);
  }

  .actions {
    display: flex;
    gap: var(--sp-3);
  }

  .primary {
    flex: 1;
    padding: var(--sp-3);
    border-radius: var(--radius-md);
    background: var(--bg-overlay);
    border: 1px solid var(--edge-strong);
    color: var(--ink);
    transition: box-shadow var(--dur-fast) var(--ease-out);
  }

  .primary:active {
    box-shadow: var(--glow-cyan);
  }

  .primary.copied {
    border-color: var(--neon-cyan);
    box-shadow: var(--glow-cyan);
  }

  article {
    background: var(--bg-raised);
    border: 1px solid var(--edge);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  article.pass {
    border-color: color-mix(in srgb, var(--neon-cyan) 45%, transparent);
  }

  article.fail {
    border-color: color-mix(in srgb, var(--neon-pink) 55%, transparent);
  }

  .row {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    width: 100%;
    padding: var(--sp-3) var(--sp-4);
    text-align: left;
  }

  .badge {
    width: 1.4em;
    color: var(--neon-cyan);
  }

  article.fail .badge {
    color: var(--neon-pink);
  }

  .title {
    flex: 1;
  }

  .tag {
    font-size: var(--text-xs);
    color: var(--ink-faint);
    border: 1px solid var(--edge);
    border-radius: var(--radius-pill);
    padding: 1px 8px;
  }

  pre {
    margin: 0;
    padding: var(--sp-3) var(--sp-4);
    border-top: 1px solid var(--edge);
    font-size: var(--text-xs);
    line-height: 1.6;
    color: var(--ink-dim);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .link {
    padding: var(--sp-3) var(--sp-4);
  }

  .link a {
    color: var(--neon-pink);
    text-decoration: none;
    font-weight: 500;
  }

  .expect {
    color: var(--ink-faint);
    font-size: var(--text-xs);
    margin-top: var(--sp-1);
  }
</style>
