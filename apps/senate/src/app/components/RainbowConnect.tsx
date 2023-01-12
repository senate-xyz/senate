'use client'

import {
    ConnectButton,
    RainbowKitProvider,
    darkTheme,
    getDefaultWallets
} from '@rainbow-me/rainbowkit'
import { SessionProvider } from 'next-auth/react'
import type { GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth'
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth'
import {
    configureChains,
    mainnet,
    createClient,
    WagmiConfig,
    useAccount
} from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

const RainbowConnectButton = () => {
    // const session = useSession()
    // const newUser = trpc.user.settings.isNewUser.useQuery(void 0, {
    //     context: appQueryContext
    // })

    // if (newUser.data) {
    //     if (newUser.data.newUser && session.status == 'authenticated') {
    //         router.push('/new-user')
    //     }
    // }

    // useEffect(() => {
    //     newUser.refetch()
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [session])

    const { address } = useAccount()
    const router = useRouter()

    useEffect(() => {
        router.refresh()
    }, [address])

    return <ConnectButton showBalance={false} />
}

export const RainbowConnect = () => {
    return (
        <>
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
                            <RainbowConnectButton />
                        </RainbowKitProvider>
                    </RainbowKitSiweNextAuthProvider>
                </SessionProvider>
            </WagmiConfig>
        </>
    )
}
