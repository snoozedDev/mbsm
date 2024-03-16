/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.mbsm.io",
        port: "",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
};

module.exports = nextConfig;
