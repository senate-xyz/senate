'use client'
import '../styles/globals.css'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { trpc, TrpcClientProvider } from '../server/trpcClient'

const ConnectedWrapper = () => {
    return (
        <TrpcClientProvider>
            <div className='min-h-screen w-full bg-black'>
                <Connected />
            </div>
        </TrpcClientProvider>
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
        // if (!searchParams || !searchParams?.get('redirect'))
        //     router.push('/daos')
        if (!cookie.acceptedTerms || !cookie.acceptedTermsTimestamp)
            router.push('/landing')

        storeTerms.mutate(
            {
                value: Boolean(cookie.acceptedTerms),
                timestamp: Number(cookie.acceptedTermsTimestamp)
            },
            {
                onSuccess: () => {
                    setCookie('connected', true)
                    router.push(searchParams?.get('redirect') ?? '/daos')
                },
                onError: () => {
                    router.push('/landing')
                }
            }
        )
    }, [cookie])

    return <></>
}

export default ConnectedWrapper
