# ADR-003: Audio capture — AudioWorklet, record-then-analyze, measured on device

**Status**: accepted · **Date**: 2026-07-17 · **Branch**: spike/device-lab

## Context

Tone Studio needs the learner's F0 curve from the iPhone microphone inside an
installed PWA. Research flagged three risks: iOS ignoring processing
constraints, worklet reliability, and route-dependent sample rates. All three
were measured on the target device (iOS 18.7 / Safari 26.5 — see
docs/device-tests.md phase 1).

## Decision

- **Capture**: getUserMedia with `echoCancellation/noiseSuppression/
  autoGainControl: false`, then **verify via `track.getSettings()`** and
  record what was actually granted alongside every attempt. Measured: EC=false
  honoured (the constraint that protects F0); NS/AGC unexposed (`undefined`)
  — assume platform voice processing may remain. AGC alters amplitude, not
  F0; scoring is on median-normalized semitone contours, so this is
  acceptable.
- **Pipeline**: mic → `MediaStreamAudioSourceNode` → AudioWorklet ring buffer
  → pitchy (MPM) on the main thread at `ctx.sampleRate` (measured 48 kHz on
  built-in mic; never hard-coded), ~2048-sample hops. Proven live end-to-end
  by the lab's capture-chain probe.
- **UX**: **record-then-analyze** (0.5–1.5 s syllable, results <100 ms after
  release). A live-updating curve stays progressive enhancement only.
- **Fallback**: `AnalyserNode.getFloatTimeDomainData` polling if worklet
  setup fails.
- **Gesture rule** (measured the hard way): one user tap carries ONE
  transient activation — never chain multiple permission-consuming audio
  setups behind a single tap. Each recording interaction constructs/resumes
  its audio graph inside its own tap handler; graphs rebuild on
  `visibilitychange`/route change.
- Recording is foreground-only (iOS mutes backgrounded capture).

## Consequences

- Mic permission may re-prompt per session (platform behavior); the recording
  UI treats the prompt as a normal step, never an error, and links the
  per-site Safari setting (page settings → Website Settings → Microphone →
  Allow) in a help note.
- Every stored pitch attempt records the granted constraint set with it, so
  future scoring calibration can segment by capture conditions.
