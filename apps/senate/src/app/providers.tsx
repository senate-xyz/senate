import {
    RainbowKitProvider,
    darkTheme,
    DisclaimerComponent,
    getDefaultWallets
} from '@rainbow-me/rainbowkit'
import {
    type GetSiweMessageOptions,
    RainbowKitSiweNextAuthProvider
} from '@rainbow-me/rainbowkit-siwe-next-auth'
import { SessionProvider } from 'next-auth/react'
import { configureChains, mainnet, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { TrpcClientProvider } from '../server/trpcClient'
import Link from 'next/link'

const { chains, provider } = configureChains(
    [mainnet],
    [alchemyProvider({ apiKey: '4fIvNq7_9CmJ4721zCsSd6_CoeAwDg9_' })]
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

const Disclaimer: DisclaimerComponent = () => (
    <div className='ml-2 select-none text-sm font-light text-white'>
        By connecting your wallet, you agree to the{' '}
        <Link
            href={
                'https://senate.notion.site/Senate-Labs-Terms-of-Service-990ca9e655094b6f9673a3ead572956a'
            }
            className='underline'
            target='_blank'
        >
            Terms of Service
        </Link>
        ,{' '}
        <Link
            href={
                'https://senate.notion.site/Senate-Labs-Privacy-Policy-494e23d8a4e34d0189bfe07e0ae01bde'
            }
            className='underline'
            target='_blank'
        >
            Privacy Policy
        </Link>{' '}
        and{' '}
        <Link
            href={
                'https://senate.notion.site/Senate-Labs-Cookie-Policy-b429fe7b181e4cfda95f404f480bfdc7'
            }
            className='underline'
            target='_blank'
        >
            Cookie Policy
        </Link>{' '}
    </div>
)

export default function RootProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <WagmiConfig client={wagmiClient}>
            <SessionProvider refetchInterval={60}>
                <RainbowKitSiweNextAuthProvider
                    getSiweMessageOptions={getSiweMessageOptions}
                >
                    <RainbowKitProvider
                        appInfo={{
                            appName: 'Senate',
                            disclaimer: Disclaimer,
                            learnMoreUrl: 'https://senate.notion.site'
                        }}
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
                        <TrpcClientProvider>{children}</TrpcClientProvider>
                    </RainbowKitProvider>
                </RainbowKitSiweNextAuthProvider>
            </SessionProvider>
        </WagmiConfig>
    )
}
