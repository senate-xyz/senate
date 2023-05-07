import '@rainbow-me/rainbowkit/styles.css'
import '../../styles/globals.css'
import {
    ConnectButton,
    DisclaimerComponent,
    RainbowKitProvider,
    connectorsForWallets,
    darkTheme
} from '@rainbow-me/rainbowkit'
import {
    injectedWallet,
    rainbowWallet,
    metaMaskWallet,
    coinbaseWallet,
    braveWallet,
    ledgerWallet,
    rabbyWallet
} from '@rainbow-me/rainbowkit/wallets'
import {
    configureChains,
    mainnet,
    createClient,
    WagmiConfig,
    useSignMessage
} from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { TrpcClientProvider, trpc } from '../../server/trpcClient'

const { chains, provider } = configureChains(
    [mainnet],
    [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? '' })]
)

const connectors = connectorsForWallets([
    {
        groupName: 'Recommended',
        wallets: [
            injectedWallet({ chains }),
            rainbowWallet({ chains }),
            metaMaskWallet({ chains })
        ]
    },
    {
        groupName: 'Others',
        wallets: [
            coinbaseWallet({ chains, appName: 'Senate' }),
            braveWallet({
                chains
            }),
            ledgerWallet({
                projectId: 'Senate',
                chains
            }),
            rabbyWallet({
                chains
            })
        ]
    }
])

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
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

const PageWrapper = () => {
    return (
        <WagmiConfig client={wagmiClient}>
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
                <TrpcClientProvider>
                    <Page />
                </TrpcClientProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    )
}

const Page = () => {
    const router = useRouter()

    const user = trpc.verify.userOfChallenge.useQuery({
        challenge: String(router.query.challenge)
    })

    const unsubscribe = trpc.verify.verifyUser.useMutation()

    const { data, signMessage } = useSignMessage({
        onSuccess(data, variables) {
            unsubscribe.mutate(
                {
                    challenge: String(router.query.challenge),
                    email: String(user.data?.email),
                    message: String(variables.message),
                    signature: data
                },
                {
                    onSuccess: () => {}
                }
            )
        }
    })

    return (
        <div>
            <p className='text-white'>code: {router.query.challenge}</p>
            <p className='text-white'>email: {user.data?.email}</p>
            <p>Signature: {data}</p>
            <ConnectButton showBalance={false} />
            <button
                className='bg-white px-4'
                onClick={() => {
                    signMessage({
                        message: `challenge: ${router.query.challenge} \nemail: ${user.data?.email}`
                    })
                }}
            >
                Sign to verify email
            </button>
        </div>
    )
}

export default PageWrapper
