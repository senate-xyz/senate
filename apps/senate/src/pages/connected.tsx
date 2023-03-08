'use client'
import '../styles/globals.css'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { trpc } from '../server/trpcClient'
import RootProvider from '../app/providers'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

const ConnectedWrapper = () => {
    return (
        <RootProvider>
            <div className='min-h-screen w-full bg-black'>
                <Connected />
            </div>
        </RootProvider>
    )
}

const Connected = () => {
    const searchParams = useSearchParams()

    const router = useRouter()

    const [cookie, setCookie] = useCookies([
        'acceptedTerms',
        'acceptedTermsTimestamp',
        'connected'
    ])

    const storeTerms = trpc.accountSettings.setTerms.useMutation()

    useEffect(() => {
        if (
            !cookie.connected &&
            storeTerms &&
            cookie.acceptedTerms &&
            cookie.acceptedTermsTimestamp &&
            storeTerms.isIdle
        ) {
            storeTerms.mutate(
                {
                    value: Boolean(cookie.acceptedTerms),
                    timestamp: Number(cookie.acceptedTermsTimestamp)
                },
                {
                    onSuccess: () => {
                        setCookie('connected', true, {
                            maxAge: 60 * 60 * 24 * 365
                        })
                    }
                }
            )
        }
    }, [cookie, storeTerms])

    useEffect(() => {
        if (cookie.connected)
            router.push(searchParams?.get('redirect') ?? '/daos')
    }, [cookie.connected])

    return <></>
}

export default ConnectedWrapper
