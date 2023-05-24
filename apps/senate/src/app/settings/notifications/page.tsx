'use client'

import { redirect, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useAccount } from 'wagmi'
import UserEmail from './components/csr/UserEmail'
import IsUniswapUser from './components/csr/IsUniswapUser'
import IsAaveUser from './components/csr/IsAaveUser'
import Discord from './components/csr/Discord'
import Telegram from './components/csr/Telegram'

export default function Home() {
    if (process.env.OUTOFSERVICE === 'true') redirect('/outofservice')
    const [cookie] = useCookies(['hasSeenLanding'])
    useEffect(() => {
        if (!cookie.hasSeenLanding) redirect('/landing')
    }, [cookie])

    const account = useAccount()
    const router = useRouter()

    useEffect(() => {
        if (!account.isConnected) router.push('/settings/account')
    }, [account])

    return (
        <div className='flex min-h-screen flex-col gap-12'>
            <div className='flex flex-col gap-4'>
                <div className='text-[24px] font-light leading-[30px] text-white'>
                    Your Notifications
                </div>
            </div>

            <UserEmail />
            <Discord />
            <Telegram />
            <div className='flex flex-row gap-8'>
                <IsAaveUser />
                <IsUniswapUser />
            </div>
        </div>
    )
}
