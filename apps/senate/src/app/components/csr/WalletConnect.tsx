'use client'

import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

const WalletConnect = () => {
    const router = useRouter()
    const account = useAccount()
    const session = useSession()

    const { connector: activeConnector } = useAccount()

    useEffect(() => {
        const handleConnectorUpdate = ({ account }) => {
            if (account) {
                signOut()
                console.log('account change')
            }
        }

        if (activeConnector) {
            activeConnector.on('change', handleConnectorUpdate)
        }
    }, [activeConnector])

    useEffect(() => {
        router.refresh()
    }, [account.isConnected, account.isDisconnected, session.status])

    return <ConnectButton showBalance={false} />
}

export default WalletConnect
