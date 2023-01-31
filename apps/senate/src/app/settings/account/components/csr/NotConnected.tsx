'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import ClientOnly from '../../../../clientOnly'

export const NotConnected = () => {
    return (
        <div>
            <ClientOnly>
                <div className='flex flex-col gap-5'>
                    <ConnectButton />
                    <p className='text-[15px] text-[#D9D9D9]'>
                        Please connect your wallet to customize your Account
                        settings
                    </p>
                </div>
            </ClientOnly>
        </div>
    )
}
