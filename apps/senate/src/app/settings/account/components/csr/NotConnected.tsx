'use client'

import { useConnectModal } from '@rainbow-me/rainbowkit'

const NotConnected = () => {
    const { openConnectModal } = useConnectModal()
    return (
        <div>
            <div className='flex flex-col gap-5'>
                <p className='text-[15px] text-[#D9D9D9]'>
                    Please connect your wallet to customize your Account
                    settings
                </p>
                <button
                    className='w-fit bg-zinc-800 px-4 py-2 font-bold text-white hover:scale-105'
                    onClick={() => {
                        openConnectModal ? openConnectModal() : null
                    }}
                >
                    Connect Wallet
                </button>
            </div>
        </div>
    )
}

export default NotConnected
