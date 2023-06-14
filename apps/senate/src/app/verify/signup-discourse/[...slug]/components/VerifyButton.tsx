'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

import { useEffect, useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { trpc } from '../../../../../server/trpcClient'
import { useRouter } from 'next/navigation'

export const VerifyButton = (props: { challenge: string }) => {
    const router = useRouter()

    const message = `Welcome to Senate! \nchallenge: ${props.challenge}`
    const [signPopup, setSignPopup] = useState(false)
    const { address, isConnected, connector: activeConnector } = useAccount()
    const { signMessage, data: signedMessage } = useSignMessage({
        message: message
    })

    const verify = trpc.verify.discourseSignup.useMutation()

    useEffect(() => {
        if (
            address &&
            activeConnector &&
            signMessage &&
            isConnected &&
            !signPopup
        ) {
            setSignPopup(true)
            signMessage()
        }
    }, [address, isConnected, activeConnector, signMessage])

    useEffect(() => {
        if (signedMessage)
            verify.mutate(
                {
                    challenge: props.challenge,
                    message: message,
                    address: address ?? '',
                    signature: signedMessage ?? ''
                },
                {
                    onSuccess: () => {
                        if (router) router.push('/daos?connect')
                    }
                }
            )
    }, [signedMessage])

    return <ConnectButton showBalance={false} />
}
