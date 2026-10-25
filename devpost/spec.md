---
doc: spec
status: approved
created_at: 2026-10-25
---
# Proof Before Done — Technical Spec

## How This Works, In Plain Language
The browser keeps one review session in memory. You choose a file and state what to check. The app reads that file locally, checks its name or text, and calculates a fingerprint of the actual bytes. It displays what happened without calling the project complete. You separately identify yourself and record a human decision. Downloads retain both records; closing or reloading clears the active session.
A tiny local launcher serves only the application files to your own computer. It never receives the selected evidence. No cloud, account, database, or internet connection is needed during use.

## The Core Journey Through the System
Implements prd.md > The Core Journey; Human acceptance.
CLAIM → EVIDENCE → AUTOMATED CHECK → HUMAN REVIEW → RECORDED DECISION → RECEIPT.
1. Inputs create a new session revision and invalidate any previous result/review.
2. RUN CHECK captures the exact claim, criterion, selected file and revision. Reject invalid inputs before attempting a check.
3. Read bounded file bytes once, calculate their SHA-256, and evaluate the selected criterion. The same byte snapshot supplies text checks and fingerprinting.
4. Publish a completed result only if its revision is still current. Discard late asynchronous results from earlier revisions.
5. Record Human Review displays that immutable run. Require a decision, reviewer identification and confirmation. Store a review bound to that run; never modify the automated result.
6. Serialize the immutable run plus optional review to JSON/Markdown. Copy/export does not imply acceptance or project completion.

## Stack
Owner-approved: plain HTML, CSS, JavaScript; local browser; small local launcher; no external services/database.
Implementation: JavaScript ES modules, browser File API, Web Crypto SHA-256, fatal UTF-8 TextDecoder, native Blob downloads and Clipboard API. No runtime packages, CDN fonts, framework, service worker, analytics or storage API.
Node.js built-in HTTP server and test runner for launcher and independent tests. Node v24.21.0 observed locally; target Node 24.x. Pin any development-only browser-test dependency if needed during build; no package is required for end-user use. Real-browser tooling availability remains to be verified at build.
Documentation: https://nodejs.org/api/http.html ; https://nodejs.org/api/test.html ; https://nodejs.org/api/crypto.html ; https://www.w3.org/TR/FileAPI/ ; https://www.w3.org/TR/webcrypto/ ; https://encoding.spec.whatwg.org/ ; https://www.w3.org/TR/clipboard-apis/ ; https://www.w3.org/TR/secure-contexts/ .

## Where It Runs and How Someone Tries It
Planned command: `node tools/serve.mjs`. Bind only 127.0.0.1 using an OS-assigned free port; print the exact URL to open. `start.cmd` runs that command from the project root for Windows users. Do not kill processes or reuse unrelated services. Port failures produce a clear error and nonzero exit.
Target current desktop Chrome and Edge. Mobile-friendly layout verified at 375px and 768px widths, plus desktop; emulation is not proof of physical-phone operation. Do not expose a LAN listener. Physical phone support is not claimed without a tested local launch method on that device.
Use the local HTTP URL, not file://. All assets are local; disconnect external internet and repeat the workflow. Reload intentionally clears session state. Document Node prerequisite and start steps in README.
Required demo: show a negative case, corrected passing case, separate human review, and a real receipt download. Public video/repository and submission remain stage-6 tasks requiring specific release authorization.

## Look and Feel
Implements prd.md > Screens and Layout; Look and Feel.
Single responsive dashboard with black/navy backgrounds, blue action accents, clear white/soft-gray text, system fonts, readable spacing and visible keyboard focus. Six-step guide wraps on narrow screens. Use color plus text/icons: PASSED, FAILED, NOT VERIFIED. Human review status is visibly separate. No invented progress totals or decorative metrics. Result announcements use an accessible live region; controls have explicit labels; fingerprints wrap; touch targets remain comfortable.

## Components
### Input and Session Controller
Implements prd.md > Claim and local evidence; States and Boundaries.
Claim and criterion preserve exact entered strings; whitespace-only inputs are invalid, but comparison never silently trims valid criteria. Store a selected File object and monotonic revision in memory. Changing file/claim/check type/criterion clears result, review fields, confirmation and receipt actions immediately. Starting a rerun also clears prior review. Disable concurrent RUN CHECK or use the revision guard to reject stale completion. No browser persistence, receipt import, or history feature.

### Verification Engine
Implements prd.md > Narrow verification; Result and fingerprint.
Maximum inclusive size: 5 * 1024 * 1024 = 5,242,880 bytes. Reject oversize before reading. Empty files are allowed; an empty criterion is not.
Filename check: exact, case-sensitive equality of File.name and the supplied criterion; any file extension is allowed within the size bound. This checks a basename, not a filesystem path or contents.
Text check: final extension .txt/.md/.csv/.json (extension comparison case-insensitive); decode strictly as UTF-8 with fatal errors. Allow an initial UTF-8 BOM and omit it from decoded comparison text; hash retains all original bytes. Match a literal case-sensitive substring; no regex, Unicode normalization, newline conversion or JSON/CSV parsing. Invalid UTF-8 and unsupported extensions produce NOT VERIFIED. File extension is a support boundary, not proof of MIME or content safety.
Read once into a byte snapshot. Hash those exact bytes using Web Crypto SHA-256, lowercase 64-character hexadecimal. Compare independent known vectors and Node crypto results during tests.
Actual completed comparisons produce PASSED or FAILED. Missing/invalid inputs, read errors or unsupported content produce NOT VERIFIED with a reason code. Hashing is a separate result: if it fails, preserve an actually completed comparison result but show SHA-256 UNAVAILABLE, never a fully verified status. Do not convert a hash error into a fabricated comparison failure/pass.
No comparisons, reads or hashes may be simulated in the runtime.

### Evidence Snapshot and Human Review
Implements prd.md > Human acceptance.
Freeze a run record containing exact claim, check type/criterion, metadata, digest or unavailability reason, check outcome/explanation and observed timestamps. Retain its byte snapshot privately in memory where reading succeeded; no raw file contents in export.
Every review references that exact run ID and input revision. No preselected human decision. Require nonblank reviewer identification, an explicit ACCEPT/REJECT/NEEDS_MORE_EVIDENCE choice, and confirmation; optional notes unless an exception requires them. Reviewer identification is self-reported; no authentication claim.
ACCEPT on FAILED or NOT VERIFIED requires nonblank exception notes and explicit exception confirmation, and remains visibly labeled HUMAN EXCEPTION with the original automated status. Never change the automated status. If no file was selected or its bytes could not be captured (including oversize/read failure), block ACCEPT because exact artifact binding is unavailable; REJECT or NEEDS MORE EVIDENCE can still record the attempted review and limitation.
Hash unavailable but bytes captured: a human review can bind to the exact in-memory snapshot, with a warning in UI and receipt that portable content identity is unavailable. No digest, signature, authenticated approval or later-file equivalence is inferred. ACCEPT with incomplete fingerprint evidence requires a documented exception too, even if the comparison passed.
Changing any checked input or running a new check invalidates review immediately. Editing reviewer/decision/notes after recording clears confirmation and recorded review until explicitly reconfirmed. Existing exported receipts remain historical snapshots; the app cannot revoke or alter downloaded files.

### Receipt Serializer and Export
Implements prd.md > Receipts.
One stable JSON schema, version 1, and a Markdown rendering of the same snapshot. Include claim, exact criterion, file metadata, automated outcome and explanation, hash status/value, run ID, check timestamps, nullable human review, reviewer identity/decision/notes/confirmation/recording time, binding limitations and exception labels. Show NO HUMAN DECISION RECORDED when review is absent. Never export form drafts as recorded decisions.
JSON uses JSON.stringify; UI uses textContent/DOM properties rather than input-derived HTML. Markdown must escape hostile text to prevent injected headings, links, raw HTML or spoofed statuses; preserve exact machine-readable values in JSON. Tests compare Markdown's decoded values with the canonical record.
Export via Blob/object URL with an app-generated filename, then revoke URL. State download requested rather than claiming a disk write is proven. Clipboard success appears only after its promise resolves; denial shows an error and leaves export available. Verify real browser download bytes independently.
Receipts explicitly say: individual criterion only; human review covers this deliverable, not project completion; local self-reported identity and device clock; editable, unsigned records.

### Local Launcher
Implements prd.md > Non-Goals and local operation.
Only GET/HEAD for an explicit allowlist of application assets. Never serve project root, devpost, private-evidence, .git, environment files or arbitrary paths. No upload routes or evidence payloads; reject other methods. Correct content types; no directory listing. CSP limits scripts/styles to local assets and connect-src to none; prohibit object/frame embedding. Server logs requests without recording claims or evidence. Test traversal and private-path denials independently.

## Data Model
Memory only:
- inputs: revision, claim, File reference, checkType, criterion.
- run: schemaVersion, runId, revision, claim, criterion {type,value}, artifact {name,size,type,lastModified}, hash {status,algorithm,value,error}, automated {status,reason,explanation}, startedAt, completedAt, bindingLimitations.
- privateSnapshot: exact bytes for current completed run when readable; never serialized.
- humanReview: null or {runId, revision, decision, reviewer, notes, confirmed:true, recordedAt, exception, exceptionReason}.
- receipt: deep copy of run plus humanReview and explicit scope/identity/clock limitations.
Use actual device-clock ISO timestamps at events, not seeded/example times. lastModified is file metadata, not verification time. Device clock is not trusted time; UUID/run ID is not authentication. Reset all on reload.

## File Structure
Planned fresh files only; existing curriculum/plans remain preserved.
```
index.html              # dashboard and accessible form
styles.css              # responsive X13 palette/layout
src/app.js              # event wiring, state and safe rendering
src/checks.js           # bounded reads, comparisons and digest
src/review.js           # immutable binding and decision validation
src/receipts.js         # canonical JSON and escaped Markdown
src/state.js            # revision invalidation / stale-result guard
tools/serve.mjs         # loopback allowlisted static launcher
start.cmd               # Windows launcher wrapper
package.json            # commands, module type; no runtime dependencies
tests/checks.test.mjs   # independent fixture expectations and hash oracle
tests/review.test.mjs   # human gate, exceptions, binding, invalidation
tests/receipts.test.mjs # actual fields/escaping/round-trip invariants
tests/server.test.mjs   # asset allowlist / traversal / methods
tests/browser/          # browser procedure or automation with real downloads
fixtures/               # clearly synthetic demo evidence, including failures
README.md               # startup, limits, test commands and truthful usage
devpost/                # existing plans; later checklist and app map
```
Private execution records and failures stay in devpost/private-evidence (gitignored); prepare sanitized public test evidence during build/ship. No old application files, assets or history imported.

## External Services and Dependencies
None at runtime. No keys, fees, uploads, database, remote fonts or outbound calls. Node is a local launcher/test prerequisite, not an evidence backend. Browser automation may be a development-only dependency; first inspect available tools, record actual versions and never substitute a DOM mock for browser proof.

## Reverse Loop and Verification Plan
Finished result: one working offline file check, distinct explicit human review, truthful downloadable record.
Work backward: receipt fidelity requires an immutable run and review; review binding requires exact current evidence and invalidation; result honesty requires actual bounded reads/comparison/hash; usable demo requires responsive local UI and a reliable launcher.
Build forward after approval:
1. Verification engine + fixtures + independent tests for positive/negative/missing evidence.
2. Session/review/receipt modules + tests for binding, exceptions and truthful export.
3. Dashboard/launcher + full real-browser workflow; repair failures and rerun affected checks.
Independent commands planned: `node --test tests/*.test.mjs` (shell-compatible enumeration if needed), and separately compare fixture digests via Node crypto or PowerShell Get-FileHash. Record commands, runtime/browser version, exit status, expected/actual results, artifact hashes and failure/repair trail.
Cover 0 bytes, exactly 5 MiB, 5 MiB+1, case-sensitive names/substrings, BOM, invalid UTF-8, unsupported extensions, empty/whitespace criteria, read/hash errors, stale async results, all three human decisions, missing reviewer/confirmation, exceptions, changed claim/file/criteria, review edits, hostile strings, clipboard denial, receipt content, reload reset, server privacy, and no unintended network requests. Fault injection belongs only in tests; label injected cases and do not describe them as naturally observed runtime failures.
Real browser: launch through documented command; choose actual fixtures; show fail→repair→pass; confirm no automatic acceptance; record a test-only reviewer explicitly labeled synthetic; download/read JSON and Markdown; test negative human gates and stale invalidation; inspect desktop and mobile viewport, keyboard flow and long fingerprints. Capture actual screenshots and actions with evidence, not screenshots alone. Test external internet unavailable while loopback remains reachable. Emulated mobile is reported as emulated.
Bootstrap every milestone using independent tools. After the app passes independent checks, use Proof Before Done to check exact filenames/text in milestone artifacts and export supplemental receipts. The app never certifies its own correctness, curriculum completion or contest eligibility. No fabricated owner review in test receipts; distinguish synthetic test identities from actual learner approvals.

## Important Failure Modes
- Read/decode/size failure → NOT VERIFIED with a specific explanation; no invented bytes or fingerprint.
- Hash/context unavailable → disclose missing fingerprint, preserve actual comparison result, restrict review as above.
- Inputs change during a read → discard stale completion and require another run/review.
- Clipboard/download denied → show honest action failure or initiation state; do not assert saved output.
- Launcher unavailable → clear error; do not restart unrelated services or silently switch launch modes.

## What Was Simplified and Why
Owner-approved session-only operation eliminates accounts/history/database; exports retain records. Literal filename/text criteria keep claims measurable without pretending to understand arbitrary documents. No PDF/image content checks. Local assets and vanilla JavaScript avoid deployment and runtime dependency requirements.

## Decisions and Open Issues
Owner approved the stack, local/offline operation, 5 MiB cap, filename/UTF-8 checks, SHA-256, excluded formats, and independent/browser verification. Scope and PRD approvals remain unchanged.
Implementation details above derive from those choices. Specific behaviors newly made explicit for this blueprint review: case-sensitive literal checks; BOM handling; no ACCEPT without readable artifact bytes; documented incomplete-hash exceptions; session snapshot binding and launcher security boundaries.
A genuine engineering ambiguity was unavailable hashing versus exact artifact binding. This blueprint separates comparison outcome, hash availability, in-session binding and portable identity; tests must exercise each. This is an identified engineering issue, not a claim that the learner expressed confusion or mastered it.
No additional learner uncertainty was expressed. The owner may ask for an explanation or change during review; no quiz required.
Environment: Node v24.21.0 verified. Browser tooling and full runtime compatibility remain unverified until build. No application tests or source generation performed in this stage.
Self-review: each PRD behavior maps to a named component and test target; no backend or unrelated infrastructure added. Owner subsequently approved this displayed blueprint in the continuous-execution handoff; final approval is preserved in private evidence.


## Owner Clarification — Codex Independence
Application source must be editable using any ordinary text editor. Launch and verify from a normal terminal in a standalone browser without Codex SDKs, plugins, accounts, or proprietary runtime. Codex is a development tool only. Include a source dependency audit and standalone launch test in build evidence.
