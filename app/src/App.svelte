<script lang="ts">
  import type { Component } from 'svelte';
  import { fade } from 'svelte/transition';
  import TabBar from './shell/TabBar.svelte';
  import { router } from './shell/router.svelte';
  import type { RouteId } from './shell/routes';
  import ScreenScaffold from './ui/ScreenScaffold.svelte';
  import LabScreen from './screens/lab/LabScreen.svelte';

  /** Real screens; routes not present here fall back to the stub table. */
  const SCREENS: Partial<Record<RouteId, Component>> = {
    lab: LabScreen,
  };

  /**
   * Stub metadata per route. Each feature branch replaces its entry with a
   * real screen component; when this table is empty, the scaffold era is over.
   */
  const STUBS: Record<
    RouteId,
    { title: string; thai: string; note: string; accent?: 'pink' | 'cyan' | 'saffron' }
  > = {
    today: {
      title: 'Today',
      thai: 'วันนี้',
      note: 'Your adaptive daily plan lands here: reviews first, then stretch blocks.',
    },
    practice: {
      title: 'Practice',
      thai: 'ฝึก',
      note: 'The hub for Sound Lab, Review, Ear Gym, Script, Tone Studio, and Voice.',
      accent: 'cyan',
    },
    sounds: {
      title: 'Sound Lab',
      thai: 'เสียง',
      note: 'Every Thai sound with animated mouth views — tongue, teeth, throat.',
      accent: 'cyan',
    },
    review: {
      title: 'Review',
      thai: 'ทบทวน',
      note: 'Spaced-repetition sessions across vocab, listening, speaking, and script.',
      accent: 'cyan',
    },
    ear: {
      title: 'Ear Gym',
      thai: 'หูทอง',
      note: 'Minimal-pair battles that teach your ear the five tones.',
      accent: 'cyan',
    },
    script: {
      title: 'Script',
      thai: 'อักษร',
      note: 'The Thai alphabet, class by class, with finger tracing.',
      accent: 'cyan',
    },
    tone: {
      title: 'Tone Studio',
      thai: 'วรรณยุกต์',
      note: 'Record a word and see your pitch curve on the native contour.',
      accent: 'cyan',
    },
    voice: {
      title: 'Voice Lesson',
      thai: 'คุยกัน',
      note: 'One tap compiles your weak spots into a live speaking lesson.',
      accent: 'cyan',
    },
    journey: {
      title: 'The Journey',
      thai: 'การเดินทาง',
      note: 'Unlocks near the end. For May, and for her family.',
      accent: 'saffron',
    },
    progress: {
      title: 'Progress',
      thai: 'ความคืบหน้า',
      note: 'Tone accuracy, weak sounds, streaks, and your monthly time capsules.',
      accent: 'saffron',
    },
    settings: {
      title: 'Settings',
      thai: 'ตั้งค่า',
      note: 'Weekly goal, notifications, backups, and the art pack.',
      accent: 'saffron',
    },
    lab: {
      title: 'Device Lab',
      thai: 'ทดลอง',
      note: 'Hidden hardware probes: microphone, audio worklet, clipboard, push.',
      accent: 'saffron',
    },
    fah: {
      title: 'Fah',
      thai: 'ฟ้า',
      note: '“Took you long enough. Sit down — we have nine months and your tones are a disaster.”',
    },
  };

  const stub = $derived(STUBS[router.route]);
</script>

<main>
  {#key router.route}
    <div class="screen" in:fade={{ duration: 140 }}>
      {#if SCREENS[router.route]}
        {@const Screen = SCREENS[router.route]!}
        <Screen />
      {:else}
        <ScreenScaffold {...stub} />
      {/if}
    </div>
  {/key}
</main>
<TabBar />

<style>
  main {
    max-width: var(--content-max);
    margin: 0 auto;
    padding: calc(var(--safe-top) + var(--sp-4)) var(--sp-4)
      calc(var(--tabbar-height) + var(--safe-bottom) + var(--sp-6));
    min-height: 100dvh;
  }
</style>
