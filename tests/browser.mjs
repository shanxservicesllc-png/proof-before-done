import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
const proc = spawn(process.execPath, ["tools/serve.mjs"], {
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true,
});
const url = await new Promise((resolve, reject) => {
  proc.stdout.once("data", (d) =>
    resolve(d.toString().match(/http:\/\/\S+/)[0]),
  );
  proc.once("error", reject);
});
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ acceptDownloads: true });
const page = await context.newPage();
const external = [],
  errors = [];
page.on("request", (r) => {
  if (!r.url().startsWith(url)) external.push(r.url());
});
page.on("pageerror", (e) => errors.push(e.message));
const report = {
  started: new Date().toISOString(),
  browser: browser.version(),
  launch: url,
  checks: [],
  syntheticReviewer:
    "TEST ONLY — automated browser verification; not owner acceptance",
};
async function ok(name, fn) {
  await fn();
  report.checks.push(name);
}
async function getReceipt() {
  const event = page.waitForEvent("download");
  await page.locator("#json").click();
  const download = await event;
  return JSON.parse(await readFile(await download.path(), "utf8"));
}
try {
  await page.goto(url);
  await ok("missing evidence fails closed", async () => {
    await page.locator("#run").click();
    await page
      .getByText("Provide a claim, a file, and a nonempty criterion.")
      .waitFor();
    assert.equal(
      (await getReceipt()).automatedRun.automated.status,
      "NOT VERIFIED",
    );
  });
  await page
    .locator("#claim")
    .fill("Synthetic deliverable contains required text");
  await page.locator("#file").setInputFiles("fixtures/deliverable.txt");
  await page.locator("#type").selectOption("text");
  await page.locator("#criterion").fill("WRONG");
  await page.locator("#run").click();
  await page.locator("#result").filter({ hasText: "FAILED" }).waitFor();
  await ok("real negative result and documented human exception", async () => {
    await page.locator("#show-review").click();
    await page.locator("#decision").selectOption("ACCEPT");
    await page.locator("#reviewer").fill(report.syntheticReviewer);
    await page.locator("#confirm").check();
    await page.locator("#record").click();
    assert.match(
      await page.locator("#message").innerText(),
      /exception requires/,
    );
    await page
      .locator("#notes")
      .fill("Synthetic exception to test that failed checks remain failed.");
    await page.locator("#confirm").check();
    await page.locator("#exception").check();
    await page.locator("#record").click();
    const r = await getReceipt();
    assert.equal(r.automatedRun.automated.status, "FAILED");
    assert.equal(r.humanReview.exception, true);
  });
  await ok("input changes invalidate acceptance", async () => {
    await page.locator("#criterion").fill("Delivery ready");
    assert.equal(
      await page.locator("#human").innerText(),
      "NO HUMAN DECISION RECORDED",
    );
    assert.equal(await page.locator("#json").isDisabled(), true);
  });
  await page.locator("#run").click();
  await page.locator("#result").filter({ hasText: "PASSED" }).waitFor();
  await ok("passed check has no automatic acceptance", async () => {
    assert.equal((await getReceipt()).humanReview, null);
  });
  await page.locator("#show-review").click();
  await page.locator("#decision").selectOption("ACCEPT");
  await page.locator("#reviewer").fill(report.syntheticReviewer);
  await page
    .locator("#notes")
    .fill("Synthetic successful check; this is NOT learner feedback.");
  await page.locator("#confirm").check();
  await page.locator("#record").click();
  await ok(
    "downloaded JSON preserves actual results and separate review",
    async () => {
      const r = await getReceipt();
      assert.equal(r.automatedRun.automated.status, "PASSED");
      assert.equal(r.humanReview.decision, "ACCEPT");
      assert.match(r.automatedRun.hash.value, /^[a-f0-9]{64}$/);
      await writeFile(
        "devpost/private-evidence/browser-test-receipt.json",
        JSON.stringify(r, null, 2),
      );
    },
  );
  await ok("real Markdown download", async () => {
    const e = page.waitForEvent("download");
    await page.locator("#markdown").click();
    const d = await e;
    const text = await readFile(await d.path(), "utf8");
    assert.match(text, /Proof Before Done receipt/);
    await writeFile("devpost/private-evidence/browser-test-receipt.md", text);
  });
  await page.screenshot({
    path: "devpost/private-evidence/desktop.png",
    fullPage: true,
  });
  await ok("mobile viewport no horizontal overflow", async () => {
    await page.setViewportSize({ width: 375, height: 812 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await page.screenshot({
      path: "devpost/private-evidence/mobile.png",
      fullPage: true,
    });
  });
  await ok("clipboard denial disclosed", async () => {
    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: async () => {
            throw Error("injected denial");
          },
        },
      });
    });
    await page.locator("#copy").click();
    await page.getByText("Copy failed. Use Export JSON or Markdown.").waitFor();
  });
  await ok("reload clears session", async () => {
    await page.reload();
    assert.equal(
      await page.locator("#human").innerText(),
      "NO HUMAN DECISION RECORDED",
    );
    assert.equal(await page.locator("#json").isDisabled(), true);
  });
  await ok("external network denied; local assets continue", async () => {
    await context.route("**/*", (route) =>
      route.request().url().startsWith(url) ? route.continue() : route.abort(),
    );
    await page.reload();
    await page.locator("#claim").fill("Offline fixture");
    await page.locator("#file").setInputFiles("fixtures/deliverable.txt");
    await page.locator("#criterion").fill("deliverable.txt");
    await page.locator("#run").click();
    await page.locator("#result").filter({ hasText: "PASSED" }).waitFor();
  });
  await ok(
    "app verifies its milestone artifact only after independent checks",
    async () => {
      await page
        .locator("#claim")
        .fill("Independent unit-test log contains a zero-failure summary");
      await page
        .locator("#file")
        .setInputFiles("devpost/private-evidence/unit-first-run.txt");
      await page.locator("#type").selectOption("text");
      await page.locator("#criterion").fill("fail 0");
      await page.locator("#run").click();
      await page.locator("#result").filter({ hasText: "PASSED" }).waitFor();
      const r = await getReceipt();
      assert.equal(r.humanReview, null);
      await writeFile(
        "devpost/private-evidence/milestone-app-receipt.json",
        JSON.stringify(r, null, 2),
      );
    },
  );
  assert.deepEqual(external, []);
  assert.deepEqual(errors, []);
  report.status = "PASS";
} catch (e) {
  report.status = "FAIL";
  report.error = e.stack;
  throw e;
} finally {
  report.finished = new Date().toISOString();
  await writeFile(
    "devpost/private-evidence/browser-report.json",
    JSON.stringify(report, null, 2),
  );
  await browser.close();
  proc.kill();
}
