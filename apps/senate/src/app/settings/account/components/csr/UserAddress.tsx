'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useAccount, useProvider } from 'wagmi'

const UserAddress = () => {
    const session = useSession()
    const account = useAccount()
    const provider = useProvider()

    const [ens, setEns] = useState('')

    useEffect(() => {
        if (session.status === 'authenticated' && account.address) {
            provider.lookupAddress(account.address).then((ens) => {
                setEns(ens ?? '')
            })
        }
    }, [account.address])

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
                        {account.address}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserAddress
