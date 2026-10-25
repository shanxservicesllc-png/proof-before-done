---
doc: prd
status: approved
created_at: 2026-10-25
---
# Proof Before Done — Product Requirements

A beginner-friendly, local evidence checker for an owner reviewing an AI worker's completion claim.
Source: scope.md > The Unique Kernel; Who It's For; The Core Loop. Scope approved by the learner on October 25, 2026. This PRD was approved by the owner on October 25, 2026. Technical specification approval is still required before coding.

## The Core Journey
1. Open the dashboard and immediately understand CLAIM → EVIDENCE → AUTOMATED CHECK → HUMAN REVIEW → RECORDED DECISION → RECEIPT.
2. Enter the exact worker claim, select one local evidence file, and enter a narrow verification criterion.
3. Press RUN CHECK to perform the selected check against that file.
4. Read PASSED, FAILED, or NOT VERIFIED with a plain-language explanation of precisely what was checked.
5. Review the evidence metadata, SHA-256 fingerprint when available, and timestamp.
6. Select Record Human Review, inspect the exact checked evidence, choose ACCEPT, REJECT, or NEEDS MORE EVIDENCE, identify the reviewer, add notes, and explicitly confirm the decision. Acceptance concerns this deliverable against the stated task and requirements only.
7. Copy or export a truthful receipt containing the automated result and the separately recorded human decision. A passing check does not establish project completion or human acceptance.
8. If evidence fails, repair the deliverable outside this app, select the replacement, and check again.
Source: scope.md > The Core Loop; What "Working" Looks Like, reviewed handoff section 3, learner's dashboard instructions.

## Screens and Layout
A single mobile-friendly X13 dashboard presents the six named workflow steps in order. Include claim input, evidence file selector, verification criteria, and a prominent RUN CHECK button. Results and receipt actions belong to this same simple workflow. Keep controls readable and reachable on narrow screens without horizontal scrolling.
Source: learner's current design instructions; scope.md > Inspiration & Identity.

## Look and Feel
Clean, professional dark navy and black theme, blue accents, and clear status indicators. Use visible words with icons/colors: 🟢 PASSED, 🔴 FAILED, 🟡 NOT VERIFIED. Beginner-readable labels and explanations; responsive layout; functionality and verified results take priority over decoration. No additional decorative dashboard metrics or implied verification activity.
Exact typeface and spacing are implementation details, not claimed learner preferences.

## Features and Behavior
### Claim and local evidence
Capture the exact claim separately from the criterion. The reviewer explicitly chooses one file; the application must not upload its contents or silently access unrelated files. Show available file metadata without claiming that metadata proves the file's truth.
Source: scope.md > The POC Boundary; Explicitly Cut; reviewed handoff section 3.

### Narrow verification
Support exact filename comparison and specified text-substring checking as the concrete narrow checks recovered from the handoff. Each run tests one selected criterion, not the full claim or project. Explain what matched or failed to match. Empty criteria, missing evidence, unsupported evidence, or inability to complete the check cannot yield PASSED.
Source: scope.md > What "Working" Looks Like; reviewed handoff sections 3 and 10.

### Result and fingerprint
PASSED means the selected criterion was actually checked and matched. FAILED means the check completed and the criterion did not match. NOT VERIFIED means no valid completed check establishes an outcome; explain what is missing or unsupported. Show SHA-256 when successfully computed; explicitly identify unavailable fingerprints instead of inventing a digest. Display a timestamp for the observed check. A digest identifies bytes, not authorship, truth, or authenticated approval.
Source: scope.md > The Unique Kernel; reviewed handoff section 10; learner's design instructions.

### Receipts
Provide one-touch copy and export actions; JSON and Markdown receipt exports reflect the actual claim, criterion, result, explanation, file metadata, available digest, and timestamp. State the scope of the check and keep human acceptance separate. Do not describe receipts as signed or tamper-proof. Report copy/export failure honestly rather than claiming success.
Source: scope.md > The Core Loop; reviewed handoff sections 3 and 10; learner's design instructions.

### Human acceptance
After the automated check attempt finishes, show its actual outcome and a separate **Record Human Review** action. The review presents the original claim, selected artifact, criteria, test results, SHA-256 when available, and check timestamp together.

The reviewer chooses explicitly; no decision is preselected:
- **ACCEPT** — I personally reviewed this specific deliverable and confirm it satisfies the stated task and acceptance criteria.
- **REJECT** — The deliverable does not satisfy the requirements.
- **NEEDS MORE EVIDENCE** — The available proof is insufficient to make an acceptance decision.

Require an explicit decision, reviewer identification, and confirmation before recording acceptance. Allow explanatory notes. Reviewer identification is self-reported, not authenticated identity. Record the human decision and its actual recording time separately from the automated result and check time. Acceptance covers only the specific deliverable against the stated requirements, never the entire project, related tasks, or untested functionality.

Bind the decision to the exact artifact and the recorded claim, criterion, and evidence snapshot. Any change to file, claim, criteria, or recorded check evidence invalidates current acceptance; a rerun requires a fresh review. A previous receipt describes its original snapshot only and cannot be relabeled as acceptance of changed inputs. A missing fingerprint must be disclosed; it must not be portrayed as portable cryptographic proof of artifact identity.

If the automated result is FAILED or NOT VERIFIED, it must remain so. Any human ACCEPT in that state is visibly labeled **HUMAN EXCEPTION — AUTOMATED CHECK FAILED/NOT VERIFIED**, requires an explanatory note and explicit confirmation, and never becomes a passed automated check or fully verified status. Missing evidence cannot be represented as an identified accepted artifact.

Never invent a reviewer, confirmation, timestamp, result, or evidence. Before human review is recorded, show **NO HUMAN DECISION RECORDED**. Both JSON and Markdown receipts include separate automated and human-review sections, the reviewed snapshot, notes, any exception warning, and the limited meaning of acceptance.
Source: scope.md > The Unique Kernel; The POC Boundary.

## States and Boundaries
- First use: no completed check; NOT VERIFIED rather than a default pass.
- Missing/invalid input: explain the issue and do not claim a completed verification.
- Checking: communicate that verification is in progress; do not present an earlier result as the current run.
- Mismatch: FAILED with the tested criterion and actual outcome.
- Read/unsupported evidence error: NOT VERIFIED with an explanation.
- Hash unavailable: disclose that limitation separately; never fabricate a fingerprint or imply full verification.
- Changed claim/file/criterion: invalidate the prior result so it cannot be exported as verification of the new inputs.
- Filenames and evidence text: display as text, never execute their contents.
- No recorded review: display NO HUMAN DECISION RECORDED, never implicit acceptance.
- Human exception: preserve the failed/unverified automated result, show the exception label, and require explanatory notes.
- Session persistence — approved: keep active inputs and review in memory only; closing/reloading clears them. Downloaded receipts remain with the user. No saved-history or receipt-import feature in this PoC. The owner explicitly approved session-only operation on October 25, 2026.
Source: handoff section 10 verification requirements and approved scope.

## Observable Acceptance Criteria
- A beginner can follow the six-step sequence and find RUN CHECK on desktop and mobile-sized screens.
- Known matching and nonmatching filename/text fixtures produce the appropriate actual result and explanation.
- Missing evidence, empty criteria, unsupported input, and read failure cannot produce a false pass.
- File fingerprints agree with independently computed SHA-256 values; unavailable hashes are disclosed.
- Changing any checked input makes the previous result stale and prevents misleading reuse.
- Copied/exported receipt fields agree with the displayed run and selected evidence.
- Neither a passed criterion nor receipt export marks the entire project complete.
- ACCEPT, REJECT, and NEEDS MORE EVIDENCE remain separate from the automated result; absent reviewer identification or confirmation cannot record acceptance.
- ACCEPT after FAILED/NOT VERIFIED requires a documented, visibly labeled exception and leaves the automated result unchanged.
- Changed artifact, claim, criteria, or check evidence invalidates the current human decision.
- JSON and Markdown receipts faithfully preserve reviewer identification, decision, notes, timestamps, exact reviewed snapshot, and exception status without claiming authenticated identity.
- File contents and claims are not uploaded; hostile text is rendered safely.
These are future test targets, not claims that testing has occurred.

## Product Decisions
- Learner approved scope on October 25; approval preserved privately with the reviewed scope hash.
- Learner chose the X13 dashboard, palette, six-step sequence, named inputs, prominent check button, status indicators, fingerprints/timestamps, and copy/export controls.
- Learner subsequently specified the six-step human-review flow, three decisions, explicit identity/confirmation, evidence binding, and documented exceptions; this supersedes the shorter four-step overview.
- Learner prioritizes functionality and verified results over decoration.
- Existing app remains research only; all new application code follows planning approvals.
- Receipt limitations and fail-closed checks are recovered requirements, not evidence of implemented features.

## What We're Building
One small local workflow for one file and one objective criterion per run, clear results, truthful receipts, and a distinct human review boundary.

## Deferred From the POC
Multi-artifact release gates, dependency tracking, agent integration, and build-history comparison: beyond the narrow proof loop.

## Non-Goals
No logins, paid APIs, evidence uploads, arbitrary execution, whole-project certification, automatic contest eligibility decisions, or copying/refactoring the old source.

## Review Item and Technical Follow-Up
- **Approved owner decision:** session-only state, with downloaded receipts as the retained record. No automatic history or restoration after closing/reloading. The owner approved this choice and downloaded JSON/Markdown receipts as retained records.
- During 4-spec, agree on supported file types/encoding and size limits, unavailable-hash handling and exact artifact binding, browser/launch support, clock limitations, and independent tests. No application code before approved PRD and spec.
- Human review requirements are now resolved by the owner's explicit decision. This PRD revision is approved; scope approval is preserved. Proceed to 4-spec without generating application code.