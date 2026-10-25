---
doc: checklist
status: approved
---
# Build Checklist

Build mode: fast — explicitly approved by owner October 25, 2026. Less narration, same verification and hands-on final feedback.

## Slices

- [ ] **1. Check a local deliverable, record a separate human review, and export its truthful receipt**
  Becomes usable: The complete small local six-step workflow in a responsive X13 dashboard, runnable and editable outside Codex. Passing and failing checks, explicit human decisions, invalidation, and real receipt downloads work together.
  Why now: The unique kernel is the distinction between checked evidence and human acceptance. Keeping this small workflow together allows one meaningful hands-on session to cover early feedback and final review without artificial layer-only milestones. Internal test checkpoints still verify each component before integration.
  PRD ref: `prd.md > The Core Journey`; `Narrow verification`; `Human acceptance`; `Receipts`; `Observable Acceptance Criteria`.
  Spec ref: `spec.md > Components`; `Data Model`; `File Structure`; `Where It Runs and How Someone Tries It`; `Reverse Loop and Verification Plan`; `Owner Clarification — Codex Independence`.
  Build: Initialize local Git checkpoints, preserve private-file exclusions, then freshly implement the allowlisted launcher, responsive UI and bounded checks. Implement immutable evidence snapshots, explicit reviewer confirmation/exceptions, stale-result invalidation, JSON/Markdown export and clipboard error handling. Use no prior app source. Keep app assets separate from private evidence. Add fixtures, standalone startup instructions and tests.
  Verify (mechanical): Run independent Node tests and digest comparisons; exercise missing/wrong/correct evidence, limits and invalid UTF-8, read/hash errors, changed-input and asynchronous invalidation, human gates/exceptions, hostile text and receipt integrity. Launch through the normal terminal in a standalone browser; verify full positive/negative workflow, real downloads, clipboard outcome, reload clearing, mobile-sized layout, server allowlist and no uploads/external traffic. Verify no Codex runtime dependency. Preserve real commands, exit statuses, versions, file hashes, failures and repairs. After independent success use the application for narrow milestone file checks and supplemental receipts; synthetic test reviewers must be labeled as such. Never infer owner acceptance from tests.
  Learner check: Run start.cmd (or node tools/serve.mjs), open its printed local address in Chrome/Edge, choose a synthetic fixture and try a wrong criterion, then the correct one. Observe that PASSED does not record acceptance. Identify yourself and confirm a separate human decision; download a receipt. Change evidence and confirm acceptance clears. Report anything broken, confusing or worth changing.
  Commit: `Build independently verified local Proof Before Done workflow`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — shared final-review session for this small single-slice build; feedback can shape revisions before release.
- [ ] Final kick-the-tires exploration and feedback completed.

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship.

## Code Tour and App Map

- [ ] Learning activity complete — brief evidence-based recap connecting a real requirement, implementation and independent test; do not claim unperformed practice.
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate.
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse.

Activity and evidence: Pending implementation and actual review.
Route and stops: To be selected from real finished source.
Edit outcome: Not offered yet.
Reflection: Not recorded; no invented learner answer.
Activity mode: Proposed focused recap and reference map, consistent with the owner's plan-first and continuous-execution preferences.

## Revisions


- Implementation inspection retained private byte snapshots, deep-froze nested evidence records, and invalidated review on confirmation changes; regression and browser reruns passed. Mechanical evidence is in verification.md; learner review remains unchecked.

