# ADR-004: ChatGPT voice-lesson handoff — measured lanes

**Status**: accepted · **Date**: 2026-07-17 · **Branch**: spike/device-lab
**Volatility warning**: these are undocumented behaviors of a third-party app;
re-run the lab's link tests quarterly and before any Voice-screen change.

## Context

The killer feature compiles the learner's SRS state into a speaking-lesson
prompt and hands it to ChatGPT voice. Universal-link behavior could not be
trusted from documentation (research found conflicting 2025 reports); the
device lab measured it on the target iPhone (2026-07-17, ChatGPT iOS app
current; see docs/device-tests.md).

## Decision (measured)

- **Lane A (primary)** — `https://chatgpt.com/?q=<urlencoded prompt>` as a
  real `<a>` tap: opens the native app and the prompt lands in a live thread
  (observed answered). Voice mode runs in-thread (Nov 2025 model), so the
  user taps the **voice-waveform button** on the reply and the voice
  conversation carries the full lesson context. Flow: one tap in Fah →
  (send if not auto-sent) → tap voice. The Voice screen shows exactly these
  steps with Fah narrating them.
- **Lane B (long prompts)** — >~2k chars: synchronous `clipboard.writeText`
  in the tap handler (measured working), then open the app; user long-press
  pastes (no iOS paste alert for menu paste), sends, taps voice.
- **Rejected: `chatgpt.com/voice`** — measured broken: app opens, bounces to
  a logged-out Safari tab, recovered thread has no context. Never shipped.
- **Rejected as handoff: `?q=…&mode=voice`** — measured: enters voice
  directly but **drops the q= payload**. May return later as a context-free
  "just talk" button, clearly labeled.
- **Persona persistence**: one-time ChatGPT **Memory** setup prompt (custom
  GPTs rejected — locked out of modern voice modes per research). Keeps
  per-session prompts short enough for Lane A.

## Consequences

- The prompt compiler targets URL-sized prompts (~≤2k chars) as the norm:
  persona summary + today's weak sounds + due vocab + scenario, with the
  Memory setup carrying the stable persona bulk.
- The handoff can never be fully automatic (2–3 taps) — accepted; the Voice
  screen choreographs the taps.
- Quarterly re-verification task noted at the top of this file; the lab
  ships in production permanently for exactly this purpose.
