/**
 * Device-capability probes for the hidden #/lab screen.
 *
 * Each probe runs a real exercise of an API the architecture depends on and
 * returns plain-text lines for the on-device report. Probes must never throw
 * — failures are results, not errors (that's the point of a lab).
 */

export interface ProbeResult {
  ok: boolean | null; // null = informational, no pass/fail judgement
  lines: string[];
}

export interface Probe {
  id: string;
  title: string;
  /** Needs a user gesture / permission prompt — annotated in the UI. */
  interactive?: boolean;
  run: () => Promise<ProbeResult>;
}

function fail(lines: string[], err: unknown): ProbeResult {
  return {
    ok: false,
    lines: [...lines, `error: ${err instanceof Error ? `${err.name}: ${err.message}` : String(err)}`],
  };
}

/** Raw-constraint mic request + settings readback (iOS may ignore requests). */
const micProbe: Probe = {
  id: 'mic',
  title: 'Microphone (raw constraints)',
  interactive: true,
  async run() {
    const lines: string[] = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      const track = stream.getAudioTracks()[0];
      if (!track) return fail(lines, new Error('no audio track'));
      lines.push(`track: ${track.label || '(unlabelled)'}`);
      const s = track.getSettings();
      lines.push(
        `settings: echoCancellation=${String(s.echoCancellation)} noiseSuppression=${String(s.noiseSuppression)} autoGainControl=${String(s.autoGainControl)}`,
      );
      lines.push(`sampleRate=${String(s.sampleRate ?? '?')} channelCount=${String(s.channelCount ?? '?')}`);
      // iOS honours echoCancellation (the constraint that protects F0) but
      // does not expose NS/AGC via getSettings — that's expected platform
      // behavior, not a failure (ADR-003). Grade informationally.
      const ecOff = s.echoCancellation === false;
      lines.push(
        ecOff
          ? 'echoCancellation OFF (the one that matters for pitch) ✓'
          : 'echoCancellation still ON — pitch accuracy at risk',
      );
      const unexposed = [
        s.noiseSuppression === undefined ? 'noiseSuppression' : null,
        s.autoGainControl === undefined ? 'autoGainControl' : null,
      ].filter(Boolean);
      if (unexposed.length > 0) {
        lines.push(`${unexposed.join('/')} unexposed by this platform (expected on iOS)`);
      }
      for (const t of stream.getTracks()) t.stop();
      return { ok: ecOff ? null : false, lines };
    } catch (err) {
      return fail(lines, err);
    }
  },
};

const WORKLET_SOURCE = `
class LabProbeProcessor extends AudioWorkletProcessor {
  constructor() { super(); this.frames = 0; this.energy = 0; }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch) {
      this.frames += 1;
      let sum = 0;
      for (let i = 0; i < ch.length; i++) sum += ch[i] * ch[i];
      this.energy += sum;
      if (this.frames % 50 === 0) {
        this.port.postMessage({ frames: this.frames, energy: this.energy });
      }
    }
    return true;
  }
}
registerProcessor('lab-probe', LabProbeProcessor);
`;

async function runWorkletChain(
  makeSource: (ctx: AudioContext) => AudioNode | Promise<AudioNode>,
  lines: string[],
): Promise<ProbeResult> {
  let ctx: AudioContext | undefined;
  try {
    ctx = new AudioContext();
    await ctx.resume();
    lines.push(`context: state=${ctx.state} sampleRate=${ctx.sampleRate}`);
    const url = URL.createObjectURL(new Blob([WORKLET_SOURCE], { type: 'application/javascript' }));
    try {
      await ctx.audioWorklet.addModule(url);
    } finally {
      URL.revokeObjectURL(url);
    }
    const node = new AudioWorkletNode(ctx, 'lab-probe');
    let last: { frames: number; energy: number } = { frames: 0, energy: 0 };
    node.port.onmessage = (e: MessageEvent<{ frames: number; energy: number }>) => {
      last = e.data;
    };
    const source = await makeSource(ctx);
    source.connect(node);
    // Deliberately unconnected to destination: capture-only graph, no audible output.
    await new Promise((resolve) => setTimeout(resolve, 900));
    lines.push(`worklet frames=${last.frames} (128-sample quanta), energy=${last.energy.toExponential(2)}`);
    const ok = last.frames > 0 && last.energy > 0;
    lines.push(ok ? 'worklet chain LIVE with signal' : 'worklet ran but no signal captured');
    return { ok, lines };
  } catch (err) {
    return fail(lines, err);
  } finally {
    void ctx?.close().catch(() => undefined);
  }
}

/** Worklet machinery with a synthetic source — no permissions involved. */
const workletProbe: Probe = {
  id: 'worklet',
  title: 'AudioWorklet (oscillator)',
  interactive: true,
  async run() {
    return runWorkletChain((ctx) => {
      const osc = new OscillatorNode(ctx, { frequency: 220 });
      osc.start();
      return osc;
    }, []);
  },
};

/** The Tone Studio pipeline shape: mic → worklet → frames + energy. */
const captureChainProbe: Probe = {
  id: 'capture',
  title: 'Capture chain (mic → worklet)',
  interactive: true,
  async run() {
    const lines: string[] = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const result = await runWorkletChain(
        (ctx) => new MediaStreamAudioSourceNode(ctx, { mediaStream: stream }),
        lines,
      );
      for (const t of stream.getTracks()) t.stop();
      result.lines.push('note: energy > 0 requires ambient sound — speak while running this probe');
      return result;
    } catch (err) {
      return fail(lines, err);
    }
  },
};

/** Synchronous-in-gesture clipboard write — the only pattern iOS allows. */
const clipboardProbe: Probe = {
  id: 'clipboard',
  title: 'Clipboard write (sync in tap)',
  interactive: true,
  async run() {
    try {
      // No await before writeText: the user-gesture context must be intact.
      const p = navigator.clipboard.writeText(`fah lab clipboard probe ${new Date().toISOString()}`);
      await p;
      return { ok: true, lines: ['writeText resolved — check paste target'] };
    } catch (err) {
      return fail([], err);
    }
  },
};

const storageProbe: Probe = {
  id: 'storage',
  title: 'Storage persistence',
  async run() {
    const lines: string[] = [];
    try {
      if (!('storage' in navigator)) return { ok: false, lines: ['navigator.storage missing'] };
      const est = await navigator.storage.estimate();
      const mb = (n?: number) => (n === undefined ? '?' : (n / 1048576).toFixed(1) + ' MB');
      lines.push(`usage=${mb(est.usage)} quota=${mb(est.quota)}`);
      const before = await navigator.storage.persisted();
      lines.push(`persisted (before request): ${String(before)}`);
      const granted = await navigator.storage.persist();
      lines.push(`persist() → ${String(granted)}`);
      return { ok: granted, lines };
    } catch (err) {
      return fail(lines, err);
    }
  },
};

const pushProbe: Probe = {
  id: 'push',
  title: 'Push / badging support',
  async run() {
    const lines: string[] = [];
    lines.push(`PushManager: ${'PushManager' in window}`);
    lines.push(`Notification: ${'Notification' in window ? Notification.permission : 'missing'}`);
    lines.push(`setAppBadge: ${'setAppBadge' in navigator}`);
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      lines.push(`sw: ${reg ? `registered, scope=${reg.scope}` : 'none'}`);
      // A broader-scope SW (e.g. prod at the site root) legally controls
      // subpath pages until their own registration lands — the nested-scope
      // situation ADR-002's scope-derived cache names exist for.
      lines.push(`page expects scope: ${new URL('.', location.href).href}`);
    } else {
      lines.push('sw: unsupported');
    }
    return { ok: null, lines };
  },
};

const environmentProbe: Probe = {
  id: 'env',
  title: 'Environment',
  async run() {
    const nav = navigator as Navigator & { standalone?: boolean };
    const lines = [
      `standalone: media=${matchMedia('(display-mode: standalone)').matches} navigator=${String(nav.standalone ?? 'n/a')}`,
      `ua: ${navigator.userAgent}`,
      `viewport: ${window.innerWidth}x${window.innerHeight} dpr=${devicePixelRatio}`,
      `online: ${navigator.onLine}`,
    ];
    return { ok: null, lines };
  },
};

const miscProbe: Probe = {
  id: 'misc',
  title: 'Wake lock / preservesPitch',
  interactive: true,
  async run() {
    const lines: string[] = [];
    let ok = true;
    if ('wakeLock' in navigator) {
      try {
        const lock = await navigator.wakeLock.request('screen');
        lines.push('wakeLock: acquired');
        await lock.release();
      } catch (err) {
        ok = false;
        lines.push(`wakeLock: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      ok = false;
      lines.push('wakeLock: unsupported');
    }
    const audio = document.createElement('audio');
    lines.push(`preservesPitch: ${'preservesPitch' in audio}`);
    return { ok, lines };
  },
};

export const PROBES: Probe[] = [
  environmentProbe,
  micProbe,
  workletProbe,
  captureChainProbe,
  clipboardProbe,
  storageProbe,
  pushProbe,
  miscProbe,
];

/** ChatGPT deep-link tests — real anchors, observed by a human (ADR-004). */
export const CHATGPT_LINKS = [
  {
    label: '?q= prefill',
    href: `https://chatgpt.com/?q=${encodeURIComponent('Say "sawatdee" and tell me you received this prompt from Fah.')}`,
    expect: 'Opens ChatGPT app with the prompt PREFILLED (not sent).',
  },
  {
    label: '/voice deep link',
    href: 'https://chatgpt.com/voice',
    expect: 'Opens ChatGPT app directly in voice mode (fresh session).',
  },
  {
    label: '?q= + mode=voice (undocumented)',
    href: `https://chatgpt.com/?q=${encodeURIComponent('Voice-mode parameter test from Fah.')}&mode=voice`,
    expect: 'Unknown — observe: prefill? voice? both? nothing?',
  },
] as const;

export function buildReport(results: Map<string, ProbeResult>): string {
  const stamp = new Date().toISOString();
  const out: string[] = [`FAH DEVICE LAB REPORT · ${stamp}`, ''];
  for (const probe of PROBES) {
    const r = results.get(probe.id);
    const badge = !r ? 'SKIPPED' : r.ok === null ? 'INFO' : r.ok ? 'PASS' : 'FAIL';
    out.push(`[${badge}] ${probe.title}`);
    for (const line of r?.lines ?? []) out.push(`  ${line}`);
    out.push('');
  }
  return out.join('\n');
}
