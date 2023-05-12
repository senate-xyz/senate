/** @type {import("next").NextConfig} */
const config = {
    experimental: {
        appDir: true
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
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve = {
                ...config.resolve,
                fallback: {
                    net: false,
                    tls: false,
                    fs: false
                }
            }
        }

        return config
    }
}
export default config
