/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverActionsBodySizeLimit: "2mb",
  },
  output: "standalone",
  images: {
    unoptimized: false,
  },
};

module.exports = nextConfig;
