import { WagmiConfig, configureChains, createClient, mainnet } from 'wagmi'
import {
    RainbowKitProvider,
    darkTheme,
    getDefaultWallets
} from '@rainbow-me/rainbowkit'
import {
    type GetSiweMessageOptions,
    RainbowKitSiweNextAuthProvider
} from '@rainbow-me/rainbowkit-siwe-next-auth'
import { publicProvider } from 'wagmi/providers/public'
import { SessionProvider } from 'next-auth/react'

const { chains, provider } = configureChains([mainnet], [publicProvider()])

const { connectors } = getDefaultWallets({
    appName: 'Senate',
    chains
})

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

export const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: 'Sign in to Senate'
})

const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
    return (
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
    )
}

export default WagmiProvider
