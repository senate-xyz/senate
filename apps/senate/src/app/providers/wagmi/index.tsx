import { WagmiConfig, configureChains, createClient, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

const { provider } = configureChains([mainnet], [publicProvider()])

const wagmiClient = createClient({
    autoConnect: true,
    provider
})

const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
    return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
}

export default WagmiProvider
