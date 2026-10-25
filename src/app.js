import { check } from "./checks.js";
import { recordReview } from "./review.js";
import { Session } from "./state.js";
import { receipt, json, markdown } from "./receipts.js";
const $ = (id) => document.getElementById(id),
  s = new Session();
const buttons = ["copy", "json", "markdown"];
function clearReview() {
  s.review = null;
  $("human").textContent = "NO HUMAN DECISION RECORDED";
  $("confirm").checked = false;
  $("exception").checked = false;
}
function invalidate() {
  s.invalidate();
  clearReview();
  $("result").textContent = "🟡 NOT VERIFIED";
  $("result").className = "status";
  $("explanation").textContent = "Inputs changed. Run a new check.";
  $("metadata").replaceChildren();
  $("review-panel").hidden = true;
  $("show-review").disabled = true;
  buttons.forEach((id) => ($(id).disabled = true));
  $("message").textContent = "";
}
for (const id of ["claim", "file", "type", "criterion"])
  $(id).addEventListener("input", invalidate);
for (const id of ["decision", "reviewer", "notes"])
  $(id).addEventListener("input", clearReview);
function detail(k, v) {
  const dt = document.createElement("dt"),
    dd = document.createElement("dd");
  dt.textContent = k;
  dd.textContent = v;
  $("metadata").append(dt, dd);
}
$("run").onclick = async () => {
  const token = s.begin();
  clearReview();
  $("run").disabled = true;
  $("review-panel").hidden = true;
  buttons.forEach((id) => ($(id).disabled = true));
  $("show-review").disabled = true;
  $("result").textContent = "Checking…";
  $("metadata").replaceChildren();
  $("message").textContent = "";
  try {
    const r = await check({
      claim: $("claim").value,
      file: $("file").files[0],
      type: $("type").value,
      criterion: $("criterion").value,
    });
    if (!s.complete(token, r)) return;
    const status = r.automated.status;
    $("result").textContent = {
      PASSED: "🟢 PASSED",
      FAILED: "🔴 FAILED",
      "NOT VERIFIED": "🟡 NOT VERIFIED",
    }[status];
    $("result").className = "status " + status.toLowerCase();
    $("explanation").textContent = r.automated.explanation;
    for (const [k, v] of Object.entries({
      Claim: r.claim,
      Artifact: r.artifact
        ? `${r.artifact.name} · ${r.artifact.size} bytes`
        : "NONE",
      "File metadata": r.artifact ? JSON.stringify(r.artifact) : "NONE",
      Criterion: `${r.criterion.type}: ${r.criterion.value}`,
      "SHA-256": r.hash.value ?? "UNAVAILABLE",
      "Fingerprint limitation": r.hash.error ?? "None",
      "Check timestamp": r.completedAt,
    }))
      detail(k, v);
    $("show-review").disabled = false;
    buttons.forEach((id) => ($(id).disabled = false));
  } catch (e) {
    $("result").textContent = "🟡 NOT VERIFIED";
    $("explanation").textContent =
      "Unexpected check failure; no verified result.";
    $("message").textContent = e.message;
  } finally {
    $("run").disabled = false;
  }
};
$("show-review").onclick = () => {
  $("review-panel").hidden = false;
  $("decision").focus();
};
$("record").onclick = () => {
  try {
    s.review = recordReview(s.run, {
      decision: $("decision").value,
      reviewer: $("reviewer").value,
      notes: $("notes").value,
      confirmed: $("confirm").checked,
      exceptionConfirmed: $("exception").checked,
    });
    $("human").textContent =
      `${s.review.decision} — ${s.review.reviewer}\n${s.review.recordedAt}${s.review.exception ? "\n" + s.review.exceptionReason : ""}`;
    $("message").textContent = "Human decision recorded for this run only.";
  } catch (e) {
    $("message").textContent = e.message;
  }
};
$("copy").onclick = async () => {
  try {
    await navigator.clipboard.writeText(json(receipt(s.run, s.review)));
    $("message").textContent = "Receipt copied.";
  } catch {
    $("message").textContent = "Copy failed. Use Export JSON or Markdown.";
  }
};
function download(format) {
  try {
    const r = receipt(s.run, s.review),
      data = format === "json" ? json(r) : markdown(r),
      blob = new Blob([data], {
        type: format === "json" ? "application/json" : "text/markdown",
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = `proof-${s.run.runId}.${format === "json" ? "json" : "md"}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $("message").textContent =
      "Download requested. Check your browser downloads.";
  } catch (e) {
    $("message").textContent = e.message;
  }
}
$("json").onclick = () => download("json");
$("markdown").onclick = () => download("md");

for (const id of ["confirm", "exception"])
  $(id).addEventListener("change", () => {
    if (s.review) clearReview();
  });
