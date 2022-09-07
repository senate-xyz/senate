/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
