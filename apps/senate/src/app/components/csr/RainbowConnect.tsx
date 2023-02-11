'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'
import { useEffect, useReducer } from 'react'
import ClientOnly from '../../clientOnly'
import { trpc } from '../../../server/trpcClient'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

const RainbowConnectButton = () => {
    const session = useSession()
    const { address } = useAccount()
    const router = useRouter()
    const newUser = trpc.accountSettings.isNewUser.useQuery()

    const [, forceUpdate] = useReducer((x) => x + 1, 0)

    useEffect(() => {
        forceUpdate()
        router.refresh()
    }, [session, router, address])

    useEffect(() => {
        if (newUser.data && session.status == 'authenticated') {
            router.push('/signup')
        }
    }, [newUser.data])

    useEffect(() => {
        newUser.refetch()
    }, [session.status == 'authenticated'])

    return <ConnectButton showBalance={false} />
}

export const RainbowConnect = () => {
    return (
        <div>
            <ClientOnly>
                <RainbowConnectButton />
            </ClientOnly>
        </div>
    )
}
