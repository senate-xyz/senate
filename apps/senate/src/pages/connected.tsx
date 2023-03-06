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
        if (!searchParams) return
        if (!searchParams.get('redirect')) return
        if (!cookie.acceptedTerms || !cookie.acceptedTermsTimestamp)
            router.push('/landing')

        console.log(cookie)
        console.log(searchParams)

        storeTerms.mutate(
            {
                value: Boolean(cookie.acceptedTerms),
                timestamp: Number(cookie.acceptedTermsTimestamp)
            },
            {
                onSuccess: () => {
                    setCookie('connected', true)
                    router.push(searchParams.get('redirect') ?? '/daos')
                }
            }
        )
    }, [searchParams])

    return <></>
}

export default ConnectedWrapper
