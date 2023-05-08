/** @type {import("next").NextConfig} */
const config = {
    experimental: {
        appDir: true,
        serverActions: true
    },
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [
            'localhost',
            'senatelabs.xyz',
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
