<script lang="ts">
  /**
   * Temporary stub frame used by every screen until its feature branch lands.
   * Gives each route a real, styled presence from day one so navigation,
   * transitions, and the installed-PWA feel can be judged immediately.
   */
  let {
    title,
    thai,
    note,
    accent = 'pink',
    link,
  }: {
    title: string;
    thai: string;
    note: string;
    accent?: 'pink' | 'cyan' | 'saffron';
    link?: { href: string; label: string };
  } = $props();
</script>

<section class={accent}>
  <header>
    <h1 class="thai" lang="th">{thai}</h1>
    <h2>{title}</h2>
  </header>
  <p class="note">{note}</p>
  {#if link}
    <a class="stub-link" href={link.href}>{link.label}</a>
  {/if}
  <p class="soon">under construction · Fah is supervising</p>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--sp-4);
    min-height: 60dvh;
    text-align: center;
    padding: var(--sp-6) var(--sp-5);
  }

  h1 {
    font-size: var(--text-thai-hero);
    font-weight: 600;
    line-height: 1.1;
  }

  section.pink h1 {
    color: var(--neon-pink);
    text-shadow: var(--glow-text-pink);
  }
  section.cyan h1 {
    color: var(--neon-cyan);
    text-shadow: var(--glow-text-cyan);
  }
  section.saffron h1 {
    color: var(--saffron);
    text-shadow: var(--glow-saffron);
  }

  h2 {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .note {
    color: var(--ink-dim);
    max-width: 34ch;
  }

  .soon {
    color: var(--ink-faint);
    font-size: var(--text-xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .stub-link {
    color: var(--neon-cyan);
    text-shadow: var(--glow-text-cyan);
    text-decoration: none;
    font-weight: 500;
    padding: var(--sp-2) var(--sp-4);
    border: 1px solid var(--edge-strong);
    border-radius: var(--radius-pill);
  }
</style>
