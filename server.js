// Custom entry point for hosts (e.g. GoDaddy's Node.js App / Passenger) that expect
// a plain Node HTTP server file to launch, rather than running `next start` directly.
// Follows the current Next.js custom-server guide: pass the raw request to Next.js. (Handing it a
// URL pre-parsed with the legacy `url.parse()` breaks client navigations after Server Action redirects.)
// Database setup runs in instrumentation.ts, which Next.js completes before handling any request.
const { createServer } = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
// Tell Next.js where it is listening. Without this it assumes localhost:3000 for its own internal
// requests (e.g. rendering the page a Server Action redirects to), which breaks on any other port.
const app = next({ dev, hostname: "localhost", port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log(`Ready on port ${port} (${dev ? "development" : "production"})`);
  });
});
