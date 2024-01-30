/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["cdn.mbsm.io"],
    // only on production
    // path:
    //   process.env.IS_PROD === "true"
    //     ? "https://d37z774to8iieg.cloudfront.net/_next/image"
    //     : undefined,
    // minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["host.docker.internal:3000", "mbsm.local"],
    },
  },
};

module.exports = nextConfig;
