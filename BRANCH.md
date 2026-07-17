# spike/device-lab

## What

The hidden `#/lab` screen: a self-serve probe harness for every device
capability the app's architecture bets on, plus a `spike-deploy` workflow so
this branch can be tested on a real iPhone from the `/test/` environment
**before** it merges (the branch's merge gate is an on-device pass recorded
in `docs/device-tests.md`).

Probes (each a Run button; "Copy report" puts a plain-text summary on the
clipboard for a zero-effort paste back into the build session):

1. **Environment** — standalone/display-mode, UA, service-worker state.
2. **Microphone** — getUserMedia with echoCancellation/noiseSuppression/
   autoGainControl all `false`, then `getSettings()` readback: iOS is known
   to ignore constraint requests; the pitch pipeline needs to know.
3. **Worklet (synthetic)** — AudioContext + AudioWorklet fed by an
   oscillator: no permission needed; proves the worklet machinery + reports
   `sampleRate` (44.1k vs 48k varies by audio route — never hard-coded).
4. **Capture chain** — mic → AudioWorklet → frame counter + RMS: the exact
   shape of the Tone Studio pipeline.
5. **Clipboard** — synchronous `writeText` inside the tap handler (the only
   pattern iOS allows; any preceding `await` kills it).
6. **Storage** — `estimate()`, `persisted()`, `persist()`.
7. **Push/Badging** — API presence + permission state (no VAPID subscribe
   yet; that's feat/backup-push).
8. **Wake lock / preservesPitch** — feature checks.
9. **ChatGPT deep links** — real `<a>` taps (universal links ignore
   programmatic navigation): `?q=` prefill, `/voice`, and the undocumented
   `?q=…&mode=voice` — observed manually, results dictated back.

## Why a spike branch

ADR-003 (audio capture) and ADR-004 (ChatGPT handoff lanes) must be written
from measured device behavior, not documentation folklore — the research
flagged both areas as "verify on device, mechanics drift". The lab stays in
the app forever (hidden route) so any future iOS update can be re-probed in
30 seconds.

## Definition of done

- All probes runnable on desktop (graceful degradation) and iPhone.
- `spike-deploy` workflow can push this branch's build to /test/ on demand.
- mjb runs the lab on his iPhone (Safari tab AND installed PWA), taps
  Copy report twice, pastes both. Results land in docs/device-tests.md;
  ADR-003/004 get their measured-behavior sections. Then merge.
