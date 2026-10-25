export function receipt(run, review = null) {
  if (!run) throw Error("No current completed check.");
  if (review && review.runId !== run.runId)
    throw Error("Review does not belong to this run.");
  return structuredClone({
    schemaVersion: 1,
    automatedRun: run,
    humanReview: review,
    limitations: [
      "Individual criterion only; not project completion.",
      "Human review covers this deliverable only.",
      "Self-reported reviewer; device-clock timestamps; unsigned editable record.",
      ...(run.hash.status !== "AVAILABLE"
        ? ["Portable content fingerprint unavailable."]
        : []),
    ],
  });
}
export const json = (r) => JSON.stringify(r, null, 2);
// Encode all non-alphanumeric characters in user-derived content as HTML entities.
const safe = (v) =>
  Array.from(String(v), (c) =>
    /[a-zA-Z0-9 ]/.test(c) ? c : `&#${c.codePointAt(0)};`,
  ).join("");
export function markdown(r) {
  const a = r.automatedRun,
    h = r.humanReview;
  return (
    "# Proof Before Done receipt\n\n" +
    [
      ["Run", a.runId],
      ["Claim", a.claim],
      ["Artifact", a.artifact ? JSON.stringify(a.artifact) : "NONE"],
      ["Criterion", JSON.stringify(a.criterion)],
      ["Automated result", a.automated.status],
      ["Explanation", a.automated.explanation],
      ["SHA-256", a.hash.value ?? "UNAVAILABLE"],
      ["Hash limitation", a.hash.error ?? "None"],
      ["Started", a.startedAt],
      ["Completed", a.completedAt],
      ["Human decision", h?.decision ?? "NO HUMAN DECISION RECORDED"],
      ["Reviewer", h?.reviewer ?? "None"],
      ["Notes", h?.notes ?? ""],
      ["Confirmed", h?.confirmed ?? false],
      ["Review timestamp", h?.recordedAt ?? "None"],
      ["Exception", h?.exceptionReason ?? "None"],
      ["Limitations", r.limitations.join(" ")],
    ]
      .map(([k, v]) => `**${k}:** ${safe(v)}`)
      .join("\n\n") +
    "\n"
  );
}
