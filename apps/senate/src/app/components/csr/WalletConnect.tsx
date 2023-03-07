'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useAccount } from 'wagmi'

const WalletConnect = () => {
    const router = useRouter()
    const account = useAccount()
    const session = useSession()
    const [cookie] = useCookies(['connected'])

    useEffect(() => {
        if (
            account.isConnected &&
            session.status == 'authenticated' &&
            !cookie.connected
        )
            router.push(`/connected?redirect=/daos`)
    }, [account, session.status, cookie])

    useEffect(() => {
        router.refresh()
    }, [account.isConnected, account.isDisconnected, session.status])

    return <ConnectButton showBalance={false} />
}

export default WalletConnect
