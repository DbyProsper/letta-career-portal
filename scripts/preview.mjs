import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, relative, extname, sep } from "node:path";
const root = resolve("out");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".txt": "text/plain",
  ".webp": "image/webp",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ico": "image/x-icon",
};
const port = Number(process.env.PORT || 4173);
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let filename = resolve(root, "." + decodeURIComponent(url.pathname));
    const rel = relative(root, filename);
    if (rel === ".." || rel.startsWith(".." + sep)) {
      res.writeHead(403).end();
      return;
    }
    if ((await stat(filename)).isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        res.writeHead(308, { location: url.pathname + "/" + url.search }).end();
        return;
      }
      filename = resolve(filename, "index.html");
    }
    const data = await readFile(filename);
    res
      .writeHead(200, {
        "Content-Type": types[extname(filename)] || "application/octet-stream",
      })
      .end(data);
  } catch {
    res.writeHead(404).end("Page not found");
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log("Local preview http://127.0.0.1:" + port),
);
