import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { check, MAX_BYTES } from "../src/checks.js";
import { recordReview } from "../src/review.js";
import { Session } from "../src/state.js";
import { receipt, json, markdown } from "../src/receipts.js";
import { createServer } from "../tools/serve.mjs";
const input = (content = "abc", name = "proof.txt") => ({
  claim: "Delivered",
  file: new File([content], name),
  type: "text",
  criterion: "abc",
});
test("positive, negative and exact case criteria", async () => {
  assert.equal((await check(input())).automated.status, "PASSED");
  assert.equal(
    (await check({ ...input(), criterion: "ABC" })).automated.status,
    "FAILED",
  );
  assert.equal(
    (await check({ ...input(), type: "filename", criterion: "proof.txt" }))
      .automated.status,
    "PASSED",
  );
  assert.equal(
    (await check({ ...input(), type: "filename", criterion: "Proof.txt" }))
      .automated.status,
    "FAILED",
  );
});
test("SHA256 known vector and independent oracle", async () => {
  const r = await check(input());
  assert.equal(
    r.hash.value,
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  );
  assert.equal(r.hash.value, createHash("sha256").update("abc").digest("hex"));
});
test("missing, blank, unsupported, invalid UTF8, read failure", async () => {
  for (const i of [
    { ...input(), file: null },
    { ...input(), criterion: " " },
    input("abc", "x.pdf"),
    input(new Uint8Array([255])),
    {
      ...input(),
      file: {
        name: "a.txt",
        size: 3,
        arrayBuffer: async () => {
          throw Error("injected");
        },
      },
    },
  ])
    assert.equal((await check(i)).automated.status, "NOT VERIFIED");
});
test("size boundaries, empty and BOM", async () => {
  assert.equal((await check(input("a".repeat(MAX_BYTES)))).bytesCaptured, true);
  assert.equal(
    (await check(input("a".repeat(MAX_BYTES + 1)))).automated.reason,
    "OVERSIZE",
  );
  assert.equal((await check(input(""))).automated.status, "FAILED");
  assert.equal((await check(input("\ufeffabc"))).automated.status, "PASSED");
});
test("hash failure preserves actual check and requires exception", async () => {
  const r = await check(input(), {
    digest: async () => {
      throw Error("injected");
    },
  });
  assert.equal(r.automated.status, "PASSED");
  assert.equal(r.hash.value, null);
  assert.throws(() =>
    recordReview(r, {
      decision: "ACCEPT",
      reviewer: "TEST ONLY",
      confirmed: true,
    }),
  );
  assert.equal(
    recordReview(r, {
      decision: "ACCEPT",
      reviewer: "TEST ONLY",
      confirmed: true,
      notes: "TEST exception",
      exceptionConfirmed: true,
    }).exception,
    true,
  );
});
test("human gates and all decisions", async () => {
  const r = await check(input());
  for (const decision of ["ACCEPT", "REJECT", "NEEDS MORE EVIDENCE"]) {
    assert.throws(() => recordReview(r, { decision, reviewer: "TEST ONLY" }));
    assert.equal(
      recordReview(r, { decision, reviewer: "TEST ONLY", confirmed: true })
        .decision,
      decision,
    );
  }
  assert.throws(() =>
    recordReview(r, { decision: "ACCEPT", reviewer: " ", confirmed: true }),
  );
  const missing = await check({ ...input(), file: null });
  assert.throws(() =>
    recordReview(missing, {
      decision: "ACCEPT",
      reviewer: "TEST",
      confirmed: true,
      notes: "x",
      exceptionConfirmed: true,
    }),
  );
});
test("failed result cannot be overridden by human exception", async () => {
  const r = await check({ ...input(), criterion: "wrong" });
  const h = recordReview(r, {
    decision: "ACCEPT",
    reviewer: "TEST ONLY",
    confirmed: true,
    notes: "synthetic test",
    exceptionConfirmed: true,
  });
  assert.equal(r.automated.status, "FAILED");
  assert.equal(h.exception, true);
});
test("revision guards and stale reviews", async () => {
  const s = new Session();
  const token = s.begin();
  s.invalidate();
  assert.equal(s.complete(token, await check(input())), false);
  const t = s.begin();
  s.complete(t, await check(input()));
  s.review = { decision: "ACCEPT" };
  s.invalidate();
  assert.equal(s.run, null);
  assert.equal(s.review, null);
});
test("receipt fidelity and hostile content", async () => {
  const i = input();
  i.claim = "<script>alert(1)</script>\n# PASSED";
  const r = await check(i);
  const h = recordReview(r, {
    decision: "REJECT",
    reviewer: "TEST ONLY",
    notes: "<img src=x>",
    confirmed: true,
  });
  const out = receipt(r, h);
  assert.deepEqual(JSON.parse(json(out)), out);
  assert.equal(out.automatedRun.claim, i.claim);
  assert.ok(!markdown(out).includes("<script>"));
  assert.ok(!markdown(out).includes("<img"));
  assert.throws(() => receipt(r, { ...h, runId: "other" }));
  assert.equal(receipt(r).humanReview, null);
});
test("launcher allowlist and private path protection", async () => {
  const s = createServer();
  await new Promise((r) => s.listen(0, "127.0.0.1", r));
  try {
    const url = `http://127.0.0.1:${s.address().port}`;
    for (const path of [
      "/devpost/spec.md",
      "/.git/config",
      "/.env",
      "/%2e%2e/.env",
      "/src/../devpost/prd.md",
    ])
      assert.equal((await fetch(url + path)).status, 404);
    assert.equal((await fetch(url, { method: "POST" })).status, 405);
    assert.equal((await fetch(url + "/src/checks.js")).status, 200);
  } finally {
    await new Promise((r) => s.close(r));
  }
});

test("captured bytes retained privately and nested run immutable", async () => {
  const r = await check(input());
  const s = new Session();
  const t = s.begin();
  s.complete(t, r);
  assert.equal(new TextDecoder().decode(s.snapshot), "abc");
  assert.ok(!json(receipt(s.run)).includes("snapshot"));
  assert.throws(() => {
    s.run.automated.status = "FAILED";
  });
  s.invalidate();
  assert.equal(s.snapshot, null);
});
