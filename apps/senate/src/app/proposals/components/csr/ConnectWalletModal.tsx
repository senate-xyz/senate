'use client'

import { useSession } from 'next-auth/react'
import { RainbowConnect } from '../../../components/csr/RainbowConnect'

const ConnectWalletModal = () => {
    const session = useSession()

    return (
        <>
            {session.status != 'authenticated' && (
                <div className='absolute flex h-full w-full scale-x-[1.025] justify-center backdrop-blur'>
                    <div className='pt-48 '>
                        <RainbowConnect />
                    </div>
                </div>
            )}
        </>
    )
}

export default ConnectWalletModal
