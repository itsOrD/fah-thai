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
