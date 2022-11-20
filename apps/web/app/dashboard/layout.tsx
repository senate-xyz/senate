'use client'

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import {
    GetSiweMessageOptions,
    RainbowKitSiweNextAuthProvider,
} from '@rainbow-me/rainbowkit-siwe-next-auth'

import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren } from 'react'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { ClientProvider } from '../../client/trpcClient'
import NavBar from './navbar/NavBar'

const { chains, provider } = configureChains(
    [chain.mainnet],
    [
        infuraProvider({ apiKey: process.env.PROVIDER_URL ?? 'missing_key' }),
        publicProvider(),
    ]
)

const { connectors } = getDefaultWallets({
    appName: 'Senate',
    chains,
})

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
})

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: 'Sign in to Senate',
})

export default function RootLayout(props: PropsWithChildren) {
    return (
        <ClientProvider>
            <WagmiConfig client={wagmiClient}>
                <SessionProvider refetchInterval={0}>
                    <RainbowKitSiweNextAuthProvider
                        getSiweMessageOptions={getSiweMessageOptions}
                    >
                        <RainbowKitProvider chains={chains}>
                            <html lang="en">
                                <head />
                                <body>
                                    <div className="flex flex-row">
                                        <NavBar />
                                        <div className="min-h-screen w-full">
                                            <main>{props.children}</main>
                                        </div>
                                    </div>
                                </body>
                            </html>
                        </RainbowKitProvider>
                    </RainbowKitSiweNextAuthProvider>
                </SessionProvider>
            </WagmiConfig>
        </ClientProvider>
    )
}
