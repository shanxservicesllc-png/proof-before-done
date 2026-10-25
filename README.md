# Proof Before Done

A local evidence checker with a separate human review gate. A passing file check does not mean a project is complete.

## Run without Codex
Install Node.js 24 or newer, then double-click `start.cmd` on Windows, or run:

```
node tools/serve.mjs
```
Open the printed localhost URL in Chrome or Edge. Keep the terminal open; Ctrl+C stops only this launcher. No npm install is needed to use the app. Edit the ordinary HTML/CSS/JavaScript files in any text editor. Codex, accounts, plugins, API keys and internet access are not runtime requirements.

## Try it
Use `fixtures/deliverable.txt` (synthetic sample). Choose text verification and enter `WRONG` to see FAILED, then `Delivery ready` to see PASSED. Neither action records human acceptance. Choose Record Human Review, select a decision, identify yourself and explicitly confirm. Exceptions require explanatory notes. Download JSON or Markdown before closing. Reload clears the active session.

## Limits
Files up to 5 MiB. Exact case-sensitive filename comparison; literal case-sensitive UTF-8 substring checks for .txt/.md/.csv/.json. No PDF/image content interpretation. Invalid UTF-8 fails closed. No upload, storage, saved history or receipt import. Browser/device clocks and reviewer identity are not independently authenticated. A SHA-256 value identifies bytes, not truth. Receipts are unsigned and editable. A download request is not proof a user saved the file.

A failed or unverified automated outcome remains unchanged by human review. Missing readable artifact bytes prevent ACCEPT. Unavailable fingerprints are disclosed, and acceptance with incomplete proof requires a documented exception. Changed inputs invalidate prior results and reviews.

## Independent verification
```
node --test tests/core.test.mjs
```
Development-only browser verification (requires installed Microsoft Edge):
```
npm ci
node tests/browser.mjs
```
The browser tests use a clearly labeled synthetic reviewer. They do not constitute learner approval. The runtime has zero package dependencies; Playwright is test tooling only. Test evidence is written to the ignored local evidence folder.

## Source map
- `src/checks.js`: actual file reads, comparisons, fingerprints.
- `src/state.js`: current-run identity and invalidation.
- `src/review.js`: explicit human decisions and exceptions.
- `src/receipts.js`: truthful JSON/Markdown snapshots.
- `src/app.js`: accessible UI wiring and actions.
- `tools/serve.mjs`: loopback asset-only launcher.

## Status
Implementation mechanically verified. On October 25, the owner reported watching the working demonstration, expressly approved the current product, and declined making source edits; those statements are preserved separately from automated evidence in ignored private records. A source-checked offline guide now exists at `devpost/app-map.html`. The strict official 5-build learner-operated hands-on check has not been independently established, and remains recorded as such rather than claiming the owner operated the UI. Publication, license selection, entrant-authored submission and Devpost acceptance remain outstanding; no contest eligibility or submission success is claimed. Existing application source was not imported.
