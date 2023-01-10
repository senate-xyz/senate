import { ConnectButton } from '@rainbow-me/rainbowkit'
import router from 'next/router'
import { trpc } from '../utils/trpc'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

const RainbowConnect = () => {
    const session = useSession()
    const newUser = trpc.user.settings.newUser.useQuery()

    if (newUser.data) {
        if (newUser.data.newUser && session.status == 'authenticated') {
            router.push('/new-user')
        }
    }

    useEffect(() => {
        newUser.refetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])

    return <ConnectButton showBalance={false} />
}

export default RainbowConnect
