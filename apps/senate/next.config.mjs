/** @type {import("next").NextConfig} */
const config = {
    experimental: {
        appDir: true
    },
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [
            's2.coinmarketcap.com',
            'avatars.githubusercontent.com',
            'assets.coingecko.com',
            'cdn.stamp.fyi',
            'seeklogo.com',
            'docs.synthetix.io'
        ]
    }
}
export default config
