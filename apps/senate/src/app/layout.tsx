'use client'

import Link from 'next/link'
import '@rainbow-me/rainbowkit/styles.css'

import {
    darkTheme,
    getDefaultWallets,
    RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import '../styles/globals.css'
import { NavBar } from './components/csr/NavBar'
import {
    GetSiweMessageOptions,
    RainbowKitSiweNextAuthProvider
} from '@rainbow-me/rainbowkit-siwe-next-auth'
import { SessionProvider } from 'next-auth/react'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { TrpcClientProvider } from '../server/trpcClient'

const { chains, provider } = configureChains(
    [mainnet],
    [
        jsonRpcProvider({
            rpc: () => ({
                http: String(process.env.NEXT_PUBLIC_PROVIDER_URL)
            })
        })
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

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en'>
            <head />
            <body>
                <TrpcClientProvider>
                    <WagmiConfig client={wagmiClient}>
                        <SessionProvider refetchInterval={60}>
                            <RainbowKitSiweNextAuthProvider
                                getSiweMessageOptions={getSiweMessageOptions}
                            >
                                <RainbowKitProvider
                                    chains={chains}
                                    modalSize='compact'
                                    theme={darkTheme({
                                        accentColor: '#262626',
                                        accentColorForeground: 'white',
                                        borderRadius: 'none',
                                        overlayBlur: 'small',
                                        fontStack: 'rounded'
                                    })}
                                >
                                    <div className='h-full min-h-screen w-full bg-black'>
                                        <div className='absolute left-0 z-30 w-full justify-center bg-slate-300 p-1 text-center text-black'>
                                            This software is still in beta and
                                            some proposals, for some DAOs, at
                                            some times, fail to load. So it’s
                                            not totally reliable yet. If you
                                            find something wrong or missing or
                                            just plain weird,{' '}
                                            <Link
                                                className='underline'
                                                href='https://discord.gg/kwGCVqHVdX'
                                                target='_blank'
                                            >
                                                please let us know
                                            </Link>
                                            .
                                        </div>
                                        <div className='z-10 flex h-full min-h-screen w-full flex-row'>
                                            <div className='fixed'>
                                                <NavBar />
                                            </div>

                                            <div className='w-full'>
                                                {children}
                                            </div>
                                        </div>
                                    </div>
                                </RainbowKitProvider>
                            </RainbowKitSiweNextAuthProvider>
                        </SessionProvider>
                    </WagmiConfig>
                </TrpcClientProvider>
            </body>
        </html>
    )
}
