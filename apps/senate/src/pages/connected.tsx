'use client'
import '../styles/globals.css'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import RootProvider from '../app/components/providers/providers'
import { trpc } from '../server/trpcClient'

const ConnectedWrapper = () => {
    return (
        <div className='min-h-screen w-full bg-black'>
            <RootProvider>
                <Connected />
            </RootProvider>
        </div>
    )
}

const Connected = () => {
    const searchParams = useSearchParams()

    const router = useRouter()
    const [cookie] = useCookies(['acceptedTerms', 'acceptedTermsTimestamp'])

    const storeTerms = trpc.accountSettings.setTerms.useMutation()

    useEffect(() => {
        if (!searchParams) return
        if (!searchParams.get('redirect')) return
        if (!cookie.acceptedTerms) return
        if (!cookie.acceptedTermsTimestamp) return

        console.log(cookie)
        console.log(searchParams)

        storeTerms.mutate(
            {
                value: Boolean(cookie.acceptedTerms),
                timestamp: Number(cookie.acceptedTermsTimestamp)
            },
            {
                onSuccess: () => {
                    router.push(searchParams.get('redirect') ?? '/')
                }
            }
        )
    }, [searchParams])

    return <></>
}

export default ConnectedWrapper
