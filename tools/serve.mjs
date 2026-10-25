import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = new URL("../", import.meta.url);
const assets = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/styles.css", "styles.css"],
  ...["app", "checks", "review", "state", "receipts"].map((n) => [
    `/src/${n}.js`,
    `src/${n}.js`,
  ]),
]);
export function createServer() {
  return http.createServer(async (req, res) => {
    const path = req.url?.split("?")[0];
    const asset = assets.get(path);
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405);
      return res.end();
    }
    if (!asset) {
      res.writeHead(404);
      return res.end("Not found");
    }
    try {
      const data = await readFile(new URL(asset, root));
      res.writeHead(200, {
        "Content-Type": asset.endsWith(".js")
          ? "text/javascript; charset=utf-8"
          : asset.endsWith(".css")
            ? "text/css; charset=utf-8"
            : "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy":
          "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'none'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      });
      res.end(req.method === "HEAD" ? undefined : data);
    } catch {
      res.writeHead(500);
      res.end("Asset unavailable");
    }
  });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createServer();
  server.on("error", (e) => {
    console.error(e.message);
    process.exitCode = 1;
  });
  server.listen(0, "127.0.0.1", () =>
    console.log(`Proof Before Done: http://127.0.0.1:${server.address().port}`),
  );
}
