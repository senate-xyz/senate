'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import WalletConnect from '../../../components/csr/WalletConnect'

const ConnectWalletModal = () => {
    const account = useAccount()
    const session = useSession()
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (!account.isConnected || session.status != 'authenticated')
            setShow(true)
        else setShow(false)
    }, [account.isConnected, session.status])

    return (
        <div>
            {show && (
                <div className='absolute flex h-full w-full scale-x-[1.025] flex-col items-center backdrop-blur'>
                    <div className='mt-32'>
                        <WalletConnect />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ConnectWalletModal
