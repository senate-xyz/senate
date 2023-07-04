/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverActions: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "localhost",
      "senatelabs.xyz",
      "s2.coinmarketcap.com",
      "avatars.githubusercontent.com",
      "assets.coingecko.com",
      "cdn.stamp.fyi",
      "seeklogo.com",
      "docs.synthetix.io",
    ],
  },
  async redirects() {
    return [
      {
        source: "/daos",
        destination: "/orgs",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/ingest/:path*",
        destination: "https://app.posthog.com/:path*/",
      },
    ];
  },
};
export default config;
