'use client'

import { RainbowConnect } from '../../../../components/csr/RainbowConnect'

export const NotConnected = () => {
    return (
        <div>
            <div className='flex flex-col gap-5'>
                <RainbowConnect />

                <p className='text-[15px] text-[#D9D9D9]'>
                    Please connect your wallet to customize your Account
                    settings
                </p>
            </div>
        </div>
    )
}
