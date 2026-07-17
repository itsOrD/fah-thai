# Retrospective — living document

Updated at every branch merge with time, effort, tokens, and money actually
spent — captured as we go, never reconstructed. The final entry after
feat/journey is the full project retro: what went well, where time/effort/
tokens/money were wasted and why, and concrete rules to avoid repeats.

Format per entry: **spent** (wall-clock / tokens / dollars) · **went well** ·
**waste + root cause** · **carry-forward**.

---

## 0 · Planning phase (2026-07-16 → 07-17, pre-code)

**Spent**: ~1 day elapsed across two sessions. ~630k subagent tokens in two
research workflows (11 agents: iOS-PWA platform, ChatGPT handoff mechanics,
Thai TTS, FSRS, browser pitch detection, Thai phonology — then SLA evidence,
tone pedagogy, motivation/retention science, minigames/assets/mnemonics,
CI-CD/Capacitor), plus the main-session planning/Q&A. $0 external.

**Went well**

- Multiple-choice Q&A rounds before any research locked the vibe cheaply;
  every later decision traced back to an explicit user answer.
- Research-before-architecture caught plan-killers early: single-voice TTS
  would have forfeited HVPT's generalization benefit; `actions/deploy-pages`
  can't do path-scoped deploys; custom GPTs are locked out of modern voice;
  review-debt spirals are the #1 SRS quit mechanism (now amnesty is in the
  scheduler design, not a hope).
- Structured-output research agents with per-fact confidence labels made the
  verified/likely/uncertain boundary explicit in the plan.

**Waste + root cause**

- **Two full plan revisions rejected by the user.** Root causes, in order:
  (1) led with technology and under-weighted pedagogy — the "how to teach"
  research pass happened only after the user pushed back; (2) framed the
  curriculum generically ("travel, food units") when the entire point was a
  personal curriculum (his wife's family, their food, his memories); (3)
  documented decisions without the rejected alternatives, which the user
  explicitly wanted as portfolio content.
- A mid-planning tool mistake (calling an unloaded tool schema) cost one
  round-trip. Trivial but avoidable.

**Carry-forward rules**

1. For any learning/coaching/health product: research the domain's *teaching
   evidence* in round one, alongside the tech.
2. Ask "what makes this yours alone?" before drafting any curriculum/content
   plan — personal beats generic and the user will notice.
3. "Document decisions" means decisions **and** the considered-and-rejected
   table; write both at the same moment or the whys evaporate.
4. Load deferred tool schemas before first use (batch, one call).

---

## 1 · feat/scaffold (2026-07-17)

**Spent**: ~1.5 h wall-clock in one session (estimate; includes the four
toolchain stumbles below). Main-session tokens only — no subagents. $0.

**Went well**

- Zero architectural rework: every scaffold decision (relative base, scope-
  derived SW caches, hash routing, token-only styling) came pre-verified from
  the planning research.
- The version.json propagation design proved itself immediately: the first
  real Pages deploy served 404s for ~60 s after the deploy action succeeded —
  exactly the failure mode the smoke gates are built around.
- Shell landed at ~21 kB gz JS against the 200 kB budget.

**Waste + root cause**

- Four small toolchain stumbles (~25 min total): svelte-check 4.x cannot load
  TypeScript 7 (pinned TS 5); pnpm 11 moved build-script approval to
  `pnpm-workspace.yaml` (`allowBuilds`); `virtual:pwa-register` needs
  `workbox-window` installed explicitly; first deploy 403'd because the
  workflow lacked `permissions: contents: write`. Common root cause:
  bleeding-edge tool versions drift from trained knowledge — the fixes were
  all documented in current release notes, not in memory.

**Carry-forward rules**

5. On a fresh toolchain, verify cross-tool compatibility (typechecker ×
   framework tooling) before pinning versions — check the checker's peer
   range, not just "latest".
6. When using a plugin's virtual module, install its peer imports at the same
   moment; when authoring a workflow that writes to the repo, grant the token
   permission in the same commit.

---
