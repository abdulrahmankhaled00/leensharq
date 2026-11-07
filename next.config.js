/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Dashboard forms send at most one 2 MB image plus text fields through Server Actions.
    serverActions: {
      bodySizeLimit: "3mb",
    },
    // The proxy buffers every request body (10 MB by default). The company-profile PDF (up to 32 MB)
    // goes to its own route handler, app/admin/api/company-profile, which enforces the 32 MB limit itself.
    proxyClientMaxBodySize: "33mb",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    qualities: [72, 75],
  },
};

module.exports = nextConfig;
