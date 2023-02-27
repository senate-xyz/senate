'use client'

import { useClerk } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

const NotConnected = () => {
    const { openSignIn } = useClerk()
    const pathname = usePathname()

    return (
        <div>
            <div className='flex flex-col gap-5'>
                <p className='text-[15px] text-[#D9D9D9]'>
                    Please connect your wallet to customize your Account
                    settings
                </p>
                <button
                    className='w-fit bg-zinc-800 py-2 px-4 font-bold text-white hover:scale-105'
                    onClick={() => openSignIn({ redirectUrl: pathname })}
                >
                    Connect Wallet
                </button>
            </div>
        </div>
    )
}

export default NotConnected
