// Static server that behaves like GitHub Pages for this site: directory index, redirect of a
// directory without its trailing slash, 404.html with status 404. Serves the build (dist/).
// Used by test-lang.mjs, shots.mjs and lighthouse.mjs.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".avif": "image/avif", ".png": "image/png", ".jpg": "image/jpeg",
  ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8" };
export function serve(root, port) {
  root = normalize(root + "/");
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = normalize(join(root, path));
    if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    try {
      const s = await stat(file);
      if (s.isDirectory()) {
        if (!path.endsWith("/")) { res.writeHead(301, { Location: path + "/" }); return res.end(); }
        file = join(file, "index.html");
      }
      const body = await readFile(file);
      res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404, { "Content-Type": TYPES[".html"] });
      res.end(await readFile(join(root, "404.html")));
    }
  });
  return new Promise((r) => server.listen(port, "127.0.0.1", () => r(server)));
}
