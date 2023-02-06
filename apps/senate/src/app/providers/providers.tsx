'use client'

import { TrpcClientProvider } from '../../client/trpcClient'
import WagmiProvider from './wagmi'

const RootProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <WagmiProvider>
                <TrpcClientProvider>{children} </TrpcClientProvider>
            </WagmiProvider>
        </div>
    )
}

export default RootProvider
