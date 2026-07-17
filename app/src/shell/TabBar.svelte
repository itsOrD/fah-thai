<script lang="ts">
  import { router, navigate } from './router.svelte';
  import { tabOf, type RouteId, type TabId } from './routes';

  const tabs: { id: TabId; label: string; thai: string; target: RouteId }[] = [
    { id: 'today', label: 'Today', thai: 'วันนี้', target: 'today' },
    { id: 'practice', label: 'Practice', thai: 'ฝึก', target: 'practice' },
    { id: 'progress', label: 'Progress', thai: 'ความคืบหน้า', target: 'progress' },
    { id: 'fah', label: 'Fah', thai: 'ฟ้า', target: 'fah' },
  ];

  const active = $derived(tabOf(router.route));
</script>

<nav aria-label="Main">
  {#each tabs as tab (tab.id)}
    <button
      class:active={active === tab.id}
      aria-current={active === tab.id ? 'page' : undefined}
      onclick={() => navigate(tab.target)}
    >
      <span class="thai" lang="th">{tab.thai}</span>
      <span class="label">{tab.label}</span>
    </button>
  {/each}
</nav>

<style>
  nav {
    position: fixed;
    inset: auto 0 0 0;
    display: flex;
    height: calc(var(--tabbar-height) + var(--safe-bottom));
    padding-bottom: var(--safe-bottom);
    background: color-mix(in srgb, var(--bg-raised) 88%, transparent);
    -webkit-backdrop-filter: blur(14px);
    backdrop-filter: blur(14px);
    border-top: 1px solid var(--edge);
  }

  button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    color: var(--ink-faint);
    transition: color var(--dur-fast) var(--ease-out);
  }

  .thai {
    font-size: var(--text-md);
    line-height: 1.1;
  }

  .label {
    font-size: var(--text-xs);
    letter-spacing: 0.04em;
  }

  button.active {
    color: var(--neon-pink);
    text-shadow: var(--glow-text-pink);
  }
</style>
