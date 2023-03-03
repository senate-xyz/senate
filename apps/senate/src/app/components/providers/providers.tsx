'use client'

import { TrpcClientProvider } from '../../../server/trpcClient'
import WagmiProvider from './wagmi'

const RootProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <TrpcClientProvider>
            <WagmiProvider>{children}</WagmiProvider>
        </TrpcClientProvider>
    )
}

export default RootProvider
