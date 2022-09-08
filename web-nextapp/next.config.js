/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
