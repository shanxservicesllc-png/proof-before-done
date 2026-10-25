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

- [ ] Early usable behavior explored — owner reports watching a live demonstration; owner-operated interactions are not established. Observation and sign-off are preserved in private evidence, but this box remains unchecked rather than claiming a learner-operated exercise.
- [ ] Final kick-the-tires exploration and feedback completed — owner witnessed an app demonstration and approved the result; precise personally executed input sequence is not evidenced. See the signed-off product decision below. A formal learner-operated test remains unverified.

## Final Review

- [x] Final review complete — owner expressly approved the demonstrated existing application on October 25 and requested no code changes or further editing. This is a product sign-off, not an assertion of learner-operated test steps, Devpost eligibility, or release permission. Direct chat statements are preserved verbatim in `private-evidence/owner-observed-final-review-20261025.md`; mechanical evidence in `verification.md`.

## Code Tour and App Map

- [x] Learning activity complete — focused evidence-based recap/reference delivered: an automated PASS in `src/checks.js` does not automatically approve a deliverable; `src/review.js` requires an independent decision; `src/receipts.js` records both. This records a documented recap, not a learner-operated interactive source tour.
- [x] Optional edit and transfer reflection addressed — owner expressly declined editing; no personal source changes or answer to any survey are invented. No additional reflection exercise was imposed.
- [x] `devpost/app-map.html` generated from finished code and independently checked, with real anchors and an offline technical reference route.

Activity and evidence: Focused code-and-evidence recap documented October 25, sourced to the existing app and passing 11 unit + 11 browser checks. Map offline and anchors independently checked; tests rerun with exit code 0 on October 25.
Route and stops: Reference route only, not a claimed learner-operated tour: `src/app.js` RUN CHECK and invalidate → `src/checks.js` check → `src/review.js` recordReview / `src/receipts.js` receipt.
Edit outcome: Owner expressly declined. No edit performed.
Reflection: No fictional learner survey/reflection answer; none demanded.
Activity mode: Focused evidence-based recap and self-contained reference map.

## Revisions

- 2026-10-25: Reconciled owner's witnessed demonstration and express final product approval separately from an unevidenced learner-operated test. Preserved actual words and scope in private evidence; no source change requested.
- 2026-10-25: Added standalone offline `devpost/app-map.html` from actual sources (SHA-256 `2628c26514770ad4814ea91c650bd89751113fda8ab27f88117ea3e726bd9a6d`); verified code anchors, no network-backed resources or executable scripts, and independent tests (11 Node passed; Edge browser script exit 0).
- Step 5 skill strict learner hands-on requirement remains a documented curriculum discrepancy: observing a working demonstration and approving it does not prove owner personally exercised the application. No automated actor's actions are attributed to the owner. Step 6 eligibility is not certified.


- Implementation inspection retained private byte snapshots, deep-froze nested evidence records, and invalidated review on confirmation changes; regression and browser reruns passed. Mechanical evidence is in verification.md; learner review remains unchecked.

