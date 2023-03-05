'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useProvider } from 'wagmi'

const UserAddress = () => {
    const user = useUser()
    const provider = useProvider()

    const [ens, setEns] = useState('')

    useEffect(() => {
        if (user.user?.web3Wallets[0]?.web3Wallet) {
            provider
                .lookupAddress(user.user?.web3Wallets[0]?.web3Wallet)
                .then((ens) => {
                    setEns(ens ?? '')
                })
        }
    }, [user.user?.web3Wallets[0]?.web3Wallet])

    return (
        <div>
            <div className='flex flex-col gap-2'>
                <div className='text-[24px] font-light leading-[30px] text-white'>
                    Your Account Address
                </div>

                <div className='flex flex-col gap-6'>
                    <div className='text-[18px] font-thin text-white'>
                        {ens}
                    </div>
                    <div className='text-[18px] font-thin text-[#ABABAB]'>
                        {user.user?.web3Wallets[0]?.web3Wallet}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserAddress
