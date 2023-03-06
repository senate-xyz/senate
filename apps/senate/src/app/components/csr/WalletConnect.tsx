'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useAccount } from 'wagmi'

const WalletConnect = () => {
    const pathname = usePathname()
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
            router.push(`/connected?redirect=${pathname}`)
    }, [account, session.status, cookie])

    // useEffect(() => {
    //     if (account.isConnected || account.isDisconnected) router.refresh()
    // }, [account])

    return <ConnectButton />
}

export default WalletConnect
