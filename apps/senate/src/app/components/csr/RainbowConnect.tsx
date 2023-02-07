'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import ClientOnly from '../../clientOnly'
import { trpc } from '../../../server/trpcClient'
import { useRouter } from 'next/navigation'

const RainbowConnectButton = () => {
    const session = useSession()
    const router = useRouter()
    const newUser = trpc.accountSettings.isNewUser.useQuery()

    if (newUser.data) {
        if (newUser.data && session.status == 'authenticated') {
            router.push('/signup')
        }
    }

    useEffect(() => {
        newUser.refetch()
    }, [session])

    return <ConnectButton showBalance={false} />
}

export const RainbowConnect = () => {
    return (
        <div>
            <div className='text-white'></div>
            <ClientOnly>
                <RainbowConnectButton />
            </ClientOnly>
        </div>
    )
}
