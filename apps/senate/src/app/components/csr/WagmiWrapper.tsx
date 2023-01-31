'use client'

import {
    RainbowKitProvider,
    darkTheme,
    getDefaultWallets
} from '@rainbow-me/rainbowkit'
import { SessionProvider } from 'next-auth/react'
import type { GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth'
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth'
import { configureChains, mainnet, createClient, WagmiConfig } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider } = configureChains(
    [mainnet],
    [
        jsonRpcProvider({
            rpc: () => ({
                http: process.env.NEXT_PUBLIC_PROVIDER_URL ?? 'missing_key'
            })
        }),
        publicProvider()
    ]
)

const { connectors } = getDefaultWallets({
    appName: 'Senate',
    chains
})

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: 'Sign in to Senate'
})

export const WagmiWrapper = (props: { children: JSX.Element }) => {
    return (
        <WagmiConfig client={wagmiClient}>
            <SessionProvider refetchInterval={60}>
                <RainbowKitSiweNextAuthProvider
                    getSiweMessageOptions={getSiweMessageOptions}
                >
                    <RainbowKitProvider
                        chains={chains}
                        theme={darkTheme({
                            accentColor: '#262626',
                            accentColorForeground: 'white',
                            borderRadius: 'medium',
                            overlayBlur: 'small'
                        })}
                    >
                        {props.children}
                    </RainbowKitProvider>
                </RainbowKitSiweNextAuthProvider>
            </SessionProvider>
        </WagmiConfig>
    )
}
