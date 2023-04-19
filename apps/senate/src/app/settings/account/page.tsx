'use client'

import { useAccountModal } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useCookies } from 'react-cookie'
import { useAccount } from 'wagmi'
import NotConnected from './components/csr/NotConnected'
import UserAddress from './components/csr/UserAddress'
import { useEffect } from 'react'

export default function Home() {
    if (process.env.OUTOFSERVICE === 'true') redirect('/outofservice')
    const [cookie] = useCookies(['hasSeenLanding'])
    useEffect(() => {
        if (!cookie.hasSeenLanding) redirect('/landing')
    }, [cookie])

    const account = useAccount()
    const session = useSession()
    const { openAccountModal } = useAccountModal()

    return (
        <div className='flex min-h-screen flex-col gap-12'>
            <div className='flex flex-col gap-4'>
                {!account.address || session.status != 'authenticated' ? (
                    <NotConnected />
                ) : (
                    <>
                        <UserAddress />
                        <button
                            className='w-fit bg-black px-4 py-2 font-bold text-white hover:scale-105'
                            onClick={() => {
                                openAccountModal ? openAccountModal() : null
                            }}
                        >
                            Disconnect Wallet
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
