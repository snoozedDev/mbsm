/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.mbsm.io", "nf4afcgnw5gxczd6.public.blob.vercel-storage.com"],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
};

module.exports = nextConfig;
