/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.mbsm.io", "media.baraag.net"],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
};

module.exports = nextConfig;
