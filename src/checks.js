export const MAX_BYTES = 5 * 1024 * 1024;
export async function check({ claim, file, type, criterion }, deps = {}) {
  const now = deps.now ?? (() => new Date().toISOString());
  const run = {
    schemaVersion: 1,
    runId: crypto.randomUUID(),
    claim,
    criterion: { type, value: criterion },
    artifact: file
      ? {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        }
      : null,
    hash: {
      status: "UNAVAILABLE",
      algorithm: "SHA-256",
      value: null,
      error: "No readable evidence",
    },
    automated: {
      status: "NOT VERIFIED",
      reason: "INVALID_INPUT",
      explanation: "",
    },
    startedAt: now(),
    completedAt: null,
    bytesCaptured: false,
  };
  let snapshot = null;
  const finish = (status, reason, explanation) => {
    Object.defineProperty(run, "snapshot", {
      value: snapshot,
      enumerable: false,
    });
    run.automated = { status, reason, explanation };
    run.completedAt = now();
    return run;
  };
  if (
    !claim.trim() ||
    !criterion.trim() ||
    !file ||
    !["filename", "text"].includes(type)
  )
    return finish(
      "NOT VERIFIED",
      "INVALID_INPUT",
      "Provide a claim, a file, and a nonempty criterion.",
    );
  if (file.size > MAX_BYTES)
    return finish("NOT VERIFIED", "OVERSIZE", "File exceeds 5 MiB.");
  let bytes;
  try {
    bytes = await file.arrayBuffer();
    if (bytes.byteLength > MAX_BYTES || bytes.byteLength !== file.size)
      throw Error("Unexpected file size");
    run.bytesCaptured = true;
    snapshot = bytes;
  } catch {
    return finish(
      "NOT VERIFIED",
      "READ_ERROR",
      "The selected file could not be read.",
    );
  }
  try {
    const hash = await (
      deps.digest ?? ((b) => crypto.subtle.digest("SHA-256", b))
    )(bytes);
    run.hash = {
      status: "AVAILABLE",
      algorithm: "SHA-256",
      value: Array.from(new Uint8Array(hash), (b) =>
        b.toString(16).padStart(2, "0"),
      ).join(""),
      error: null,
    };
  } catch {
    run.hash.error =
      "SHA-256 could not be computed; portable content identity is unavailable.";
  }
  if (type === "filename")
    return finish(
      file.name === criterion ? "PASSED" : "FAILED",
      "FILENAME",
      "Exact case-sensitive filename comparison.",
    );
  if (!/\.(txt|md|csv|json)$/i.test(file.name))
    return finish(
      "NOT VERIFIED",
      "UNSUPPORTED",
      "Text checks support .txt, .md, .csv and .json only.",
    );
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return finish("NOT VERIFIED", "ENCODING", "Evidence is not valid UTF-8.");
  }
  return finish(
    text.includes(criterion) ? "PASSED" : "FAILED",
    "TEXT",
    "Literal case-sensitive UTF-8 substring comparison.",
  );
}
