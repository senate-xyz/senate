import {
    getDefaultWallets,
    RainbowKitProvider,
    darkTheme
} from '@rainbow-me/rainbowkit'
import {
    type GetSiweMessageOptions,
    RainbowKitSiweNextAuthProvider
} from '@rainbow-me/rainbowkit-siwe-next-auth'
import { SessionProvider } from 'next-auth/react'
import { configureChains, mainnet, createClient, WagmiConfig } from 'wagmi'
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

export default function RootProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
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
                            {children}
                        </RainbowKitProvider>
                    </RainbowKitSiweNextAuthProvider>
                </SessionProvider>
            </WagmiConfig>
        </TrpcClientProvider>
    )
}
