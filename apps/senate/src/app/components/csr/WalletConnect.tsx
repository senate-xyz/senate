'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { signOut, useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useAccount } from 'wagmi'
import { disconnect } from '@wagmi/core'
import { trpc } from '../../../server/trpcClient'

const WalletConnect = () => {
    const router = useRouter()
    const account = useAccount()
    const session = useSession()
    const acceptedTerms = trpc.accountSettings.getAcceptedTerms.useQuery()
    const acceptedTermsTimestamp =
        trpc.accountSettings.getAcceptedTermsTimestamp.useQuery()

    const { connector: activeConnector } = useAccount()

    useEffect(() => {
        const handleConnectorUpdate = ({ account }) => {
            if (account) {
                signOut()
            }
        }

        if (activeConnector) {
            activeConnector.on('change', handleConnectorUpdate)
        }
    }, [activeConnector])

    useEffect(() => {
        router.refresh()
    }, [account.isConnected, account.isDisconnected, session.status])

    useEffect(() => {
        const disconnectForTerms = async () => {
            await disconnect()
        }

        if (
            session.status == 'authenticated' &&
            acceptedTerms.isSuccess &&
            acceptedTermsTimestamp.isSuccess
        ) {
            if (!(acceptedTerms.data && acceptedTermsTimestamp.data)) {
                disconnectForTerms()
            }
        }
    }, [acceptedTerms.isFetched, acceptedTermsTimestamp.isFetched])

    if (process.env.OUTOFSERVICE === 'true') redirect('/outofservice')
    const [cookie] = useCookies(['hasSeenLanding'])
    useEffect(() => {
        if (!cookie.hasSeenLanding) redirect('/landing')
    }, [cookie])

    return <ConnectButton showBalance={false} />
}

export default WalletConnect
