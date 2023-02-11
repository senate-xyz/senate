'use client'

import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'

const NotConnected = () => {
    const session = useSession()
    const { openConnectModal } = useConnectModal()

    if (session?.status != 'authenticated')
        return (
            <div>
                <div className='flex flex-col gap-5'>
                    <p className='text-[15px] text-[#D9D9D9]'>
                        Please connect your wallet to customize your Account
                        settings
                    </p>
                    <button
                        className='w-fit bg-zinc-800 py-2 px-4 font-bold text-white hover:scale-105'
                        onClick={openConnectModal}
                    >
                        Connect Wallet
                    </button>
                </div>
            </div>
        )
    return <></>
}

export default NotConnected
