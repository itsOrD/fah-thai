# On-device test protocol & measured results

The hidden `#/lab` screen is the instrument; this file is the record. Re-run
after iOS updates or before merging any branch that touches audio, storage,
push, or the ChatGPT handoff.

## Protocol

Per milestone that touches device APIs:

1. Safari tab: open the current build (test env for spikes), Run all, tap the
   interactive probes individually (iOS gesture scope — see lab notes), Copy
   report, paste into the build session.
2. Installed PWA: same from the home-screen icon (prod build).
3. ChatGPT links: tap each, note observed behavior.
4. Flows as they land: audio unlock after suspend, Bluetooth route swap,
   offline cold start, pack prefetch + airplane-mode review, push arrival,
   backup export/import.

## Phase 1 — Safari tab, iPhone (iOS 18.7 · Safari 26.5) · 2026-07-17

Device: iPhone, viewport 393×695 @3x. Build: spike/device-lab `065e85a` on
the /test/ environment.

| Capability | Result | Reading |
|---|---|---|
| getUserMedia (raw constraints) | track granted; `echoCancellation=false` **honoured**; `noiseSuppression`/`autoGainControl` returned `undefined` | The constraint that protects F0 (echo cancellation OFF) works. iOS does not expose NS/AGC via getSettings — assume voice processing may remain; AGC affects amplitude, not pitch. Record-then-analyze design stands (ADR-003). |
| AudioWorklet (oscillator) | 300×128-sample quanta, energy 1.9e4, ctx 48000 Hz | Worklet machinery fully live. Never hard-code sample rate (48k here; varies by route). |
| Capture chain (mic → worklet) | 300 quanta, energy 1.1e-1 (real ambient signal) | **The Tone Studio pipeline shape works end-to-end on the target device.** |
| Clipboard writeText (sync in tap) | resolved | Lane B of the handoff is viable. |
| storage.persist() | `false` in Safari tab | Expected: WebKit weighs home-screen installation in its heuristic. Re-measure installed (phase 2). Backup/export remains mandatory regardless. |
| Push / badging | `PushManager` absent, `Notification` missing in tab | Expected: iOS exposes Web Push only to installed home-screen apps. Phase 2 measures the real answer. |
| Wake lock | acquired | OK (iOS 18.4+ fix confirmed). |
| preservesPitch | `true` | Slowed playback fallback available (pre-baked slow variants remain primary). |
| SW registration | report showed root-scope SW controlling the /test/ page | The broader-scope SW covers subpaths until the page's own registration completes — exactly the nested-scope hazard ADR-002's scope-derived cache names exist for. Benign; lab now prints the page's expected scope alongside. |
| Storage quota | 39.3 GB | Audio packs are a rounding error. |

### ChatGPT deep links (measured — decides ADR-004)

| Link | Observed | Verdict |
|---|---|---|
| `chatgpt.com/?q=…` | Opened the native app; prompt landed in a live thread and was answered | **Primary lane confirmed.** Voice runs in-thread since Nov 2025, so tapping the voice-waveform button on the reply continues with full context. |
| `chatgpt.com/voice` | Opened app → bounced to a logged-out Safari tab → "Open app" banner → app voice chat with no context | **Dead. Do not ship.** |
| `chatgpt.com/?q=…&mode=voice` | Entered a live voice chat directly, but the `q=` text was dropped (model saw only the earlier thread) | Enters voice but loses the payload — unusable for context handoff; optional "free talk" button at most. |

### Lab bugs found by this run (fixed on the spike branch)

- "Run all" chained interactive probes through one tap; iOS transient user
  activation expires after the first consumer → later probes failed or
  silently skipped their prompts. Run all now runs only non-interactive
  probes; interactive ones require individual taps by design.
- Mic probe graded iOS's constraint behavior as FAIL; it is expected platform
  behavior → now INFO with an honest interpretation line.

## Phase 2 — Installed PWA (pending)

After spike merge reaches production: install from
https://itsord.github.io/fah-thai/, open `#/lab` from the icon, run all +
interactive probes, Copy report. Key questions: `standalone=true`,
`persist()` granted?, `PushManager`/`Notification`/`setAppBadge` present?,
mic re-prompt behavior per launch. Gates feat/backup-push (branch 14), not
the audio work.
