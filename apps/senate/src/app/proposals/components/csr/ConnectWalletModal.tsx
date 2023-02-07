'use client'

import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

const ConnectWalletModal = () => {
    const { openConnectModal } = useConnectModal()
    const session = useSession()

    useEffect(() => {
        if (openConnectModal && session.status != 'authenticated')
            openConnectModal()
    }, [session])

    return <div />
}

export default ConnectWalletModal
