'use client'

import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'

const ConnectWalletModal = () => {
    const session = useSession()
    const { openConnectModal } = useConnectModal()

    if (session?.status != 'authenticated')
        return (
            <div className='absolute flex h-full w-full scale-x-[1.025] flex-col items-center backdrop-blur'>
                <div className='pt-48'>
                    <button
                        className='w-fit bg-zinc-800 py-2 px-4 font-bold text-white hover:scale-105'
                        onClick={openConnectModal}
                    >
                        Connect Wallet
                    </button>
                </div>
            </div>
        )
    else return <></>
}

export default ConnectWalletModal
