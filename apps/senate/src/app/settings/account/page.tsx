'use client'

import { useAccountModal } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useCookies } from 'react-cookie'
import { useAccount } from 'wagmi'
import NotConnected from './components/csr/NotConnected'
import UserAddress from './components/csr/UserAddress'

export default function Home() {
    if (process.env.OUTOFSERVICE === 'true') redirect('/outofservice')
    const [cookie] = useCookies(['hasSeenLanding'])
    if (!cookie.hasSeenLanding) redirect('/landing')

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
                            className='w-fit bg-black py-2 px-4 font-bold text-white hover:scale-105'
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
