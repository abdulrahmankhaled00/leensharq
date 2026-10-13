const http = require("http");
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "out");
const port = process.env.PORT || 3000;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function resolveFilePath(reqUrl) {
  // Work with the URL path using forward slashes BEFORE joining it onto
  // an OS-specific path (path.join would turn "/" into "\" on Windows).
  let urlPath = reqUrl.split("?")[0];
  if (urlPath.endsWith("/")) urlPath += "index.html";

  let filePath = path.join(outDir, decodeURIComponent(urlPath));
  if (!path.extname(filePath)) filePath += ".html";
  return filePath;
}

http
  .createServer((req, res) => {
    const filePath = resolveFilePath(req.url);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        fs.readFile(path.join(outDir, "404.html"), (e2, data2) => {
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end(data2 || "Not found");
        });
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(port, () => console.log("Running on port " + port));
