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

    useEffect(() => {
        console.log(session)
    }, [session])

    useEffect(() => {
        console.log(session)
        if (router) router.refresh()
    }, [session, router])

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
            <div className='text-white'></div>
            <ClientOnly>
                <RainbowConnectButton />
            </ClientOnly>
        </div>
    )
}
