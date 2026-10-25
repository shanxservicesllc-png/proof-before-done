export function recordReview(
  run,
  {
    decision,
    reviewer,
    notes = "",
    confirmed = false,
    exceptionConfirmed = false,
  },
  now = () => new Date().toISOString(),
) {
  if (!run) throw Error("Run a check first.");
  if (
    !["ACCEPT", "REJECT", "NEEDS MORE EVIDENCE"].includes(decision) ||
    !reviewer.trim() ||
    !confirmed
  )
    throw Error(
      "Choose a decision, identify yourself, and confirm your review.",
    );
  if (decision === "ACCEPT" && !run.bytesCaptured)
    throw Error("Acceptance requires readable artifact bytes.");
  const exception =
    decision === "ACCEPT" &&
    (run.automated.status !== "PASSED" || run.hash.status !== "AVAILABLE");
  if (exception && (!notes.trim() || !exceptionConfirmed))
    throw Error(
      "An exception requires explanatory notes and explicit exception confirmation.",
    );
  return {
    runId: run.runId,
    decision,
    reviewer,
    notes,
    confirmed: true,
    recordedAt: now(),
    exception,
    exceptionReason: exception
      ? `HUMAN EXCEPTION — automated result: ${run.automated.status}; fingerprint: ${run.hash.status}`
      : null,
  };
}
