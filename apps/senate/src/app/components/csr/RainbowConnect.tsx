'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ClientOnly from '../../clientOnly'

const RainbowConnectButton = () => {
    // const session = useSession()
    // const newUser = trpc.user.settings.isNewUser.useQuery(void 0, {
    //     context: appQueryContext
    // })

    // if (newUser.data) {
    //     if (newUser.data.newUser && session.status == 'authenticated') {
    //         router.push('/new-user')
    //     }
    // }

    // useEffect(() => {
    //     newUser.refetch()
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [session])

    const router = useRouter()
    const session = useSession()

    useEffect(() => {
        router.refresh()
    }, [router, session])

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
