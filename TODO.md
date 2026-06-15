# TODO

### [x] Update CLAUDE.md — corrections as documentation lag (2026-03-29)

Add to the corrections section:
> **Corrections are documentation lag, not model failure.** When the same mistake recurs, the fix is writing the invariant down — not repeating the correction. Every correction that doesn't produce a CLAUDE.md edit will happen again. Exception: during active design, corrections are the work itself — don't prematurely document a design that hasn't settled yet.

Add to the Session Handoff section:
> **Initiate a handoff after a significant mid-session correction.** When a correction happens after substantial wrong-path work, the wrong reasoning is still in context and keeps pulling. Writing down the invariant and starting fresh beats continuing with poisoned context — the next session loads the invariant from turn 1 before any wrong reasoning exists.

Conventional commit: `docs: add corrections-as-documentation-lag + context-poisoning handoff rule`

## Pending: ecosystem skill seeding (deferred — repo was dirty 2026-06-16)

`github-io/tooling/sync-skills.sh` skipped this repo (dirty tree). As an rhi-zone developer-substrate
recipient, scribble should receive all 8 canonical skills: the all-tier set (design-it-twice, handoff,
polish, survey-open-threads, think-with-the-engineering-taste) plus the dev-tier trio
(design-an-interface, domain-model, improve-codebase-architecture). Re-run when clean:

```sh
sh ~/git/rhizone/github-io/tooling/sync-skills.sh
```
