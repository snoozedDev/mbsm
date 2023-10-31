/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.mbsm.io"],
    // only on production
    path:
      process.env.NODE_ENV === "production"
        ? "https://d37z774to8iieg.cloudfront.net/_next/image"
        : undefined,
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
};

module.exports = nextConfig;
