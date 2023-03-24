'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

const WalletConnect = () => {
    const router = useRouter()
    const account = useAccount()
    const session = useSession()

    useEffect(() => {
        router.refresh()
    }, [account.isConnected, account.isDisconnected, session.status])

    return <ConnectButton showBalance={false} />
}

export default WalletConnect
