// Custom entry point for hosts (e.g. GoDaddy's Node.js App / Passenger) that expect
// a plain Node HTTP server file to launch, rather than running `next start` directly.
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res, parse(req.url, true));
  }).listen(port, () => {
    console.log(`Ready on port ${port}`);
  });
});
